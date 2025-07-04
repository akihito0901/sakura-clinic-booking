import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Booking } from '@/types/booking';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// データディレクトリとファイルの初期化
async function ensureDataFiles(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify([], null, 2));
  }
}

// 全予約を取得
async function getAllBookings(): Promise<Booking[]> {
  await ensureDataFiles();
  
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('予約データの読み込みエラー:', error);
    return [];
  }
}

// 予約を保存
async function saveBookings(bookings: Booking[]): Promise<void> {
  await ensureDataFiles();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

// GET: 全予約取得
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    const allBookings = await getAllBookings();
    
    if (date) {
      // 特定日の予約のみ取得
      const dateBookings = allBookings.filter(booking => booking.date === date);
      return NextResponse.json({ bookings: dateBookings });
    } else {
      // 全予約取得
      return NextResponse.json({ bookings: allBookings });
    }
  } catch (error) {
    console.error('予約取得エラー:', error);
    return NextResponse.json(
      { error: '予約の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST: 新規予約作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const requiredFields = ['date', 'timeSlot', 'menuId', 'customerName', 'customerPhone', 'customerEmail'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} は必須項目です` },
          { status: 400 }
        );
      }
    }

    // 既存予約との重複チェック
    const existingBookings = await getAllBookings();
    const conflictingBooking = existingBookings.find(booking => 
      booking.date === body.date && booking.timeSlot === body.timeSlot
    );
    
    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'この時間は既に予約が入っています' },
        { status: 409 }
      );
    }

    // 新しい予約を作成
    const newBooking: Booking = {
      id: `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      date: body.date,
      timeSlot: body.timeSlot,
      duration: body.duration,
      menuId: body.menuId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      notes: body.notes || '',
      createdAt: new Date().toISOString()
    };

    existingBookings.push(newBooking);
    await saveBookings(existingBookings);

    console.log('✅ 新しい予約が作成されました:', newBooking.id);

    return NextResponse.json({
      booking: newBooking,
      message: '予約が正常に作成されました'
    });

  } catch (error) {
    console.error('予約作成エラー:', error);
    return NextResponse.json(
      { error: '予約の作成に失敗しました' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { Booking } from '@/types/booking';

// メモリベースの一時的なデータ保存（本番環境対応）
let bookingsData: Booking[] = [];

// データ初期化（メモリベース）
async function initializeData(): Promise<void> {
  console.log('🔄 メモリベースのデータ初期化...');
  console.log(`📋 現在の予約データ: ${bookingsData.length}件`);
}

// 全予約を取得
async function getAllBookings(): Promise<Booking[]> {
  await initializeData();
  console.log('📖 予約データを読み込み中...');
  console.log(`📋 ${bookingsData.length}件の予約データを読み込みました`);
  return bookingsData;
}

// 予約を保存
async function saveBookings(bookings: Booking[]): Promise<void> {
  console.log(`💾 ${bookings.length}件の予約データを保存中...`);
  bookingsData = bookings;
  console.log('✅ 予約データを保存しました（メモリベース）');
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
    console.log('🔄 新規予約作成リクエストを受信');
    const body = await request.json();
    console.log('📝 予約リクエストデータ:', body);
    
    // バリデーション
    console.log('🔍 必須フィールドのバリデーション中...');
    const requiredFields = ['date', 'timeSlot', 'menuId', 'customerName', 'customerPhone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`❌ 必須フィールド不足: ${field}`);
        return NextResponse.json(
          { error: `${field} は必須項目です` },
          { status: 400 }
        );
      }
    }
    console.log('✅ バリデーション完了');

    // 既存予約との重複チェック（時間帯の重複も含む）
    console.log('🔍 既存予約との重複チェック中...');
    const existingBookings = await getAllBookings();
    
    // 新しい予約の開始・終了時間を計算
    const parseTime = (timeString: string): number => {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const newBookingStart = parseTime(body.timeSlot);
    const newBookingEnd = newBookingStart + (body.duration || 60); // デフォルト60分
    console.log(`⏰ 新しい予約時間: ${body.timeSlot} (${newBookingStart}分 - ${newBookingEnd}分)`);
    
    const conflictingBooking = existingBookings.find(booking => {
      if (booking.date !== body.date) return false;
      
      const existingStart = parseTime(booking.timeSlot);
      const existingEnd = existingStart + booking.duration;
      
      // 時間帯の重複をチェック
      const hasConflict = (newBookingStart < existingEnd && newBookingEnd > existingStart);
      if (hasConflict) {
        console.log(`⚠️ 時間帯の重複を検出: 既存予約 ${booking.timeSlot} (${existingStart}分 - ${existingEnd}分)`);
      }
      return hasConflict;
    });
    
    if (conflictingBooking) {
      console.log('❌ 予約時間の重複により作成失敗');
      return NextResponse.json(
        { error: 'この時間帯は既に予約が入っています。別の時間をお選びください。' },
        { status: 409 }
      );
    }
    console.log('✅ 重複チェック完了');

    // 新しい予約を作成
    console.log('🆕 新しい予約を作成中...');
    const newBooking: Booking = {
      id: `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      date: body.date,
      timeSlot: body.timeSlot,
      duration: body.duration || 60, // デフォルト60分
      menuId: body.menuId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      notes: body.notes || '',
      createdAt: new Date().toISOString()
    };

    console.log('📝 作成された予約:', newBooking);
    
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
import { NextRequest, NextResponse } from 'next/server';
import { Booking } from '@/types/booking';

// メモリベースの一時的なデータ保存（メインのrouteと同じデータを参照）
declare global {
  var bookingsData: Booking[];
}

if (!global.bookingsData) {
  global.bookingsData = [];
}

// GET: 電話番号で予約検索
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { error: '電話番号を指定してください' },
        { status: 400 }
      );
    }

    console.log('🔍 予約検索:', phone);
    
    // 電話番号で検索（部分一致）
    const matchingBookings = global.bookingsData.filter((booking: Booking) => 
      booking.customerPhone && booking.customerPhone.includes(phone)
    );

    console.log(`📋 検索結果: ${matchingBookings.length}件`);

    return NextResponse.json({ 
      bookings: matchingBookings,
      total: matchingBookings.length
    });

  } catch (error) {
    console.error('予約検索エラー:', error);
    return NextResponse.json(
      { error: '予約の検索に失敗しました' },
      { status: 500 }
    );
  }
}
'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { MENU_ITEMS } from '@/config/clinic';

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('予約データの取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getMenuName = (menuId: string) => {
    const menu = MENU_ITEMS.find(m => m.id === menuId);
    return menu ? menu.name : menuId;
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    return `${parseInt(month)}/${parseInt(day)} (${dayNames[date.getDay()]})`;
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };


  const filteredBookings = selectedDate 
    ? bookings.filter(booking => booking.date === selectedDate)
    : bookings;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
              管理画面
            </h1>
            <p className="text-gray-600 text-lg">予約状況一覧</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
          {/* コントロールパネル */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">コントロールパネル</h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={loadBookings}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg"
              >
                🔄 更新
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg"
              >
                ← 予約画面
              </a>
            </div>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-800 mb-2">📈 総予約数</h3>
              <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-800 mb-2">📅 今日の予約</h3>
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length}
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-purple-800 mb-2">⭐ 無料体験</h3>
              <div className="text-3xl font-bold text-purple-600">
                {bookings.filter(b => b.menuId === 'first-free').length}
              </div>
            </div>
          </div>

          {/* 日付フィルター */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              日付でフィルター
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                onClick={() => setSelectedDate('')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                すべて表示
              </button>
            </div>
          </div>

          {/* 予約一覧 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📋 予約一覧 ({filteredBookings.length}件)
            </h2>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 text-lg">
                {selectedDate ? '選択した日付に予約がありません' : 'まだ予約がありません'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                テスト予約を作成するか、実際に予約フォームから予約してみてください
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-900">日時</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-900">お客様</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-900">施術内容</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-900">連絡先</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-900">予約ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings
                    .sort((a, b) => new Date(a.date + ' ' + a.timeSlot).getTime() - new Date(b.date + ' ' + b.timeSlot).getTime())
                    .map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <div className="font-medium">{formatDate(booking.date)}</div>
                        <div className="text-blue-600">
                          {booking.timeSlot} - {getEndTime(booking.timeSlot, booking.duration)}
                        </div>
                        <div className="text-xs text-gray-500">{booking.duration}分</div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <div className="font-medium">{booking.customerName}</div>
                        {booking.notes && (
                          <div className="text-xs text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                            {booking.notes}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <div className="font-medium">{getMenuName(booking.menuId)}</div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <div>📞 {booking.customerPhone}</div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {booking.id}
                        </code>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(booking.createdAt).toLocaleString('ja-JP')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* システム情報 */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-2">💾 システム情報</h3>
            <div className="text-sm text-gray-600">
              <div>データ保存先: <code>data/bookings.json</code></div>
              <div>Web完結型予約システム（外部API不要）</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
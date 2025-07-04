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
    const date = new Date(dateString);
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}/${date.getDate()} (${dayNames[date.getDay()]})`;
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const createTestBooking = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const testDate = tomorrow.toISOString().split('T')[0];

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: testDate,
          timeSlot: '10:00',
          duration: 60,
          menuId: 'first-free',
          customerName: 'テスト 太郎',
          customerPhone: '090-1234-5678',
          customerEmail: 'test@example.com',
          notes: 'テスト予約です'
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ テスト予約が作成されました！');
        loadBookings();
      } else {
        alert('❌ エラー: ' + data.error);
      }
    } catch (error) {
      alert('❌ テスト予約の作成に失敗しました');
    }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              📊 予約管理画面
            </h1>
            <div className="flex gap-4">
              <button
                onClick={loadBookings}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔄 更新
              </button>
              <button
                onClick={createTestBooking}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ➕ テスト予約作成
              </button>
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
                        <div className="text-gray-600 text-xs">✉️ {booking.customerEmail}</div>
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
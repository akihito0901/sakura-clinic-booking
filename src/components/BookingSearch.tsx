'use client';

import { useState } from 'react';
import { Booking } from '@/types/booking';
import { ALL_MENU_ITEMS } from '@/config/clinic';

interface BookingSearchProps {
  onClose: () => void;
}

export default function BookingSearch({ onClose }: BookingSearchProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResults, setSearchResults] = useState<Booking[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      alert('電話番号を入力してください');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/bookings/search?phone=${encodeURIComponent(phoneNumber)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data.bookings || []);
      } else {
        console.error('検索エラー:', data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('検索エラー:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    return `${parseInt(month)}月${parseInt(day)}日（${dayNames[date.getDay()]}）`;
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const getMenuName = (menuId: string) => {
    const menu = ALL_MENU_ITEMS.find(m => m.id === menuId);
    return menu?.name || menuId;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📞 予約検索
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 検索フォーム */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電話番号
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="090-1234-5678"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSearching}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium disabled:opacity-50"
          >
            {isSearching ? '検索中...' : '🔍 予約を検索'}
          </button>
        </form>

        {/* 検索結果 */}
        {hasSearched && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              検索結果
            </h3>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600">
                  該当する予約が見つかりませんでした
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {getMenuName(booking.menuId)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          予約ID: {booking.id}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {booking.isFirstTime ? '初回' : '2回目以降'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">日時:</span>
                        <span className="font-medium">
                          {formatDate(booking.date)} {booking.timeSlot} 〜 {getEndTime(booking.timeSlot, booking.duration)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">お名前:</span>
                        <span className="font-medium">{booking.customerName}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">電話番号:</span>
                        <span className="font-medium">{booking.customerPhone}</span>
                      </div>
                      
                      {booking.notes && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">備考:</span>
                          <span className="font-medium">{booking.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
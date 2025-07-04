'use client';

import { MenuItem } from '@/types/booking';

interface BookingConfirmationProps {
  bookingId: string;
  selectedDate: string;
  selectedTimeSlot: string;
  selectedMenu: MenuItem;
  customerData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
  };
  onNewBooking: () => void;
}

export default function BookingConfirmation({
  bookingId,
  selectedDate,
  selectedTimeSlot,
  selectedMenu,
  customerData,
  onNewBooking
}: BookingConfirmationProps) {
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}月${date.getDate()}日（${dayNames[date.getDay()]}）`;
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      {/* 成功アイコン */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">予約完了！</h2>
        <p className="text-gray-600">ご予約が正常に受け付けられました</p>
      </div>

      {/* 予約詳細 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
        <h3 className="font-bold text-gray-800 mb-4 text-center">📋 予約詳細</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">予約ID:</span>
            <span className="font-mono text-sm">{bookingId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">お名前:</span>
            <span className="font-medium">{customerData.customerName} 様</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">日時:</span>
            <span className="font-medium">
              {formatDateDisplay(selectedDate)}<br />
              {selectedTimeSlot} 〜 {getEndTime(selectedTimeSlot, selectedMenu.duration)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">施術内容:</span>
            <span className="font-medium">{selectedMenu.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">所要時間:</span>
            <span className="font-medium">{selectedMenu.duration}分</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">料金:</span>
            <span className="font-medium text-blue-600">
              {selectedMenu.price === 0 ? '無料' : `¥${selectedMenu.price.toLocaleString()}`}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">電話番号:</span>
            <span className="font-medium">{customerData.customerPhone}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">メール:</span>
            <span className="font-medium">{customerData.customerEmail}</span>
          </div>
          
          {customerData.notes && (
            <div>
              <span className="text-gray-600">ご要望:</span>
              <div className="mt-1 p-3 bg-white rounded border text-sm">
                {customerData.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 注意事項 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-bold text-yellow-800 mb-2">⚠️ ご来院前のお願い</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 予約時間の5分前までにお越しください</li>
          <li>• 保険証をお持ちの方はご持参ください</li>
          <li>• 動きやすい服装でお越しください</li>
          <li>• キャンセル・変更は前日までにお電話ください</li>
        </ul>
      </div>

      {/* 連絡先 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-blue-800 mb-2">📞 お問い合わせ</h4>
        <div className="text-blue-700">
          <div className="font-bold text-lg">070-5530-6656</div>
          <div className="text-sm mt-1">桜並木駅前の整骨院</div>
          <div className="text-sm">〒812-0895 福岡県福岡市博多区竹丘町2-4-18</div>
        </div>
      </div>

      {/* アクション */}
      <button
        onClick={onNewBooking}
        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        新しい予約を作成
      </button>
    </div>
  );
}
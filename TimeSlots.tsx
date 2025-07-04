'use client';

import { useState, useEffect } from 'react';
import { MenuItem, TimeSlot } from '@/types/booking';
import { BUSINESS_HOURS, SATURDAY_HOURS } from '@/config/clinic';

interface TimeSlotsProps {
  selectedDate: string;
  selectedMenu: MenuItem;
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (timeSlot: string) => void;
  existingBookings: { time: string; duration: number }[];
}

export default function TimeSlots({
  selectedDate,
  selectedMenu,
  selectedTimeSlot,
  onTimeSlotSelect,
  existingBookings = []
}: TimeSlotsProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    generateTimeSlots();
  }, [selectedDate, selectedMenu, existingBookings]);

  const generateTimeSlots = () => {
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    
    // 営業時間の決定
    const hours = dayOfWeek === 6 ? SATURDAY_HOURS : BUSINESS_HOURS;
    
    const slots: TimeSlot[] = [];
    const startTime = parseTime(hours.start);
    const endTime = parseTime(hours.end);
    const lunchStartTime = hours.lunchStart ? parseTime(hours.lunchStart) : null;
    const lunchEndTime = hours.lunchEnd ? parseTime(hours.lunchEnd) : null;
    
    // 初回無料体験は30分刻み、その他は15分刻み
    const interval = selectedMenu.id === 'first-free' ? 30 : 15;
    
    for (let time = startTime; time < endTime; time += interval) {
      // 初回無料体験は00分・30分のみ
      if (selectedMenu.id === 'first-free') {
        const minutes = time % 60;
        if (minutes !== 0 && minutes !== 30) continue;
      }
      const timeString = formatTime(time);
      const endTimeForSlot = time + selectedMenu.duration;
      
      // 昼休み時間をチェック
      const isInLunchTime = lunchStartTime && lunchEndTime && 
        time < lunchEndTime && endTimeForSlot > lunchStartTime;
      
      // 営業時間内かチェック
      const isInBusinessHours = endTimeForSlot <= endTime;
      
      // 既存予約と重複チェック
      const isConflicting = existingBookings.some(booking => {
        const bookingStart = parseTime(booking.time);
        const bookingEnd = bookingStart + booking.duration;
        return (time < bookingEnd && endTimeForSlot > bookingStart);
      });
      
      slots.push({
        time: timeString,
        duration: selectedMenu.duration,
        available: isInBusinessHours && !isInLunchTime && !isConflicting,
        menuType: selectedMenu.id
      });
    }
    
    setTimeSlots(slots);
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}月${date.getDate()}日（${dayNames[date.getDay()]}）`;
  };

  const getEndTime = (startTime: string, duration: number) => {
    const start = parseTime(startTime);
    const end = start + duration;
    return formatTime(end);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
      <div className="mb-8 text-center">
        <div className="text-2xl mb-3">⏰</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">時間を選択</h3>
        <div className="text-gray-600">
          <div className="text-lg font-medium">{formatDateDisplay(selectedDate)}</div>
          <div className="text-sm mt-2">
            施術内容: <span className="font-medium text-pink-600">{selectedMenu.name}</span>
            （{selectedMenu.duration}分）
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((slot) => {
          const isSelected = selectedTimeSlot === slot.time;
          const endTime = getEndTime(slot.time, slot.duration);
          
          return (
            <button
              key={slot.time}
              onClick={() => slot.available && onTimeSlotSelect(slot.time)}
              disabled={!slot.available}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300 text-center transform hover:scale-105
                ${isSelected
                  ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : slot.available
                    ? 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50 text-gray-800'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="font-bold text-lg">{slot.time}</div>
              <div className="text-xs opacity-75">〜{endTime}</div>
              <div className="text-xs mt-1">
                {slot.duration}分
              </div>
            </button>
          );
        })}
      </div>

      {timeSlots.filter(slot => slot.available).length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">😔</div>
          <div className="text-gray-600 mt-2">
            選択された日時には予約可能な時間がありません
          </div>
          <div className="text-sm text-gray-500 mt-1">
            別の日付をお選びください
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded"></div>
            <span>選択中の時間</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
            <span>予約可能</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border-2 border-gray-100 rounded"></div>
            <span>予約不可（既に予約済み・営業時間外）</span>
          </div>
        </div>
      </div>
    </div>
  );
}
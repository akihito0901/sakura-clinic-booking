'use client';

import { useState } from 'react';

interface CalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateAvailable = (date: Date) => {
    // 日曜日は休み
    if (date.getDay() === 0) return false;
    
    // 過去の日付は選択不可
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const formatDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toISOString().split('T')[0];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // 前月の空のセル
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4"></div>);
    }

    // 当月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = formatDate(day);
      const isAvailable = isDateAvailable(date);
      const isSelected = selectedDate === dateString;
      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => isAvailable && onDateSelect(dateString)}
          disabled={!isAvailable}
          className={`
            p-4 text-center rounded-xl transition-all duration-300 font-medium transform hover:scale-105
            ${isSelected 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
              : isAvailable 
                ? 'bg-white hover:bg-pink-50 hover:shadow-md border border-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
            ${isToday && !isSelected ? 'ring-2 ring-pink-400' : ''}
          `}
        >
          <div className="text-lg">{day}</div>
          {date.getDay() === 6 && (
            <div className="text-xs text-pink-600 mt-1">土曜午前のみ</div>
          )}
        </button>
      );
    }

    return days;
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={goToPreviousMonth}
          className="p-3 rounded-xl hover:bg-pink-50 transition-all duration-200 text-pink-600 hover:text-pink-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="text-lg mb-1">📅</div>
          <h2 className="text-2xl font-bold text-gray-800">
            {currentYear}年 {monthNames[currentMonth]}
          </h2>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-3 rounded-xl hover:bg-pink-50 transition-all duration-200 text-pink-600 hover:text-pink-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center font-medium py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>

      {/* 営業時間案内 */}
      <div className="mt-8 text-sm text-gray-600 bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
        <div className="flex items-start gap-3">
          <div className="text-pink-500 mt-0.5 text-lg">🏥</div>
          <div>
            <div className="font-bold text-gray-800 mb-2 text-base">営業時間のご案内</div>
            <div className="space-y-1">
              <div>平日: 10:00-20:00（昼休み 14:00-15:00）</div>
              <div>土曜: 10:00-13:00</div>
              <div>日曜・祝日: 休診</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
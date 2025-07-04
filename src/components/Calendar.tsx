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
            p-4 text-center rounded-lg transition-all duration-200 font-medium
            ${isSelected 
              ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
              : isAvailable 
                ? 'bg-white hover:bg-blue-50 hover:shadow-md border border-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
            ${isToday && !isSelected ? 'ring-2 ring-blue-400' : ''}
          `}
        >
          <div className="text-lg">{day}</div>
          {date.getDay() === 6 && (
            <div className="text-xs text-blue-600 mt-1">土曜午前のみ</div>
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold text-gray-800">
          {currentYear}年 {monthNames[currentMonth]}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* 注意事項 */}
      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="text-blue-500 mt-0.5">ℹ️</div>
          <div>
            <div className="font-medium text-gray-800 mb-1">営業時間</div>
            <div>平日: 10:00-20:00（昼休み 14:00-15:00）</div>
            <div>土曜: 10:00-13:00</div>
            <div>日曜・祝日: 休診</div>
          </div>
        </div>
      </div>
    </div>
  );
}
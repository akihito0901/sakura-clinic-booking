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
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
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
            aspect-square flex flex-col items-center justify-center rounded-xl md:rounded-2xl transition-all duration-200 font-medium text-sm md:text-base relative overflow-hidden
            ${isSelected 
              ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg scale-95 ring-4 ring-pink-200' 
              : isAvailable 
                ? 'bg-white hover:bg-pink-50 active:bg-pink-100 border border-gray-200 text-gray-800 hover:shadow-md active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
            ${isToday && !isSelected ? 'ring-2 ring-pink-400 ring-offset-1' : ''}
          `}
        >
          <span className={`${isSelected ? 'font-bold' : ''}`}>{day}</span>
          {date.getDay() === 6 && (
            <span className={`text-xs mt-0.5 ${isSelected ? 'text-pink-100' : 'text-pink-600'}`}>
              午前のみ
            </span>
          )}
          {isToday && !isSelected && (
            <div className="absolute inset-0 border-2 border-pink-400 rounded-xl md:rounded-2xl pointer-events-none"></div>
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border border-pink-100">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl hover:bg-pink-50 active:bg-pink-100 transition-all duration-200 text-pink-600 hover:text-pink-700 active:scale-95"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="text-2xl md:text-3xl mb-1">📅</div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-800">
            {currentYear}年 {monthNames[currentMonth]}
          </h2>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl hover:bg-pink-50 active:bg-pink-100 transition-all duration-200 text-pink-600 hover:text-pink-700 active:scale-95"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center font-bold py-2 text-sm md:text-base ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-6 md:mb-8">
        {renderCalendarDays()}
      </div>

      {/* 営業時間案内 */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200/50 rounded-xl md:rounded-2xl p-4 md:p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800 mb-3 text-sm md:text-base">営業時間のご案内</div>
            <div className="space-y-2 text-xs md:text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span>平日</span>
                <span className="font-medium">10:00-20:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>土曜</span>
                <span className="font-medium">10:00-13:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>日曜・祝日</span>
                <span className="text-red-500 font-medium">休診</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-pink-200">
                ※ 平日は14:00-15:00昼休み
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
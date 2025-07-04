'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import MenuSelection from '@/components/MenuSelection';
import TimeSlots from '@/components/TimeSlots';
import BookingForm from '@/components/BookingForm';
import BookingConfirmation from '@/components/BookingConfirmation';
import { MenuItem } from '@/types/booking';

type Step = 'menu' | 'date' | 'time' | 'form' | 'confirmation';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('menu');
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [existingBookings, setExistingBookings] = useState<{ time: string; duration: number }[]>([]);
  const [completedBooking, setCompletedBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 既存予約を取得
  const fetchExistingBookings = async (date: string) => {
    try {
      const response = await fetch(`/api/bookings?date=${date}`);
      const data = await response.json();
      setExistingBookings(
        data.bookings.map((booking: any) => ({
          time: booking.timeSlot,
          duration: booking.duration
        }))
      );
    } catch (error) {
      console.error('既存予約の取得エラー:', error);
      setExistingBookings([]);
    }
  };

  // 日付選択時の処理
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    fetchExistingBookings(date);
    setCurrentStep('time');
  };

  // メニュー選択時の処理
  const handleMenuSelect = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setCurrentStep('date');
  };

  // 時間選択時の処理
  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentStep('form');
  };

  // 予約確定処理
  const handleBookingSubmit = async (formData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
  }) => {
    if (!selectedMenu || !selectedDate || !selectedTimeSlot) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          duration: selectedMenu.duration,
          menuId: selectedMenu.id,
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '予約の作成に失敗しました');
      }

      setCompletedBooking({
        ...data.booking,
        selectedMenu,
        customerData: formData
      });
      setCurrentStep('confirmation');

    } catch (error) {
      console.error('予約作成エラー:', error);
      alert(error instanceof Error ? error.message : '予約の作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 新しい予約作成
  const handleNewBooking = () => {
    setCurrentStep('menu');
    setSelectedMenu(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setCompletedBooking(null);
    setExistingBookings([]);
  };

  // 戻るボタンの処理
  const handleBack = () => {
    switch (currentStep) {
      case 'date':
        setCurrentStep('menu');
        break;
      case 'time':
        setCurrentStep('date');
        break;
      case 'form':
        setCurrentStep('time');
        break;
    }
  };

  const getStepNumber = () => {
    const steps = { menu: 1, date: 2, time: 3, form: 4, confirmation: 5 };
    return steps[currentStep];
  };

  const getTotalSteps = () => {
    return currentStep === 'confirmation' ? 5 : 4;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-3xl mb-2">🌸</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
              桜並木駅前の整骨院
            </h1>
            <p className="text-gray-600 text-lg">オンライン予約システム</p>
          </div>
          
          {/* プログレスバー */}
          {currentStep !== 'confirmation' && (
            <div className="max-w-md mx-auto mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-pink-600">
                  ステップ {getStepNumber()} / {getTotalSteps()}
                </span>
                <span className="text-sm text-gray-500">
                  {currentStep === 'menu' && '✨ メニュー選択'}
                  {currentStep === 'date' && '📅 日付選択'}
                  {currentStep === 'time' && '⏰ 時間選択'}
                  {currentStep === 'form' && '📝 情報入力'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(getStepNumber() / getTotalSteps()) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === 'menu' && (
          <MenuSelection
            selectedMenu={selectedMenu}
            onMenuSelect={handleMenuSelect}
          />
        )}

        {currentStep === 'date' && selectedMenu && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-2xl mb-3">📅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">ご希望の日付を選択してください</h2>
              <div className="text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-pink-100">
                選択した施術: <span className="font-medium text-pink-600">{selectedMenu.name}</span>
                ({selectedMenu.duration}分)
              </div>
            </div>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
            <div className="text-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 rounded-lg hover:bg-white/50"
              >
                ← メニュー選択に戻る
              </button>
            </div>
          </div>
        )}

        {currentStep === 'time' && selectedDate && selectedMenu && (
          <div className="space-y-8">
            <TimeSlots
              selectedDate={selectedDate}
              selectedMenu={selectedMenu}
              selectedTimeSlot={selectedTimeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
              existingBookings={existingBookings}
            />
            <div className="text-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 rounded-lg hover:bg-white/50"
              >
                ← 日付選択に戻る
              </button>
            </div>
          </div>
        )}

        {currentStep === 'form' && selectedDate && selectedTimeSlot && selectedMenu && (
          <BookingForm
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            selectedMenu={selectedMenu}
            onSubmit={handleBookingSubmit}
            onBack={handleBack}
          />
        )}

        {currentStep === 'confirmation' && completedBooking && (
          <BookingConfirmation
            bookingId={completedBooking.id}
            selectedDate={completedBooking.date}
            selectedTimeSlot={completedBooking.timeSlot}
            selectedMenu={completedBooking.selectedMenu}
            customerData={completedBooking.customerData}
            onNewBooking={handleNewBooking}
          />
        )}

        {/* ローディング表示 */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>予約を作成中...</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
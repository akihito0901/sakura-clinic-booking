'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import CustomerTypeSelection from '@/components/CustomerTypeSelection';
import FirstTimeMenuSelection from '@/components/FirstTimeMenuSelection';
import ReturningMenuSelection from '@/components/ReturningMenuSelection';
import TimeSlots from '@/components/TimeSlots';
import BookingForm from '@/components/BookingForm';
import BookingConfirmation from '@/components/BookingConfirmation';
import BookingSearch from '@/components/BookingSearch';
import { MenuItem } from '@/types/booking';

type Step = 'customerType' | 'firstTimeMenu' | 'returningMenu' | 'date' | 'time' | 'form' | 'confirmation';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('customerType');
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [existingBookings, setExistingBookings] = useState<{ time: string; duration: number }[]>([]);
  const [completedBooking, setCompletedBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingSearch, setShowBookingSearch] = useState(false);

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

  // 顧客タイプ選択時の処理
  const handleCustomerTypeSelect = (firstTime: boolean) => {
    setIsFirstTime(firstTime);
    if (firstTime) {
      setCurrentStep('firstTimeMenu');
    } else {
      setCurrentStep('returningMenu');
    }
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
          isFirstTime: isFirstTime,
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
    setCurrentStep('customerType');
    setIsFirstTime(null);
    setSelectedMenu(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setCompletedBooking(null);
    setExistingBookings([]);
  };

  // 戻るボタンの処理
  const handleBack = () => {
    switch (currentStep) {
      case 'firstTimeMenu':
      case 'returningMenu':
        setCurrentStep('customerType');
        break;
      case 'date':
        setCurrentStep(isFirstTime ? 'firstTimeMenu' : 'returningMenu');
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
    const steps = { 
      customerType: 1, 
      firstTimeMenu: 2, 
      returningMenu: 2, 
      date: 3, 
      time: 4, 
      form: 5, 
      confirmation: 6 
    };
    return steps[currentStep];
  };

  const getTotalSteps = () => {
    return currentStep === 'confirmation' ? 6 : 5;
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
            
            {/* 予約検索ボタン */}
            <button
              onClick={() => setShowBookingSearch(true)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              📞 予約を検索
            </button>
          </div>
          
          {/* プログレスバー */}
          {currentStep !== 'confirmation' && (
            <div className="max-w-md mx-auto mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-pink-600">
                  ステップ {getStepNumber()} / {getTotalSteps()}
                </span>
                <span className="text-sm text-gray-500">
                  {currentStep === 'customerType' && '👥 ご来院回数'}
                  {currentStep === 'firstTimeMenu' && '✨ 初回体験'}
                  {currentStep === 'returningMenu' && '🎯 メニュー選択'}
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
      <main className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {currentStep === 'customerType' && (
          <CustomerTypeSelection
            onTypeSelect={handleCustomerTypeSelect}
          />
        )}

        {currentStep === 'firstTimeMenu' && (
          <FirstTimeMenuSelection
            onMenuSelect={handleMenuSelect}
            onBack={handleBack}
          />
        )}

        {currentStep === 'returningMenu' && (
          <ReturningMenuSelection
            selectedMenu={selectedMenu}
            onMenuSelect={handleMenuSelect}
            onBack={handleBack}
          />
        )}

        {currentStep === 'date' && selectedMenu && (
          <div className="space-y-6">
            {/* 戻るボタン */}
            <div>
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                メニュー選択に戻る
              </button>
            </div>
            
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
          </div>
        )}

        {currentStep === 'time' && selectedDate && selectedMenu && (
          <div className="space-y-6">
            {/* 戻るボタン */}
            <div>
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                日付選択に戻る
              </button>
            </div>
            
            <TimeSlots
              selectedDate={selectedDate}
              selectedMenu={selectedMenu}
              selectedTimeSlot={selectedTimeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
              existingBookings={existingBookings}
            />
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

      {/* 予約検索モーダル */}
      {showBookingSearch && (
        <BookingSearch
          onClose={() => setShowBookingSearch(false)}
        />
      )}
    </div>
  );
}
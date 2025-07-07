'use client';

import { useState } from 'react';
import { MenuItem } from '@/types/booking';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

interface BookingFormProps {
  selectedDate: string;
  selectedTimeSlot: string;
  selectedMenu: MenuItem;
  onSubmit: (formData: {
    customerName: string;
    customerPhone: string;
    notes: string;
  }) => void;
  onBack: () => void;
}

export default function BookingForm({
  selectedDate,
  selectedTimeSlot,
  selectedMenu,
  onSubmit,
  onBack
}: BookingFormProps) {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'お名前を入力してください';
    }
    
    // 初回の方のみ電話番号必須
    if (user?.isFirstTime && !formData.customerPhone.trim()) {
      newErrors.customerPhone = '初回の方は電話番号を入力してください';
    } else if (formData.customerPhone && !/^[0-9\-]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = '正しい電話番号を入力してください';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  // ログインしていない場合のUI
  if (!user) {
    return (
      <>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-pink-100 text-center">
          <div className="mb-6">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">ログインが必要です</h3>
            <p className="text-gray-600 text-sm md:text-base mb-6">
              予約を続行するには、ログインまたは新規登録をしてください。<br />
              一度登録すると、次回から入力の手間が省けます！
            </p>
          </div>

          {/* 予約内容確認 */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 md:p-5 mb-6">
            <h4 className="font-bold text-pink-800 mb-3 text-center">📋 予約内容</h4>
            <div className="text-pink-700 text-sm space-y-2">
              <div>日時: {formatDateDisplay(selectedDate)} {selectedTimeSlot} 〜 {getEndTime(selectedTimeSlot, selectedMenu.duration)}</div>
              <div>施術: {selectedMenu.name} ({selectedMenu.duration}分)</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              戻る
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-medium"
            >
              ログイン・登録
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(loggedInUser) => {
            setShowAuthModal(false);
            // ユーザー情報で自動入力
            setFormData(prev => ({
              ...prev,
              customerName: loggedInUser?.name || '',
              customerPhone: loggedInUser?.phone || ''
            }));
          }}
        />
      </>
    );
  }

  // ログイン済みの場合のUI
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-pink-100">
      <div className="mb-6 md:mb-8">
        <div className="text-center mb-6">
          <div className="text-3xl md:text-4xl mb-4">📝</div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">予約内容の確認</h3>
        </div>
        
        {/* ユーザー情報表示 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 md:p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-green-800 mb-1">👤 ログイン中</h4>
              <p className="text-green-700 text-sm">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-green-600 hover:text-green-700 text-sm underline"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* 予約内容確認 */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 md:p-5 mb-6">
          <h4 className="font-bold text-pink-800 mb-3 text-center">📋 予約内容</h4>
          <div className="text-pink-700 text-sm space-y-2">
            <div>日時: {formatDateDisplay(selectedDate)} {selectedTimeSlot} 〜 {getEndTime(selectedTimeSlot, selectedMenu.duration)}</div>
            <div>施術: {selectedMenu.name} ({selectedMenu.duration}分)</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* お名前 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200
              ${errors.customerName ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="田中 太郎"
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
          )}
        </div>

        {/* 電話番号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            電話番号 {user.isFirstTime && <span className="text-red-500">*</span>}
            {!user.isFirstTime && <span className="text-gray-500 text-xs ml-1">(任意)</span>}
          </label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200
              ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="090-1234-5678"
          />
          {user.isFirstTime && (
            <p className="text-xs text-gray-500 mt-1">初回の方は連絡先として必要です</p>
          )}
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
          )}
        </div>

        {/* 備考 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            症状やご要望（任意）
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            placeholder="痛みの箇所や症状、ご要望などがあればお書きください"
          />
        </div>

        {/* ボタン */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            戻る
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-medium active:scale-95"
          >
            予約を確定する
          </button>
        </div>
      </form>
    </div>
  );
}
'use client';

import { FIRST_TIME_MENU } from '@/config/clinic';
import { MenuItem } from '@/types/booking';

interface FirstTimeMenuSelectionProps {
  onMenuSelect: (menu: MenuItem) => void;
  onBack: () => void;
}

export default function FirstTimeMenuSelection({
  onMenuSelect,
  onBack
}: FirstTimeMenuSelectionProps) {
  const handleMenuSelect = () => {
    onMenuSelect(FIRST_TIME_MENU);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-pink-100">
      {/* 戻るボタン */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ご来院選択に戻る
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl md:text-5xl mb-4">🆓</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          初回無料体験
        </h2>
        <p className="text-gray-600 text-lg">
          初めての方限定！45分間の体験施術が無料です
        </p>
      </div>

      {/* メニューカード */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-pink-800 mb-2">
              {FIRST_TIME_MENU.name}
            </h3>
            <p className="text-pink-600 text-lg font-medium">
              {FIRST_TIME_MENU.duration}分 • 無料
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 text-center mb-4">
              {FIRST_TIME_MENU.description}
            </p>
          </div>

          {/* 対応症状の詳細 */}
          <div className="bg-white/80 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">
              こんな症状でお悩みの方におすすめ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-pink-500">👶</span>
                <span>産後の身体の不調</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-500">🤱</span>
                <span>産後の骨盤の歪み</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-500">💪</span>
                <span>肩こり・首こり</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-500">🦴</span>
                <span>腰痛・背中の痛み</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-500">😴</span>
                <span>身体の疲れ・だるさ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-500">🎯</span>
                <span>その他の身体の不調</span>
              </div>
            </div>
          </div>

          {/* 選択ボタン */}
          <div className="text-center">
            <button
              onClick={handleMenuSelect}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-medium active:scale-95 text-lg shadow-lg"
            >
              ✨ 無料体験を予約する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { RETURNING_MENU_ITEMS } from '@/config/clinic';
import { MenuItem } from '@/types/booking';

interface ReturningMenuSelectionProps {
  selectedMenu: MenuItem | null;
  onMenuSelect: (menu: MenuItem) => void;
  onBack: () => void;
}

export default function ReturningMenuSelection({
  selectedMenu,
  onMenuSelect,
  onBack
}: ReturningMenuSelectionProps) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const getMenuIcon = (menuId: string) => {
    switch (menuId) {
      case 'general-treatment':
        return '💪';
      case 'postnatal-treatment':
        return '🤱';
      case 'eye-strain-treatment':
        return '👁️';
      default:
        return '🎯';
    }
  };

  const getDurationLabel = (duration: number) => {
    if (duration < 60) {
      return `${duration}分`;
    }
    return `${Math.floor(duration / 60)}時間`;
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
        <div className="text-4xl md:text-5xl mb-4">🎯</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          施術メニュー選択
        </h2>
        <p className="text-gray-600 text-lg">
          症状に合わせた施術をお選びください
        </p>
      </div>

      {/* メニューカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RETURNING_MENU_ITEMS.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onMenuSelect(menu)}
            onMouseEnter={() => setHoveredMenu(menu.id)}
            onMouseLeave={() => setHoveredMenu(null)}
            className={`
              p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${selectedMenu?.id === menu.id
                ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                : hoveredMenu === menu.id
                ? 'border-blue-300 bg-blue-50/50 shadow-md transform scale-102'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
              }
            `}
          >
            <div className="text-center mb-4">
              <div className="text-3xl md:text-4xl mb-2">
                {getMenuIcon(menu.id)}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                {menu.name}
              </h3>
              <p className="text-blue-600 font-medium">
                {getDurationLabel(menu.duration)}
              </p>
            </div>

            <div className="text-gray-600 text-sm mb-4">
              <p>{menu.description}</p>
            </div>

            {/* 詳細情報 */}
            <div className="bg-white/80 rounded-lg p-3">
              {menu.id === 'general-treatment' && (
                <div className="text-xs space-y-1">
                  <p className="font-medium">対象症状：</p>
                  <p>肩こり・腰痛・首こり・筋肉疲労</p>
                </div>
              )}
              
              {menu.id === 'postnatal-treatment' && (
                <div className="text-xs space-y-1">
                  <p className="font-medium">対象症状：</p>
                  <p>産後の骨盤の歪み・身体の不調・姿勢改善</p>
                </div>
              )}
              
              {menu.id === 'eye-strain-treatment' && (
                <div className="text-xs space-y-1">
                  <p className="font-medium">対象症状：</p>
                  <p>眼精疲労・頭痛・首こり・PC作業疲れ</p>
                </div>
              )}
            </div>

            {selectedMenu?.id === menu.id && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 text-blue-600 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  選択済み
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 次へボタン */}
      {selectedMenu && (
        <div className="text-center mt-8">
          <button
            onClick={() => onMenuSelect(selectedMenu)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium active:scale-95 text-lg shadow-lg"
          >
            📅 日付を選択する
          </button>
        </div>
      )}
    </div>
  );
}
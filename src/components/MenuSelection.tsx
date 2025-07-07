'use client';

import { MenuItem } from '@/types/booking';
import { MENU_ITEMS } from '@/config/clinic';

interface MenuSelectionProps {
  selectedMenu: MenuItem | null;
  onMenuSelect: (menu: MenuItem) => void;
  onNext?: () => void;
}

export default function MenuSelection({ selectedMenu, onMenuSelect, onNext }: MenuSelectionProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* ヘッダー */}
      <div className="text-center mb-6 md:mb-8">
        <div className="text-4xl md:text-5xl mb-4">🌸</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">施術メニューを選択</h2>
        <p className="text-gray-600 text-base md:text-lg">最適な施術をお選びください</p>
      </div>

      {/* メニューカード一覧 */}
      <div className="space-y-4 md:space-y-6">
        {MENU_ITEMS.map((menu) => {
          const getImageSrc = (menuId: string) => {
            switch (menuId) {
              case 'first-free':
                return '/images/予約.jpeg';
              case 'general-regular':
              case 'general-with-eye-care':
                return '/images/深層筋.jpg';
              case 'postnatal-regular':
                return '/images/骨盤調整.jpeg';
              default:
                return '/images/予約.jpeg';
            }
          };

          return (
            <div
              key={menu.id}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-white group hover:shadow-3xl transition-all duration-300"
            >
              {/* 写真背景 */}
              <div className="relative h-48 md:h-64 lg:h-72 overflow-hidden">
                <img
                  src={getImageSrc(menu.id)}
                  alt={menu.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* グラデーションオーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* 施術時間バッジ */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-800">{menu.duration}分</span>
                </div>
                
                {/* 特別ラベル */}
                {menu.id === 'first-free' && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold">🎉 初回限定</span>
                  </div>
                )}
                
                {menu.id === 'general-with-eye-care' && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold">👁️ 眼精疲労ケア込み</span>
                  </div>
                )}
              </div>

              {/* コンテンツエリア */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{menu.name}</h3>
                
                {/* 予約ボタン */}
                <button
                  onClick={() => {
                    onMenuSelect(menu);
                    setTimeout(() => onNext && onNext(), 100);
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 md:py-4 px-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl active:scale-95 transition-all duration-200 transform hover:-translate-y-1"
                >
                  📋 この施術を予約する
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* HPリンク */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl md:rounded-3xl p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.102m-.758 4.899L16.5 7.5"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-blue-800 mb-2 text-base md:text-lg">料金・詳細はこちら</div>
            <a 
              href="https://sakuranamiki1.com/price/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm md:text-base font-medium underline hover:no-underline transition-all"
            >
              公式ホームページで確認
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
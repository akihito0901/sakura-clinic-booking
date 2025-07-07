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
    <div className="bg-gradient-to-br from-white via-pink-50/30 to-rose-50/20 rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-10 border border-pink-200/50">
      <div className="mb-6 md:mb-10 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 md:mb-4">施術メニューを選択</h3>
        <p className="text-gray-600 text-lg md:text-xl">最適な施術をお選びください</p>
      </div>

      <div className="grid gap-4">
        {MENU_ITEMS.map((menu) => {
          const isSelected = selectedMenu?.id === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => onMenuSelect(menu)}
              className={`
                group relative p-4 md:p-8 rounded-xl md:rounded-2xl border text-left transition-all duration-200 w-full
                ${isSelected
                  ? 'border-pink-400 bg-gradient-to-br from-pink-100 via-white to-rose-100 shadow-xl ring-4 ring-pink-200/50'
                  : 'border-gray-200 bg-white shadow-lg hover:shadow-xl hover:border-pink-200'
                }
              `}
            >
              <div className="flex items-start gap-3 md:gap-6 mb-4 md:mb-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg md:rounded-xl overflow-hidden shadow-inner">
                  {menu.id === 'first-free' && (
                    <img 
                      src="/images/予約.jpeg" 
                      alt="予約" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {(menu.id === 'general-regular' || menu.id === 'general-with-eye-care') && (
                    <img 
                      src="/images/深層筋.jpg" 
                      alt="深層筋" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {menu.id === 'postnatal-regular' && (
                    <img 
                      src="/images/骨盤調整.jpeg" 
                      alt="骨盤調整" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
                      <h4 className="text-lg md:text-xl font-bold text-gray-800">{menu.name}</h4>
                      <div className="text-left sm:text-right">
                        <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                          {menu.price === 0 ? '無料' : menu.price === null ? '要相談' : `¥${menu.price.toLocaleString()}`}
                        </div>
                        <div className="text-sm text-gray-500">{menu.duration}分</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                {menu.description}
              </p>
              
              <div className="flex gap-2 flex-wrap">
                {menu.id === 'first-free' && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    <span>🎉</span>
                    初回限定特典
                  </div>
                )}
                
                {menu.id === 'general-with-eye-care' && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    <span>👁️</span>
                    眼精疲労ケア込み
                  </div>
                )}
                
                {menu.price === null && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    <span>💬</span>
                    要相談
                  </div>
                )}
              </div>
              
              {/* タップ用のCTAボタン */}
              {isSelected && (
                <div className="mt-4 p-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg border border-pink-200">
                  <div className="text-center">
                    <div className="text-pink-700 font-medium text-sm mb-2">
                      ✓ 選択済み
                    </div>
                    <div className="text-xs text-pink-600">
                      下の「日程選択へ」ボタンをタップしてください
                    </div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 日程選択ボタン */}
      {selectedMenu && (
        <div className="mt-6 md:mt-8">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 md:py-5 px-6 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl shadow-xl active:scale-95 transition-transform duration-150"
          >
            📅 日程選択へ進む
          </button>
        </div>
      )}

      {/* ホームページリンク */}
      <div className="mt-6 md:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl md:rounded-2xl p-4 md:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.102m-.758 4.899L16.5 7.5"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-blue-800 mb-2 text-base md:text-lg">各メニューの詳細はこちら</div>
            <a 
              href="https://sakuranamiki1.com/price/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm md:text-base font-medium underline"
            >
              料金表・詳細を確認
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
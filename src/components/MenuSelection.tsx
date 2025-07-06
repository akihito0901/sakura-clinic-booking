'use client';

import { MenuItem } from '@/types/booking';
import { MENU_ITEMS } from '@/config/clinic';

interface MenuSelectionProps {
  selectedMenu: MenuItem | null;
  onMenuSelect: (menu: MenuItem) => void;
}

export default function MenuSelection({ selectedMenu, onMenuSelect }: MenuSelectionProps) {
  return (
    <div className="bg-gradient-to-br from-white via-pink-50/30 to-rose-50/20 rounded-3xl shadow-2xl p-10 border border-pink-200/50">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">施術メニューを選択</h3>
        <p className="text-gray-600 text-xl">最適な施術をお選びください</p>
      </div>

      <div className="grid gap-4">
        {MENU_ITEMS.map((menu) => {
          const isSelected = selectedMenu?.id === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => onMenuSelect(menu)}
              className={`
                group relative p-8 rounded-2xl border text-left transition-all duration-200 
                ${isSelected
                  ? 'border-pink-400 bg-gradient-to-br from-pink-100 via-white to-rose-100 shadow-xl ring-4 ring-pink-200/50'
                  : 'border-gray-200 bg-white shadow-lg hover:shadow-xl hover:border-pink-200'
                }
              `}
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner">
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
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-gray-800">{menu.name}</h4>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        {menu.price === 0 ? '無料' : menu.price === null ? '要相談' : `¥${menu.price.toLocaleString()}`}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{menu.duration}分</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-base leading-relaxed mb-4">
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
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/50 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-yellow-800 mb-2 text-lg">おすすめ情報</div>
            <div className="text-yellow-700 text-base leading-relaxed">
              初回の方は「初回無料体験」がおすすめです。どの施術も体験でき、安心してお試しいただけます。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
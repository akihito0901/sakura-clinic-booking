'use client';

import { MenuItem } from '@/types/booking';
import { MENU_ITEMS, EYE_CARE_OPTION } from '@/config/clinic';

interface MenuSelectionProps {
  selectedMenu: MenuItem | null;
  onMenuSelect: (menu: MenuItem) => void;
}

export default function MenuSelection({ selectedMenu, onMenuSelect }: MenuSelectionProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
      <div className="mb-8 text-center">
        <div className="text-2xl mb-3">✨</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">施術メニューを選択</h3>
        <p className="text-gray-600 text-lg">ご希望の施術内容をお選びください</p>
      </div>

      <div className="grid gap-4">
        {MENU_ITEMS.map((menu) => {
          const isSelected = selectedMenu?.id === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => onMenuSelect(menu)}
              className={`
                p-6 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-105 relative overflow-hidden
                ${isSelected
                  ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-rose-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-25 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {menu.id === 'first-free' && (
                    <img 
                      src="/images/予約.jpeg" 
                      alt="予約" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {menu.id === 'general-regular' && (
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
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{menu.name}</h4>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-600">
                      {menu.price === 0 ? '無料' : menu.price === null ? '要相談' : `¥${menu.price.toLocaleString()}`}
                    </div>
                    <div className="text-sm text-gray-500">{menu.duration}分</div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {menu.description}
              </p>
              
              {menu.id === 'first-free' && (
                <div className="mt-3 inline-flex items-center gap-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                  <span>🎉</span>
                  初回限定
                </div>
              )}
              
              {menu.price === 0 && menu.id !== 'first-free' && (
                <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  <span>💰</span>
                  サブスク対象
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 眼精疲労オプション */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg overflow-hidden border border-purple-100">
            <img 
              src="/images/眼精疲労.jpg" 
              alt="眼精疲労" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-purple-800">
            <div className="font-bold mb-2 text-base">オプション: {EYE_CARE_OPTION.name}</div>
            <div className="mb-3 text-sm">{EYE_CARE_OPTION.description}</div>
            <div className="text-sm bg-white/50 rounded-lg p-2">
              <div className="font-medium">料金:</div>
              <div>初回: ¥{EYE_CARE_OPTION.priceFirst.toLocaleString()} / 2回目以降: ¥{EYE_CARE_OPTION.priceRegular.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <div className="text-yellow-600 mt-0.5">💡</div>
          <div className="text-sm text-yellow-800">
            <div className="font-medium mb-1">お得な情報</div>
            <div>初回の方は「初回無料体験」がおすすめです。一般施術・産後骨盤矯正どちらも体験できます。</div>
          </div>
        </div>
      </div>
    </div>
  );
}
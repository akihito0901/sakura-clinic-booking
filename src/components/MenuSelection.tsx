'use client';

import { MenuItem } from '@/types/booking';
import { MENU_ITEMS } from '@/config/clinic';

interface MenuSelectionProps {
  selectedMenu: MenuItem | null;
  onMenuSelect: (menu: MenuItem) => void;
}

export default function MenuSelection({ selectedMenu, onMenuSelect }: MenuSelectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">施術メニューを選択</h3>
        <p className="text-gray-600">ご希望の施術内容をお選びください</p>
      </div>

      <div className="grid gap-4">
        {MENU_ITEMS.map((menu) => {
          const isSelected = selectedMenu?.id === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => onMenuSelect(menu)}
              className={`
                p-6 rounded-lg border-2 text-left transition-all duration-200
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                }
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-gray-800">{menu.name}</h4>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {menu.price === 0 ? '無料' : `¥${menu.price.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-gray-500">{menu.duration}分</div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {menu.description}
              </p>
              
              {menu.id === 'first-free' && (
                <div className="mt-3 inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
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

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
'use client';

import { useState } from 'react';

interface CustomerTypeSelectionProps {
  onTypeSelect: (isFirstTime: boolean) => void;
}

export default function CustomerTypeSelection({ onTypeSelect }: CustomerTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<boolean | null>(null);

  const handleTypeSelect = (isFirstTime: boolean) => {
    setSelectedType(isFirstTime);
    onTypeSelect(isFirstTime);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-pink-100">
      <div className="text-center mb-8">
        <div className="text-4xl md:text-5xl mb-4">🌸</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          ご来院について
        </h2>
        <p className="text-gray-600 text-lg">
          当院のご利用は初めてですか？
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 初回の方 */}
        <button
          onClick={() => handleTypeSelect(true)}
          className={`
            p-6 md:p-8 rounded-xl border-2 transition-all duration-300 text-left
            ${selectedType === true 
              ? 'border-pink-500 bg-pink-50 shadow-lg' 
              : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
            }
          `}
        >
          <div className="text-center mb-4">
            <div className="text-3xl md:text-4xl mb-2">✨</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              初めての方
            </h3>
          </div>
          
          <div className="text-gray-600 space-y-3">
            <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg p-4">
              <p className="font-semibold text-pink-800 mb-2">🆓 初回無料体験</p>
              <p className="text-sm">45分間の体験施術が無料！</p>
            </div>
            
            <div className="text-sm space-y-1">
              <p className="font-medium text-gray-700">対応症状：</p>
              <ul className="text-gray-600 space-y-1">
                <li>• 産後の身体の不調</li>
                <li>• 肩こり・首こり</li>
                <li>• 腰痛・背中の痛み</li>
                <li>• その他の身体の不調</li>
              </ul>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-pink-600 font-medium">
                まずはここから始めましょう！
              </p>
            </div>
          </div>
        </button>

        {/* 2回目以降の方 */}
        <button
          onClick={() => handleTypeSelect(false)}
          className={`
            p-6 md:p-8 rounded-xl border-2 transition-all duration-300 text-left
            ${selectedType === false 
              ? 'border-blue-500 bg-blue-50 shadow-lg' 
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
            }
          `}
        >
          <div className="text-center mb-4">
            <div className="text-3xl md:text-4xl mb-2">🔄</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              2回目以降の方
            </h3>
          </div>
          
          <div className="text-gray-600 space-y-3">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
              <p className="font-semibold text-blue-800 mb-2">🎯 専門施術</p>
              <p className="text-sm">症状に合わせた施術をお選びください</p>
            </div>
            
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>一般施術</span>
                <span className="text-gray-500">15分</span>
              </div>
              <div className="flex justify-between">
                <span>産後骨盤矯正</span>
                <span className="text-gray-500">60分</span>
              </div>
              <div className="flex justify-between">
                <span>眼精疲労パック</span>
                <span className="text-gray-500">30分</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">
                継続的なケアで健康維持
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
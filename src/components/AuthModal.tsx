'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/booking';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // モードが変わったときフォームデータをリセット
  useEffect(() => {
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: ''
    });
    setErrors({});
  }, [mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // クライアントサイドバリデーション
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'パスワードを入力してください';
    } else if (!/^[a-zA-Z0-9]{4,8}$/.test(formData.password)) {
      newErrors.password = 'パスワードは半角英数字4-8文字で入力してください';
    }
    
    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' 
        ? { 
            email: formData.email.trim(), 
            password: formData.password.trim() 
          }
        : {
            email: formData.email.trim(),
            password: formData.password.trim(),
            name: formData.name.trim(),
            phone: formData.phone.trim() || undefined
          };

      console.log('Sending request to:', endpoint, payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (!response.ok) {
        setErrors({ general: data.error || 'エラーが発生しました' });
        return;
      }

      login(data.user);
      onSuccess(data.user);
      onClose();
      
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'ネットワークエラーが発生しました。再度お試しください。' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-center relative">
          <div className="text-3xl text-white mb-2">🌸</div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'ログイン' : '新規登録'}
          </h2>
          <p className="text-pink-100 text-sm mt-1">
            {mode === 'login' ? 'アカウントにログイン' : 'アカウントを作成'}
          </p>
          
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-pink-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* フォーム */}
        <div className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="田中 太郎"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="半角英数字4-8文字"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">半角英数字4-8文字で入力してください</p>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号（初回の方のみ）
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="090-1234-5678"
                />
                <p className="text-xs text-gray-500 mt-1">初回予約時のみ必要です</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '処理中...' : mode === 'login' ? 'ログイン' : '登録'}
            </button>
          </form>

          {/* モード切替 */}
          <div className="mt-6 text-center border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? 'アカウントをお持ちでない方は' : '既にアカウントをお持ちの方は'}
            </p>
            <button
              onClick={switchMode}
              className="text-pink-600 hover:text-pink-700 font-medium text-sm mt-1"
            >
              {mode === 'login' ? '新規登録' : 'ログイン'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { MenuItem, BusinessHours, EyeCareOption } from '@/types/booking';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'first-free',
    name: '初回無料体験',
    duration: 45,
    price: 0,
    description: '初めての方はとりあえずこれ！お体の状態をチェックして最適な施術をご提案します'
  },
  {
    id: 'general-regular',
    name: '一般施術',
    duration: 15,
    price: 800,
    description: '肩こり・腰痛などの一般的な症状に対応（初診料2000円、2回目以降800円）'
  },
  {
    id: 'general-with-eye-care',
    name: '一般施術＋眼精疲労ケア',
    duration: 30,
    price: 1800,
    description: '一般施術に眼精疲労ケアをプラス（初診料2000円、2回目以降1800円）'
  },
  {
    id: 'postnatal-regular',
    name: '産後骨盤矯正',
    duration: 60,
    price: null, // 料金表示なし
    description: '産後の骨盤の歪みをしっかりと整えます'
  }
];

// 眼精疲労は一般施術とセットメニューに統合

export const BUSINESS_HOURS: BusinessHours = {
  start: '10:00',
  end: '20:00',
  lunchStart: '14:00',
  lunchEnd: '15:00',
  closedDays: [0] // 日曜日
};

export const SATURDAY_HOURS: BusinessHours = {
  start: '10:00',
  end: '13:00',
  closedDays: [0]
};
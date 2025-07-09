import { MenuItem, BusinessHours } from '@/types/booking';

// 初回向けメニュー
export const FIRST_TIME_MENU: MenuItem = {
  id: 'first-free-trial',
  name: '初回無料体験',
  duration: 45,
  description: '産後の不調・肩こり・腰痛など、全てに対応。まずはここから始めましょう！'
};

// 2回目以降向けメニュー
export const RETURNING_MENU_ITEMS: MenuItem[] = [
  {
    id: 'general-treatment',
    name: '一般施術',
    duration: 15,
    description: '肩こり・腰痛などの一般的な施術'
  },
  {
    id: 'postnatal-treatment',
    name: '産後骨盤矯正',
    duration: 60,
    description: '産後の骨盤矯正・身体の不調改善'
  },
  {
    id: 'eye-strain-treatment',
    name: '眼精疲労パック',
    duration: 30,
    description: '眼精疲労・頭痛・首こりの改善'
  }
];

// 全メニュー（システム内部用）
export const ALL_MENU_ITEMS: MenuItem[] = [
  FIRST_TIME_MENU,
  ...RETURNING_MENU_ITEMS
];

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
import { MenuItem, BusinessHours, EyeCareOption } from '@/types/booking';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'first-free',
    name: '初回無料体験',
    duration: 45
  },
  {
    id: 'general-regular',
    name: '一般施術',
    duration: 15
  },
  {
    id: 'general-with-eye-care',
    name: '一般施術＋眼精疲労ケア',
    duration: 30
  },
  {
    id: 'postnatal-regular',
    name: '産後骨盤矯正',
    duration: 60
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
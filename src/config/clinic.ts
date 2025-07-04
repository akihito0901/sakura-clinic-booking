import { MenuItem, BusinessHours, EyeCareOption } from '@/types/booking';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'first-free',
    name: '初回無料体験',
    duration: 60,
    price: 0,
    description: 'どんな施術も体験できます！完全無料でじっくり60分'
  },
  {
    id: 'general-regular',
    name: '一般施術',
    duration: 15,
    price: 800,
    description: '肩こり・腰痛などの一般的な症状に対応'
  },
  {
    id: 'postnatal-regular',
    name: '産後骨盤矯正',
    duration: 60,
    price: null, // 料金表示なし
    description: '産後の骨盤の歪みをしっかりと整えます'
  }
];

// 眼精疲労オプション
export const EYE_CARE_OPTION: EyeCareOption = {
  name: '眼精疲労ケア',
  priceFirst: 1000,
  priceRegular: 1500,
  description: 'PC作業による目の疲れ・頭痛の改善'
};

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
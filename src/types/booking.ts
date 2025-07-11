export interface TimeSlot {
  time: string; // "09:00"
  duration: number; // 分
  available: boolean;
  menuType: string;
}

export interface MenuItem {
  id: string;
  name: string;
  duration: number; // 分
  description?: string; // メニュー説明
}

export interface Booking {
  id: string;
  date: string; // "2025-07-05"
  timeSlot: string; // "09:00"
  duration: number;
  menuId: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
  isFirstTime?: boolean; // 初回かどうか
}

export interface BusinessHours {
  start: string; // "09:00"
  end: string;   // "20:00"
  lunchStart?: string; // "14:00"
  lunchEnd?: string;   // "15:00"
  closedDays: number[]; // [0] = 日曜日
}


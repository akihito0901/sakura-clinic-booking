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
}

export interface BusinessHours {
  start: string; // "09:00"
  end: string;   // "20:00"
  lunchStart?: string; // "14:00"
  lunchEnd?: string;   // "15:00"
  closedDays: number[]; // [0] = 日曜日
}

export interface EyeCareOption {
  name: string;
  priceFirst: number;
  priceRegular: number;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isFirstTime: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSession {
  userId: string;
  expiresAt: string;
}
import type { IClinic } from '../../clinic/types';
import type { ICategory } from '../../category/types';

export interface IDoctor {
  id: number;
  fullname_uz: string;
  fullname_ru: string;
  fullname_en: string;
  phone_number: string;
  price: number;
  experience: number;
  category_id: number;
  category: ICategory;
  clinic_id: number | null;
  clinic: IClinic | null;
  rating: number;
  avatar: string | null;
  is_active: boolean;
  schedules: IDoctorSchedule[];
}

export interface IDoctorCreateRequest {
  fullname_uz: string;
  fullname_ru: string;
  fullname_en: string;
  phone_number: string;
  price: number;
  experience: number;
  category_id: number;
  clinic_id?: number | null;
  is_active: boolean;
}

export interface IDoctorUpdateRequest {
  fullname_uz?: string;
  fullname_ru?: string;
  fullname_en?: string;
  phone_number?: string;
  price?: number;
  experience?: number;
  category_id?: number;
  clinic_id?: number | null;
  rating?: number;
  is_active?: boolean;
}

export interface IDoctorScheduleSlot {
  day_of_week: number;
  slots: string[];
}

export interface IDoctorSchedule extends IDoctorScheduleSlot {
  id: number;
  doctor_id?: number;
}

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
    rating: number;
    avatar: string | null;
    is_active: boolean;
}

export interface IDoctorCreateRequest {
    fullname_uz: string;
    fullname_ru: string;
    fullname_en: string;
    phone_number: string;
    price: number;
    experience: number;
    category_id: number;
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
    rating?: number;
    is_active?: boolean;
}

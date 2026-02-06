export interface IService {
    id: number;
    title_uz: string;
    title_ru: string;
    title_en: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    price: number;
    image: string | null;
}

export interface IServiceCreateRequest {
    title_uz: string;
    title_ru: string;
    title_en: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    price: number;
}

export interface IServiceUpdateRequest {
    title_uz?: string;
    title_ru?: string;
    title_en?: string;
    description_uz?: string;
    description_ru?: string;
    description_en?: string;
    price?: number;
}

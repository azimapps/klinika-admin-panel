export interface ICategory {
    id: number;
    title_uz: string;
    title_ru: string;
    title_en: string;
    avatar: string | null;
}

export interface ICategoryCreateRequest {
    title_uz: string;
    title_ru: string;
    title_en: string;
}

export interface ICategoryUpdateRequest {
    title_uz?: string;
    title_ru?: string;
    title_en?: string;
}

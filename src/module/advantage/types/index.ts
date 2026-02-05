export interface IAdvantage {
    id: number;
    title_uz: string;
    title_ru: string;
    title_en: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    image: string | null;
}

export interface IAdvantageCreateRequest {
    title_uz: string;
    title_ru: string;
    title_en: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
}

export interface IAdvantageUpdateRequest {
    title_uz?: string;
    title_ru?: string;
    title_en?: string;
    description_uz?: string;
    description_ru?: string;
    description_en?: string;
}

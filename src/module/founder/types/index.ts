export interface IFounder {
    id: number;
    name_uz: string;
    name_ru: string;
    name_en: string;
    position_uz: string;
    position_ru: string;
    position_en: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    linked_url: string;
    avatar: string | null;
}

export interface IFounderCreateRequest {
    name_uz: string;
    name_ru: string;
    name_en: string;
    position_uz: string;
    position_ru: string;
    position_en: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    linked_url: string;
}

export interface IFounderUpdateRequest {
    name_uz?: string;
    name_ru?: string;
    name_en?: string;
    position_uz?: string;
    position_ru?: string;
    position_en?: string;
    description_uz?: string;
    description_ru?: string;
    description_en?: string;
    linked_url?: string;
}

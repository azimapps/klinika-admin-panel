// ----------------------------------------------------------------------

export interface ITip {
    id: number;
    title_uz: string;
    title_ru: string;
    title_en: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    image: string | null;
    order: number;
    is_active: boolean;
}

export type ITipCreateRequest = {
    title_uz: string;
    title_ru: string;
    title_en?: string;
    description_uz: string;
    description_ru: string;
    description_en?: string;
    order?: number;
    is_active?: boolean;
};

export type ITipUpdateRequest = Partial<ITipCreateRequest>;

export interface ITipState {
    tips: ITip[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

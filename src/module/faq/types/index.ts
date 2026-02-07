// ----------------------------------------------------------------------

export interface IFAQ {
    id: number;
    question_uz: string;
    question_ru: string;
    question_en: string;
    answer_uz: string;
    answer_ru: string;
    answer_en: string;
}

export type IFAQCreateRequest = Omit<IFAQ, 'id'> & {
    question_en?: string;
    answer_en?: string;
};

export type IFAQUpdateRequest = Partial<Omit<IFAQ, 'id'>>;

export interface IFAQState {
    faqs: IFAQ[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

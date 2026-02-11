export interface INotification {
    id: number;
    title_uz: string;
    title_ru: string;
    title_en: string;
    body_uz: string;
    body_ru: string;
    body_en: string;
    created_at: string;
    sent_to: number;
}

export interface INotificationCreateRequest {
    title_uz: string;
    title_ru: string;
    title_en?: string;
    body_uz: string;
    body_ru: string;
    body_en?: string;
}

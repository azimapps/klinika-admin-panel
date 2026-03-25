// ----------------------------------------------------------------------

export type ConsultationRequestStatusName = 'new' | 'reviewed' | 'sent' | 'invoiced' | 'accepted' | 'rejected' | 'expired';

export interface IInvoice {
    amount: number;
    state: 'pending' | 'paid' | 'cancelled';
    expires_at: string | null;
}

// Status can come as a string or an object from the API
export type ConsultationRequestStatusRaw = ConsultationRequestStatusName | { code: number; name: string } | { [key: string]: any };

export interface IConsultationRequest {
    id: number;
    client_id: number;
    client_name: string;
    client_phone: string;
    category_id: number;
    category_title_uz: string;
    category_title_ru: string;
    category_title_en: string;
    service_id: number;
    service_title_uz: string;
    service_title_ru: string;
    service_title_en: string;
    description: string;
    files: string[];
    status: ConsultationRequestStatusRaw;
    order_id: number | null;
    invoice: IInvoice | null;
    created_at: string;
}

// Helper to extract status name string from whatever format the API returns
export function getStatusName(status: ConsultationRequestStatusRaw): ConsultationRequestStatusName {
    if (typeof status === 'string') return status as ConsultationRequestStatusName;
    if (typeof status === 'object' && status !== null) {
        const obj = status as Record<string, any>;
        return (obj.name || obj.value || obj.status || 'new') as ConsultationRequestStatusName;
    }
    return 'new';
}

export interface IConsultationRequestPagination {
    items: IConsultationRequest[];
    total: number;
    page: number;
    per_page: number;
}

export interface ISendInvoiceResponse {
    message: string;
    request_id: number;
    order_id: number;
    amount: number;
    expires_at: string;
    checkout_url_payme: string;
    checkout_url_click: string;
}

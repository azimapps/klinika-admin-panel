// ----------------------------------------------------------------------

export interface IClinic {
    id: number;
    title_uz: string;
    title_ru: string;
    title_en: string;
    address_uz: string;
    address_ru: string;
    address_en: string;
    lat: number;
    lon: number;
}

export type IClinicCreateRequest = Omit<IClinic, 'id'> & {
    title_en?: string;
    address_en?: string;
};

export type IClinicUpdateRequest = Partial<Omit<IClinic, 'id'>>;

export interface IClinicState {
    clinics: IClinic[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

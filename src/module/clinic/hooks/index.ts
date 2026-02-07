import { toast } from 'sonner';
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/lib/axios';

import type { IClinic, IClinicCreateRequest, IClinicUpdateRequest } from '../types';

// ----------------------------------------------------------------------

export function useGetClinics() {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['clinics'],
        queryFn: async () => {
            const res = await axios.get(endpoints.clinic.list);
            return res.data;
        },
    });

    const clinics = useMemo(() => (data as IClinic[]) || [], [data]);

    return {
        data: clinics,
        isLoading,
        isError,
        error,
    };
}

// ----------------------------------------------------------------------

export function useCreateClinic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: IClinicCreateRequest) => {
            const res = await axios.post(endpoints.clinic.create, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinics'] });
            toast.success('Klinika muvaffaqiyatli yaratildi!');
        },
        onError: (error: any) => {
            console.error('Create Clinic Error:', error);
            const status = error?.response?.status;
            let errorMessage = 'Xatolik yuz berdi';

            if (error?.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    errorMessage = detail.map((e: any) => e.msg).join(', ');
                } else {
                    errorMessage = detail;
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }

            if (status === 401) {
                errorMessage = 'Sessiya vaqti tugagan yoki token yaroqsiz (401). Iltimos, qayta kiring.';
            } else if (status === 403) {
                errorMessage = 'Sizda ruxsat yo\'q (403).';
            }

            toast.error(`${errorMessage} ${status ? `(${status})` : ''}`);
        },
    });
}

// ----------------------------------------------------------------------

export function useUpdateClinic(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: IClinicUpdateRequest) => {
            const res = await axios.put(endpoints.clinic.details(id), data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinics'] });
            toast.success('Klinika muvaffaqiyatli yangilandi!');
        },
        onError: (error: any) => {
            console.error('Update Clinic Error:', error);
            toast.error('Klinikani yangilashda xatolik yuz berdi');
        },
    });
}

// ----------------------------------------------------------------------

export function useDeleteClinic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(endpoints.clinic.details(id.toString()));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clinics'] });
            toast.success('Klinika muvaffaqiyatli o\'chirildi!');
        },
        onError: (error: any) => {
            console.error('Delete Clinic Error:', error);
            toast.error('Klinikani o\'chirishda xatolik yuz berdi');
        },
    });
}

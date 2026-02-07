import { toast } from 'sonner';
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/lib/axios';

import type { IFAQ, IFAQCreateRequest, IFAQUpdateRequest } from '../types';

// ----------------------------------------------------------------------

export function useGetFAQs() {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['faqs'],
        queryFn: async () => {
            const res = await axios.get(endpoints.faq.list);
            return res.data;
        },
    });

    const faqs = useMemo(() => (data as IFAQ[]) || [], [data]);

    return {
        data: faqs,
        isLoading,
        isError,
        error,
    };
}

// ----------------------------------------------------------------------

export function useCreateFAQ() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: IFAQCreateRequest) => {
            const res = await axios.post(endpoints.faq.create, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            toast.success('Savol-javob muvaffaqiyatli yaratildi!');
        },
        onError: (error: any) => {
            console.error('Create FAQ Error:', error);
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

export function useUpdateFAQ(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: IFAQUpdateRequest) => {
            const res = await axios.put(endpoints.faq.details(id), data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            toast.success('Savol-javob muvaffaqiyatli yangilandi!');
        },
        onError: (error: any) => {
            console.error('Update FAQ Error:', error);
            toast.error('Savol-javobni yangilashda xatolik yuz berdi');
        },
    });
}

// ----------------------------------------------------------------------

export function useDeleteFAQ() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(endpoints.faq.details(id.toString()));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            toast.success('Savol-javob muvaffaqiyatli o\'chirildi!');
        },
        onError: (error: any) => {
            console.error('Delete FAQ Error:', error);
            toast.error('Savol-javobni o\'chirishda xatolik yuz berdi');
        },
    });
}

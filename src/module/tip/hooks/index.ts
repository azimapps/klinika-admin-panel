import { toast } from 'sonner';
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/lib/axios';

import type { ITip, ITipCreateRequest, ITipUpdateRequest } from '../types';

// ----------------------------------------------------------------------

export function useGetTips() {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['tips'],
        queryFn: async () => {
            const res = await axios.get(endpoints.tip.list);
            return res.data;
        },
    });

    const tips = useMemo(() => (data as ITip[]) || [], [data]);

    return {
        data: tips,
        isLoading,
        isError,
        error,
    };
}

// ----------------------------------------------------------------------

export function useCreateTip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ITipCreateRequest) => {
            const res = await axios.post(endpoints.tip.create, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tips'] });
            toast.success('Maslahat muvaffaqiyatli yaratildi!');
        },
        onError: (error: any) => {
            console.error('Create Tip Error:', error);
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

export function useUpdateTip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: ITipUpdateRequest }) => {
            const res = await axios.put(endpoints.tip.details(id), data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tips'] });
            toast.success('Maslahat muvaffaqiyatli yangilandi!');
        },
        onError: (error: any) => {
            console.error('Update Tip Error:', error);
            toast.error('Maslahatni yangilashda xatolik yuz berdi');
        },
    });
}

// ----------------------------------------------------------------------

export function useDeleteTip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(endpoints.tip.details(id.toString()));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tips'] });
            toast.success('Maslahat muvaffaqiyatli o\'chirildi!');
        },
        onError: (error: any) => {
            console.error('Delete Tip Error:', error);
            toast.error('Maslahatni o\'chirishda xatolik yuz berdi');
        },
    });
}

// ----------------------------------------------------------------------

export function useUploadTipImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, file }: { id: number; file: File }) => {
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post(endpoints.tip.image(id.toString()), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tips'] });
            toast.success('Rasm muvaffaqiyatli yuklandi!');
        },
        onError: (error: any) => {
            console.error('Upload Tip Image Error:', error);
            const status = error?.response?.status;
            let errorMessage = 'Rasmni yuklashda xatolik yuz berdi';

            if (status === 400) {
                if (error?.response?.data?.detail) {
                    errorMessage = error.response.data.detail;
                } else {
                    errorMessage = 'Noto‘g‘ri so‘rov (400).';
                }
            } else if (status === 413) {
                errorMessage = 'Rasm hajmi juda katta (413).';
            }

            toast.error(errorMessage);
        },
    });
}

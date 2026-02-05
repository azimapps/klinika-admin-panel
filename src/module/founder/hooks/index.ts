import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import type { IFounder, IFounderCreateRequest, IFounderUpdateRequest } from '../types';

// ----------------------------------------------------------------------

export const useGetFounders = () =>
    useQuery<IFounder[]>({
        queryKey: ['founders'],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.founder.list);
            return res.data;
        },
    });

export const useGetFounder = (id: string) =>
    useQuery<IFounder>({
        queryKey: ['founder', id],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.founder.details(id));
            return res.data;
        },
        enabled: !!id,
    });

export const useCreateFounder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: IFounderCreateRequest) => {
            const res = await axiosInstance.post(endpoints.founder.create, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['founders'] });
            toast.success('Asoschi muvaffaqiyatli yaratildi');
        },
        onError: (error: any) => {
            console.error('Create Founder Error:', error);
            toast.error('Xatolik yuz berdi');
        },
    });
};

export const useUpdateFounder = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: IFounderUpdateRequest) => {
            const res = await axiosInstance.put(endpoints.founder.details(id), data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['founders'] });
            queryClient.invalidateQueries({ queryKey: ['founder', id] });
            toast.success('Asoschi ma\'lumotlari yangilandi');
        },
        onError: (error: any) => {
            console.error('Update Founder Error:', error);
            toast.error('Xatolik yuz berdi');
        },
    });
};

export const useDeleteFounder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await axiosInstance.delete(endpoints.founder.details(id.toString()));
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['founders'] });
            toast.success('Asoschi o\'chirildi');
        },
        onError: (error: any) => {
            console.error('Delete Founder Error:', error);
            toast.error('Xatolik yuz berdi');
        },
    });
};

export const useUploadFounderAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, file }: { id: string; file: File }) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axiosInstance.post(endpoints.founder.avatar(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['founders'] });
            toast.success('Rasm muvaffaqiyatli yuklandi');
        },
        onError: (error: any) => {
            console.error('Upload Avatar Error:', error);
            toast.error('Rasm yuklashda xatolik');
        },
    });
};

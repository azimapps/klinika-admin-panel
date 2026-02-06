import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import type { IService, IServiceCreateRequest, IServiceUpdateRequest } from '../types';

// ----------------------------------------------------------------------

export const useGetServices = () =>
    useQuery<IService[]>({
        queryKey: ['services'],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.service.list);
            return res.data;
        },
    });

export const useGetService = (id: string) =>
    useQuery<IService>({
        queryKey: ['service', id],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.service.details(id));
            return res.data;
        },
        enabled: !!id,
    });

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: IServiceCreateRequest) => {
            const res = await axiosInstance.post(endpoints.service.create, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast.success('Xizmat muvaffaqiyatli yaratildi');
        },
        onError: (error: any) => {
            console.error('Create Service Error:', error);
            const errorMessage = error?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUpdateService = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: IServiceUpdateRequest) => {
            const res = await axiosInstance.put(endpoints.service.details(id), data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['service', id] });
            toast.success('Xizmat muvaffaqiyatli yangilandi');
        },
        onError: (error: any) => {
            console.error('Update Service Error:', error);
            const errorMessage = error?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await axiosInstance.delete(endpoints.service.details(id.toString()));
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast.success("Xizmat o'chirildi");
        },
        onError: (error: any) => {
            console.error('Delete Service Error:', error);
            const errorMessage = error?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUploadServiceImage = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axiosInstance.post(endpoints.service.image(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            queryClient.invalidateQueries({ queryKey: ['service', id] });
            toast.success('Rasm muvaffaqiyatli yuklandi');
        },
        onError: (error: any) => {
            console.error('Upload Image Error:', error);
            const errorMessage = error?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

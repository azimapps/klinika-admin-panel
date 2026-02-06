import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import type { ICategory, ICategoryCreateRequest, ICategoryUpdateRequest } from '../types';

// ----------------------------------------------------------------------

export const useGetCategories = () =>
    useQuery<ICategory[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.category.list);
            return res.data;
        },
    });

export const useGetCategory = (id: string) =>
    useQuery<ICategory>({
        queryKey: ['category', id],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.category.details(id));
            return res.data;
        },
        enabled: !!id,
    });

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ICategoryCreateRequest) => {
            const res = await axiosInstance.post(endpoints.category.list, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Kategoriya muvaffaqiyatli yaratildi');
        },
        onError: (error: any) => {
            console.error('Create Category Error:', error);
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
};

export const useUpdateCategory = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ICategoryUpdateRequest) => {
            const res = await axiosInstance.put(endpoints.category.details(id), data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['category', id] });
            toast.success('Kategoriya muvaffaqiyatli yangilandi');
        },
        onError: (error: any) => {
            console.error('Update Category Error:', error);
            const status = error?.response?.status;
            let errorMessage = 'Xatolik yuz berdi';

            if (Array.isArray(error?.detail)) {
                errorMessage = error.detail.map((e: any) => e.msg).join(', ');
            } else if (error?.detail) {
                errorMessage = error.detail;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            if (status === 401) {
                errorMessage = 'Sessiya vaqti tugagan yoki token yaroqsiz (401). Iltimos, qayta kiring.';
            }

            toast.error(`${errorMessage} ${status ? `(${status})` : ''}`);
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await axiosInstance.delete(endpoints.category.details(id.toString()));
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success("Kategoriya o'chirildi");
        },
        onError: (error: any) => {
            console.error('Delete Category Error:', error);
            const errorMessage = error?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUploadCategoryAvatar = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axiosInstance.post(endpoints.category.avatar(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['category', id] });
            toast.success('Rasm muvaffaqiyatli yuklandi');
        },
        onError: (error: any) => {
            console.error('Upload Avatar Error:', error);
            const errorMessage = error?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

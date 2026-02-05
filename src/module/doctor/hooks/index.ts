import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import type { IDoctor, IDoctorCreateRequest, IDoctorUpdateRequest } from '../types';

// ----------------------------------------------------------------------

export const useGetDoctors = () =>
    useQuery<IDoctor[]>({
        queryKey: ['doctors'],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.doctor.list);
            return res.data;
        },
    });

export const useGetDoctor = (id: string) =>
    useQuery<IDoctor>({
        queryKey: ['doctor', id],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.doctor.details(id));
            return res.data;
        },
        enabled: !!id,
    });

export const useCreateDoctor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: IDoctorCreateRequest) => {
            const res = await axiosInstance.post(endpoints.doctor.list, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
            toast.success('Shifokor muvaffaqiyatli yaratildi');
        },
        onError: (error: any) => {
            console.error('Create Doctor Error:', error);
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
            } else if (status === 403) {
                errorMessage = 'Sizda ruxsat yo\'q (403).';
            }

            toast.error(`${errorMessage} ${status ? `(${status})` : ''}`);
        },
    });
};

export const useUpdateDoctor = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: IDoctorUpdateRequest) => {
            const res = await axiosInstance.put(endpoints.doctor.details(id), data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
            queryClient.invalidateQueries({ queryKey: ['doctor', id] });
            toast.success('Shifokor muvaffaqiyatli yangilandi');
        },
        onError: (error: any) => {
            console.error('Update Doctor Error:', error);
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

export const useDeleteDoctor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await axiosInstance.delete(endpoints.doctor.details(id.toString()));
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
            toast.success("Shifokor o'chirildi");
        },
        onError: (error: any) => {
            console.error('Delete Doctor Error:', error);
            const errorMessage = error?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUploadDoctorAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, file }: { id: string; file: File }) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axiosInstance.post(endpoints.doctor.avatar(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
            toast.success('Rasm muvaffaqiyatli yuklandi');
        },
        onError: (error: any) => {
            console.error('Upload Avatar Error:', error);
            const errorMessage = error?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

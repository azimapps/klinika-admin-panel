import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/lib/axios';

import type { INotification, INotificationCreateRequest } from '../types';

// ----------------------------------------------------------------------

export function useGetNotifications() {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await axios.get<INotification[]>(endpoints.notification.list);
            return res.data;
        },
    });

    return {
        data,
        isLoading,
        error,
        isError,
    };
}

export function useCreateNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: INotificationCreateRequest) => {
            const res = await axios.post(endpoints.notification.create, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Xabarnoma muvaffaqiyatli jo\'natildi!');
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error: any) => {
            console.error('Error creating notification:', error);
            toast.error(error?.message || 'Xatolik yuz berdi!');
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await axios.delete(endpoints.notification.delete(id.toString()));
            return res.data;
        },
        onSuccess: () => {
            toast.success('Xabarnoma muvaffaqiyatli o\'chirildi!');
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error: any) => {
            console.error('Error deleting notification:', error);
            toast.error(error?.message || 'Xatolik yuz berdi!');
        },
    });
}

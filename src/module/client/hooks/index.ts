
import { useQuery } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import type { IClientPagination } from '../types';

// ----------------------------------------------------------------------

export const useGetClients = (params: { page?: number; per_page?: number; search?: string }) =>
    useQuery<IClientPagination>({
        queryKey: ['clients', params],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.client.list, {
                params,
            });
            return res.data;
        },
    });

export const useGetClient = (id: string) =>
    useQuery({
        queryKey: ['client', id],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.client.details(id));
            return res.data;
        },
        enabled: !!id,
    });

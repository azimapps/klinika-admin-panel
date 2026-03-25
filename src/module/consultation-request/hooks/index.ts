import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import type { ISendInvoiceResponse, IConsultationRequestPagination } from '../types';

// ----------------------------------------------------------------------

interface UseGetConsultationRequestsParams {
    page?: number;
    per_page?: number;
    status?: number;
}

export function useGetConsultationRequests(params: UseGetConsultationRequestsParams) {
    const { data, isLoading, error, isError } = useQuery<IConsultationRequestPagination>({
        queryKey: ['consultation-requests', params],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.consultationRequest.list, {
                params,
            });
            return res.data;
        },
    });

    return {
        data,
        isLoading,
        isError,
        error,
    };
}

// ----------------------------------------------------------------------

export function useGetConsultationRequest(id: string) {
    return useQuery({
        queryKey: ['consultation-request', id],
        queryFn: async () => {
            const res = await axiosInstance.get(endpoints.consultationRequest.details(id));
            return res.data;
        },
        enabled: !!id,
    });
}

// ----------------------------------------------------------------------

export function useUpdateConsultationRequestStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: number }) => {
            const res = await axiosInstance.patch(
                endpoints.consultationRequest.updateStatus(id.toString()),
                null,
                { params: { status } }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultation-requests'] });
            toast.success('So\'rov holati muvaffaqiyatli yangilandi!');
        },
        onError: (error: any) => {
            console.error('Update status error:', error);
            const errorMessage = error?.response?.data?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
}

// ----------------------------------------------------------------------

export function useSendInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, amount }: { id: number; amount: number }) => {
            const res = await axiosInstance.post<ISendInvoiceResponse>(
                endpoints.consultationRequest.invoice(id.toString()),
                { amount }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultation-requests'] });
            toast.success('Hisob-faktura muvaffaqiyatli yuborildi!');
        },
        onError: (error: any) => {
            console.error('Send invoice error:', error);
            const errorMessage = error?.response?.data?.detail || error?.message || 'Xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
}

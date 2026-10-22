import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import type {
  IDistrict,
  IOpsNewCount,
  IStatusChange,
  IOpsListParams,
  IAssignResponse,
  IOpsListResponse,
  IOpsRequestCreate,
  IOpsRequestDetail,
  IOpsRequestUpdate,
  IPaymentLinkParams,
  IPaymentMarkParams,
  IStatusHistoryEntry,
  IPaymentLinkResponse,
  IClientLookupResponse,
} from '../types';

// ----------------------------------------------------------------------
// The axios response interceptor rejects with the response body (e.g. { detail })
// or a plain string, so errors can arrive in several shapes.
// ----------------------------------------------------------------------

function extractError(error: any): string {
  const status = error?.response?.status ?? error?.status;
  const detail = error?.response?.data?.detail ?? error?.detail;

  let message = 'Xatolik yuz berdi';
  if (Array.isArray(detail)) {
    message = detail.map((e: any) => e?.msg).filter(Boolean).join(', ') || message;
  } else if (typeof detail === 'string') {
    message = detail;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error?.message) {
    message = error.message;
  }

  if (status === 401) {
    message = 'Sessiya tugagan (401). Iltimos, qayta kiring.';
  } else if (status === 403) {
    message = "Sizda ruxsat yo'q (403).";
  }

  return status ? `${message} (${status})` : message;
}

const OPS_KEY = 'ops-requests';

// ----------------------------------------------------------------------
// Queries
// ----------------------------------------------------------------------

export function useGetOpsRequests(params: IOpsListParams) {
  return useQuery<IOpsListResponse>({
    queryKey: [OPS_KEY, params],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.ops.requests, { params });
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useGetOpsNewCount() {
  return useQuery<IOpsNewCount>({
    queryKey: ['ops-new-count'],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.ops.newCount);
      return res.data;
    },
    refetchInterval: 30_000,
  });
}

export function useGetOpsRequest(id?: number) {
  return useQuery<IOpsRequestDetail>({
    queryKey: ['ops-request', id],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.ops.detail(String(id)));
      return res.data;
    },
    enabled: !!id,
  });
}

export function useGetStatusHistory(id?: number) {
  return useQuery<IStatusHistoryEntry[]>({
    queryKey: ['ops-history', id],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.ops.history(String(id)));
      return res.data;
    },
    enabled: !!id,
  });
}

export function useClientLookup(phone: string, enabled: boolean) {
  return useQuery<IClientLookupResponse>({
    queryKey: ['ops-client-lookup', phone],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.ops.clientLookup, { params: { phone } });
      return res.data;
    },
    enabled,
  });
}

export function useGetDistricts() {
  return useQuery<IDistrict[]>({
    queryKey: ['districts'],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.districts);
      return res.data;
    },
  });
}

// ----------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------

/** Refresh every cache that depends on a single request. */
function useInvalidateRequest() {
  const queryClient = useQueryClient();
  return (id?: number) => {
    queryClient.invalidateQueries({ queryKey: [OPS_KEY] });
    queryClient.invalidateQueries({ queryKey: ['ops-new-count'] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['ops-request', id] });
      queryClient.invalidateQueries({ queryKey: ['ops-history', id] });
    }
  };
}

export function useTakeRequest() {
  const invalidate = useInvalidateRequest();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.post(endpoints.ops.take(String(id)));
      return res.data as IOpsRequestDetail;
    },
    onSuccess: (data) => {
      invalidate(data.id);
      toast.success("So'rov qabul qilindi");
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useUpdateOpsRequest() {
  const invalidate = useInvalidateRequest();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IOpsRequestUpdate }) => {
      const res = await axiosInstance.patch(endpoints.ops.detail(String(id)), data);
      return res.data as IOpsRequestDetail;
    },
    onSuccess: (data) => {
      invalidate(data.id);
      toast.success('Maʼlumotlar saqlandi');
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useChangeOpsStatus() {
  const invalidate = useInvalidateRequest();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IStatusChange }) => {
      const res = await axiosInstance.post(endpoints.ops.status(String(id)), data);
      return res.data as IOpsRequestDetail;
    },
    onSuccess: (data) => {
      invalidate(data.id);
      toast.success('Holat yangilandi');
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useAssignSpecialist() {
  const invalidate = useInvalidateRequest();
  return useMutation({
    mutationFn: async ({ id, specialist_id }: { id: number; specialist_id: number }) => {
      const res = await axiosInstance.post(endpoints.ops.assign(String(id)), { specialist_id });
      return res.data as IAssignResponse;
    },
    onSuccess: (data) => {
      invalidate(data.id);
      toast.success(
        data.specialist_notified
          ? 'Mutaxassis tayinlandi va xabardor qilindi'
          : 'Mutaxassis tayinlandi (Telegram ulanmagan)'
      );
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useCreateOpsRequest() {
  const invalidate = useInvalidateRequest();
  return useMutation({
    mutationFn: async (data: IOpsRequestCreate) => {
      const res = await axiosInstance.post(endpoints.ops.requests, data);
      return res.data as IOpsRequestDetail;
    },
    onSuccess: (data) => {
      invalidate(data.id);
      toast.success(`So'rov yaratildi: ${data.request_number}`);
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useSendPaymentLink() {
  const invalidate = useInvalidateRequest();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IPaymentLinkParams }) => {
      const res = await axiosInstance.post(endpoints.ops.paymentLink(String(id)), data);
      return res.data as IPaymentLinkResponse;
    },
    onSuccess: (_data, variables) => {
      invalidate(variables.id);
      toast.success("To'lov havolasi yaratildi");
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useMarkPayment() {
  const invalidate = useInvalidateRequest();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IPaymentMarkParams }) => {
      const res = await axiosInstance.post(endpoints.ops.paymentMark(String(id)), data);
      return res.data as IOpsRequestDetail;
    },
    onSuccess: (data) => {
      invalidate(data.id);
      toast.success("To'lov holati yangilandi");
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

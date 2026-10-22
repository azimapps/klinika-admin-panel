import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import type { IStaffUser, IStaffCreate, IStaffUpdate, IStaffListParams } from '../types';

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

  if (status === 403) {
    message = "Sizda ruxsat yo'q (faqat administrator)";
  }
  return message;
}

const STAFF_KEY = 'staff-users';

// ----------------------------------------------------------------------

export function useGetStaff(params: IStaffListParams) {
  return useQuery<IStaffUser[]>({
    queryKey: [STAFF_KEY, params],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.staffUsers.list, { params });
      return res.data;
    },
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IStaffCreate) => {
      const res = await axiosInstance.post(endpoints.staffUsers.list, data);
      return res.data as IStaffUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_KEY] });
      toast.success('Xodim yaratildi');
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IStaffUpdate }) => {
      const res = await axiosInstance.patch(endpoints.staffUsers.detail(String(id)), data);
      return res.data as IStaffUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_KEY] });
      toast.success('Xodim yangilandi');
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useBlockStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.post(endpoints.staffUsers.block(String(id)));
      return res.data as IStaffUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_KEY] });
      toast.success('Xodim bloklandi');
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useUnblockStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.post(endpoints.staffUsers.unblock(String(id)));
      return res.data as IStaffUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_KEY] });
      toast.success('Blok olib tashlandi');
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

export function useResetStaffPassword() {
  return useMutation({
    mutationFn: async ({ id, new_password }: { id: number; new_password: string }) => {
      const res = await axiosInstance.post(endpoints.staffUsers.resetPassword(String(id)), {
        new_password,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Parol yangilandi');
    },
    onError: (error) => toast.error(extractError(error)),
  });
}

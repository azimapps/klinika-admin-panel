import { toast } from 'sonner';
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios, { endpoints } from 'src/lib/axios';

import type { IVideo, IVideoCreateRequest, IVideoUpdateRequest } from '../types';

// ----------------------------------------------------------------------

function readError(error: any, fallback: string) {
  const detail = error?.response?.data?.detail ?? error?.detail;

  if (Array.isArray(detail)) {
    return detail.map((e: any) => e.msg).join(', ');
  }
  if (typeof detail === 'string') {
    return detail;
  }
  return error?.message || fallback;
}

// ----------------------------------------------------------------------

export function useGetVideos() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const res = await axios.get(endpoints.video.list);
      return res.data;
    },
  });

  const videos = useMemo(() => (data as IVideo[]) || [], [data]);

  return { data: videos, isLoading, isError, error };
}

// ----------------------------------------------------------------------

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IVideoCreateRequest) => {
      const res = await axios.post(endpoints.video.create, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video muvaffaqiyatli yaratildi!');
    },
    onError: (error: any) => {
      console.error('Create Video Error:', error);
      toast.error(readError(error, 'Video yaratishda xatolik yuz berdi'));
    },
  });
}

// ----------------------------------------------------------------------

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IVideoUpdateRequest }) => {
      const res = await axios.put(endpoints.video.details(id), data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video muvaffaqiyatli yangilandi!');
    },
    onError: (error: any) => {
      console.error('Update Video Error:', error);
      toast.error(readError(error, 'Videoni yangilashda xatolik yuz berdi'));
    },
  });
}

// ----------------------------------------------------------------------

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(endpoints.video.details(id.toString()));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success("Video muvaffaqiyatli o'chirildi!");
    },
    onError: (error: any) => {
      console.error('Delete Video Error:', error);
      toast.error(readError(error, "Videoni o'chirishda xatolik yuz berdi"));
    },
  });
}

// ----------------------------------------------------------------------

export function useUploadVideoThumbnail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(endpoints.video.thumbnail(id.toString()), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Rasm muvaffaqiyatli yuklandi!');
    },
    onError: (error: any) => {
      console.error('Upload Video Thumbnail Error:', error);
      toast.error(readError(error, 'Rasmni yuklashda xatolik yuz berdi'));
    },
  });
}

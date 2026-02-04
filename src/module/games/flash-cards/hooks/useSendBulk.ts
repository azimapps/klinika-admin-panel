import { useQuery, useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/lib/query';

import { toast } from 'src/components/snackbar';

import { bulkUpload } from '../api/flashCard';

export const useSendBulkJson = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      console.log('data', data);
      return bulkUpload.uploadJson(data);
    },
    onSuccess: () => {
      toast.success('Bulk JSON sent successfully', { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-topic-words-list'],
      });
    },
    onError: () => {
      toast.error('Error sending bulk JSON', { position: 'top-center' });
    },
  });
  return { isPendingJson: isPending, mutateAsyncJson: mutateAsync };
};

export const useSendBulkAudio = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (files: FormData) => bulkUpload.uploadAudio(files),
    onSuccess: () => {
      toast.success('Bulk Audio sent successfully', { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-topic-words-list'],
      });
    },
    onError: () => {
      toast.error('Error sending bulk Audio', { position: 'top-center' });
    },
  });

  return { isPendingAudio: isPending, mutateAsyncAudio: mutateAsync };
};

export const useAudioSearch = (name?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['audio-search', name],
    queryFn: () => bulkUpload.audioSearch(name),
  });
  return { data, isLoading };
};

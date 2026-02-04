import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { flashCard } from '../api/flashCard';

export const useDeleteTopic = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => flashCard.deleteTopic(id),
    onSuccess: () => {
      toast.success(t('flashCard.topicDeleted'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-topic-list'],
      });
    },
    onError: () => {
      toast.error(t('flashCard.errorOccurred'), { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

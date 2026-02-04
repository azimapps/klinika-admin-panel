import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { flashCard } from '../api/flashCard';

import type { ICreateTopicFormType } from '../service/scheme';

export const useCreateTopic = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (values: ICreateTopicFormType) => flashCard.createTopic(values),
    onSuccess: () => {
      toast.success(t('flashCard.topicCreated'), { position: 'top-center' });
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

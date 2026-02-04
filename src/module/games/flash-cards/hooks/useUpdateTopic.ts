import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { flashCard } from '../api/flashCard';

import type { IEditTopicFormType } from '../service/scheme';

export const useUpdateTopic = (id: string) => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (values: IEditTopicFormType) => flashCard.updateTopic(id, values),
    onSuccess: () => {
      toast.success(t('flashCard.topicEdited'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-topic-list', id],
      });
    },
    onError: () => {
      toast.error(t('flashCard.errorOccurred'), { position: 'top-center' });
    },
  });

  return { isUpdating: isPending, updateAsync: mutateAsync };
};

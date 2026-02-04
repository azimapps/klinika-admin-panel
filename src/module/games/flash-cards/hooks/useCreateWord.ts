import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { flashCardWord } from '../api/flashCard';

import type { WordCreateFormTypeWithBooleanIsActive } from '../service/wordScheme';

export const useCreateWord = () => {
  const { t } = useTranslate('mutations');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: WordCreateFormTypeWithBooleanIsActive & { topic: string }) =>
      flashCardWord.createWord(values),
    onSuccess: () => {
      toast.success(t('flashCard.topicWordAdded'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-topic-words-list'],
      });
    },
    onError: () => {
      toast.error(t('flashCard.errorOccurred'), { position: 'top-center' });
    },
  });

  return { mutateAsync, isPending };
};

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { flashCardWord } from '../api/flashCard';

export const useDeleteWord = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => flashCardWord.deleteWord(id),
    onSuccess: () => {
      toast.success(t('flashCard.wordDeleted'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-topic-words-list'],
      });
    },
    onError: () => {
      toast.error(t('flashCard.errorOccurred'), { position: 'top-center' });
    },
  });

  return { onDeleteWord: mutateAsync, isDeleting: isPending };
};

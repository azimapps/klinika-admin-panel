import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { wordBattle } from '../api/word-battle-api';

export const useDeleteWord = (id: string) => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: string[]) => wordBattle.deleteWord(id, value),
    onSuccess: () => {
      toast.success(t('wordBattle.wordDeleted'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['word-battle-words-list'],
      });
    },
    onError: () => {
      toast.error(t('wordBattle.errorOccurred'), { position: 'top-center' });
    },
  });

  return { isDeleting: isPending, onDeleteWord: mutateAsync };
};

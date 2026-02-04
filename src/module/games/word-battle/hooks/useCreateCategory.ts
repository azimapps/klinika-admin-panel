import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { wordBattle } from '../api/word-battle-api';

export const useCreateCategory = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: wordBattle.create,
    onSuccess: () => {
      toast.success(t('wordBattle.categorySaved'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['word-battle-list'],
      });
    },
    onError: () => {
      toast.error(t('wordBattle.errorOccurred'), { position: 'top-center' });
    },
  });
  return { isPending, mutateAsync };
};

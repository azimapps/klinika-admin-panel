import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { wordBattle } from '../api/word-battle-api';

import type { EditCategory } from '../service/FormScheme';

export const useUpdateCategory = (id: string) => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: EditCategory) => wordBattle.update(value, id),
    onSuccess: () => {
      toast.success(t('wordBattle.categoryEdited'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['word-battle-words-list'],
      });
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

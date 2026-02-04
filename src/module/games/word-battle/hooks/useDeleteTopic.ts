import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { wordBattle } from '../api/word-battle-api';

export const useDeleteWordBattleTopic = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => wordBattle.deleteTopic(id),
    onSuccess: () => {
      toast.success(t('wordBattle.categoryDeleted'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['word-battle-list'],
      });
    },
    onError: () => {
      toast.error(t('wordBattle.errorOccurred'), { position: 'top-right' });
    },
  });
  return { isPending, mutateAsync };
};

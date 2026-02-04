import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { wbSettings } from '../api/word-battle-api';

export const useUpdateSettings = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: wbSettings.update,
    onSuccess: () => {
      toast.success(t('wordBattle.settingsEdited'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['word-battle-settings'],
      });
    },
    onError: () => {
      toast.error(t('wordBattle.errorOccurred'), { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

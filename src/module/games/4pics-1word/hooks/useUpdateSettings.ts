import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { settings } from '../api/picsWord';

import type { PicsWordSettingsFormType } from '../service/settingsScheme';

export const useUpdateSettings = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: PicsWordSettingsFormType) => settings.update(value),
    onSuccess: () => {
      toast.success(t('picWord.settingsUpdated'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['pics-word-settings'],
      });
    },
    onError: () => {
      toast.error(t('picWord.errorOccurred'), { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

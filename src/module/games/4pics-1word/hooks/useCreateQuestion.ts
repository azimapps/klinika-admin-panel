import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { picsWord } from '../api/picsWord';

export const useCreateQuestion = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: picsWord.create,
    onSuccess: () => {
      toast.success(t('picWord.questionAdded'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['pics-word-questions'],
      });
    },
    onError: () => {
      toast.error(t('picWord.errorOccurred'), { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

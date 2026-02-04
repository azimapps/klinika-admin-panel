import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { picsWord } from '../api/picsWord';

export const useDeleteQuestion = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: picsWord.delete,
    onSuccess: () => {
      toast.success(t('picWord.questionDeleted'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['pics-word-questions'],
      });
    },
    onError: () => {
      toast.error(t('picWord.errorOccurred'), { position: 'top-center' });
    },
  });

  return { isDeleting: isPending, onDelete: mutateAsync };
};

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { picsWord } from '../api/picsWord';

import type { QuestionFormType } from '../service/questionScheme';

export const useUpdateQuestion = (id: string) => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: QuestionFormType) => picsWord.update(value, id),
    onSuccess: () => {
      toast.success(t('picWord.questionUpdated'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['pics-word-questions'],
      });
    },
    onError: () => {
      toast.error(t('picWord.errorOccurred'), { position: 'top-center' });
    },
  });

  return { isUpdating: isPending, onUpdateAsync: mutateAsync };
};

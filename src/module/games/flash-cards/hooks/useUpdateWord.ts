import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { queryClient } from 'src/lib/query';

import { flashCardWord } from '../api/flashCard';

import type { WordCreateFormTypeWithBooleanIsActive } from '../service/wordScheme';

export const useUpdateWord = (id: string) => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: WordCreateFormTypeWithBooleanIsActive) =>
      flashCardWord.updateWord(id, value),
    onSuccess: () => {
      toast.success(t('flashCard.wordEdited'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-topic-words-list'],
      });
    },
    onError: () => {
      toast.error(t('flashCard.errorOccurred'), { position: 'top-center' });
    },
  });

  return { onUpdating: mutateAsync, isUpdating: isPending };
};

interface Props {
  id: string;
  audio?: string;
  isActive?: boolean;
}

export const useUpdateWordBySelect = () => {
  const { t } = useTranslate('mutations');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: Props) =>
      flashCardWord.updateWord(value.id, { audio: value.audio, isActive: value.isActive }),
    onSuccess: () => {
      toast.success(t('flashCard.wordEdited'), { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-topic-words-list'],
      });
    },
    onError: () => {
      toast.error(t('flashCard.errorOccurred'), { position: 'top-center' });
    },
  });

  return { onUpdateBySelect: mutateAsync, isUpdatingBySelect: isPending };
};

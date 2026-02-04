import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/lib/query';

import { oddOneOutQuestions } from '../api/oddOneOut';

export const useDeleteQuestion = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => oddOneOutQuestions.delete(id),
    onSuccess: () => {
      toast.success("Savol muvaffaqiyatli o'chirildi", { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['odd-one-out-questions'],
      });
    },
    onError: () => {
      toast.error('Xatolik yuz berdi', { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

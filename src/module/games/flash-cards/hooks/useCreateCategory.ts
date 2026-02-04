import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/lib/query';

import { toast } from 'src/components/snackbar';

import { flashCardCategory } from '../api/flashCard';

export const useCreateCategory = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: flashCardCategory.create,
    onSuccess: () => {
      toast.success("Muvaffaqiyatli qo'shildi", { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-category-list'],
      });
    },
    onError: () => {
      toast.error('Xatolik yuz berdi', { position: 'top-center' });
    },
  });
  return { categoryCreateLoading: isPending, categoryCreate: mutateAsync };
};

import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/lib/query';

import { toast } from 'src/components/snackbar';

import { flashCardCategory } from '../api/flashCard';

export const useDeleteCategory = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => flashCardCategory.delete(id),
    onSuccess: () => {
      toast.success('Muvaffaqiyatli ochirildi', { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-category-list'],
      });
    },
    onError: () => {
      toast.error('Xatolik yuz berdi', { position: 'top-center' });
    },
  });
  return { isDeleting: isPending, deleteAsync: mutateAsync };
};

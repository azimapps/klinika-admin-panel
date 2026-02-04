import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/lib/query';

import { toast } from 'src/components/snackbar';

import { flashCardCategory } from '../api/flashCard';

import type { CategoryEditFormType } from '../service/categroy';

export const useUpdateCategory = (id: string) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (values: CategoryEditFormType) => flashCardCategory.update(id, values),
    onSuccess: () => {
      toast.success('Muvaffaqiyatli tahrirlandi', { position: 'top-center' });
      queryClient.invalidateQueries({
        queryKey: ['flash-card-category-list'],
      });
    },
    onError: () => {
      toast.error('Xatolik yuz berdi', { position: 'top-center' });
    },
  });

  return { isUpdating: isPending, updateAsync: mutateAsync };
};

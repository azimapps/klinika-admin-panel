import type { IParams } from 'src/types/params';

import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { flashCardCategory } from '../api/flashCard';
import { categoryListMapper } from '../libs/categoryListMapper';

export const useGetCategoryList = (params?: IParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['flash-card-category-list', params],
    queryFn: () => flashCardCategory.get(),
    select: (res) => categoryListMapper(get(res, 'data', [])),
  });
  return { data, isLoading, error };
};

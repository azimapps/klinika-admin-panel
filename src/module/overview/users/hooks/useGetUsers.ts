import type { IParams } from 'src/types/params';

import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { userApi } from '../api/users';
import { usersMapper } from '../libs/usersMapper';

export const useGetAllUsers = (params: IParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['all-users', params],
    queryFn: () => userApi.getAll(params),
    select: (res) => ({
      users: usersMapper(get(res, 'data', [])),
      pagination: {
        currentPage: get(res, 'currentPage'),
        limit: get(res, 'limit'),
        pagesCount: get(res, 'pagesCount'),
        resultCount: get(res, 'resultCount'),
        totalCount: get(res, 'totalCount'),
      },
    }),
  });

  return { data, isLoading, error };
};

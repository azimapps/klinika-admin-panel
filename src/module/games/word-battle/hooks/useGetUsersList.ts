import type { IParams } from 'src/types/params';

import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { wordBattle } from '../api/word-battle-api';
import { wordBattleUsersMapper } from '../libs/word-battle-users-adapter';

export const useGetUsersList = (params: IParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['word-battle-users-list', params],
    queryFn: () => wordBattle.usersList(params),
    select: (res) => ({
      users: wordBattleUsersMapper(get(res, 'data', [])),
      pagination: {
        currentPage: get(res, 'pagination.currentPage'),
        limit: get(res, 'pagination.limit'),
        pagesCount: get(res, 'pagination.pagesCount'),
        resultCount: get(res, 'pagination.resultCount'),
        totalCount: get(res, 'pagination.totalCount'),
      },
    }),
  });

  return { data, isLoading, error };
};

import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { wordBattle } from '../api/word-battle-api';
import { wordBattleListMapper } from '../libs/word-battle-adapter';

export const useGetWordBattleList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['word-battle-list'],
    queryFn: wordBattle.getList,
    select: (res) => wordBattleListMapper(get(res, 'data', [])),
  });

  return { data, isLoading, error };
};

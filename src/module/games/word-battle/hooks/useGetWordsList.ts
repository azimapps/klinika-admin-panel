import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { wordBattle } from '../api/word-battle-api';

export const useGetWordsList = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['word-battle-words-list', id],
    queryFn: () => wordBattle.wordsList(id),
    select: (res) => ({
      category: {
        image: get(res, 'data.image', ''),
        name: get(res, 'data.topic'),
        id: get(res, 'data._id', ''),
      },
      words: get(res, 'words', []),
    }),
  });

  return { data, isLoading, error };
};

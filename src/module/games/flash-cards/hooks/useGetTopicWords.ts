import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { flashCardWord } from '../api/flashCard';
import { topicsWordMapper } from '../libs/wordListMapper';

export const useGetTopicWords = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['flash-card-topic-words-list'],
    queryFn: () => flashCardWord.getWord(id),
    select: (res) => topicsWordMapper(get(res, 'data', [])),
  });

  return { data, isLoading, error };
};

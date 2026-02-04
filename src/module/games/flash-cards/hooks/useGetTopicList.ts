import type { IParams } from 'src/types/params';

import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { flashCard } from '../api/flashCard';
import { topicListMapper } from '../libs/topiclistMapper';

export const useGetTopicList = (params: IParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['flash-card-topic-list', params],
    queryFn: () => flashCard.getTopics(params),
    select: (res) => ({
      topicList: topicListMapper(get(res, 'data', [])),
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

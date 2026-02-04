import type { IParams } from 'src/types/params';

import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { picsWord } from '../api/picsWord';
import { questionsListMapper } from '../libs/questionListMapper';

export const useGetQuestions = (params: IParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pics-word-questions', params],
    queryFn: () => picsWord.get(params),
    select: (res) => ({
      qeustions: questionsListMapper(get(res, 'data', [])),
      pagination: {
        currentPage: get(res, 'currentPage', 0),
        limit: get(res, 'limit', 0),
        pagesCount: get(res, 'pagesCount', 0),
        resultCount: get(res, 'resultCount', 0),
        totalCount: get(res, 'totalCount', 0),
      },
    }),
  });

  return { data, isLoading, error };
};

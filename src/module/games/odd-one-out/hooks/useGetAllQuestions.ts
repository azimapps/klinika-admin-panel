import type { IParams } from 'src/types/params';

import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { oddOneOutQuestions } from '../api/oddOneOut';
import { oddOneOutQuestionsMapper } from '../libs/questionMapper';

export const useGetAllQuestions = (params: IParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['odd-one-out-questions', params],
    queryFn: () => oddOneOutQuestions.getAllQuestions(params),
    select: (res) => ({
      questions: oddOneOutQuestionsMapper(get(res, 'data', [])),
      pagination: {
        limit: get(res, 'limit'),
        pagesCount: get(res, 'pagesCount'),
        resultCount: get(res, 'resultCount'),
        totalCount: get(res, 'totalCount'),
        currentPage: get(res, 'currentPage'),
      },
    }),
  });

  return { data, isLoading, error };
};

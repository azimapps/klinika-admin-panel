import type { IQuestionsList, IQuestionsListRes } from '../types/Questions';

const questionsListAdapter = (item: IQuestionsListRes): IQuestionsList => ({
  answer: item.answer ?? '',
  createdAt: item.createdAt ?? '',
  images: item.images ?? [],
  updatedAt: item.updatedAt ?? '',
  id: item._id ?? '',
});

export const questionsListMapper = (data: IQuestionsListRes[]) => data?.map(questionsListAdapter);

import type { IOddOneOut, IOddOneOutRes } from '../types/Questions';

export const oddOneOutQuestionsAdapter = (item: IOddOneOutRes): IOddOneOut => ({
  answer: item.answer ?? '',
  createdAt: item?.createdAt ?? '',
  images: item.images ?? [],
  type: item?.type ?? '',
  updatedAt: item?.updatedAt ?? '',
  id: item?._id ?? '',
});
export const oddOneOutQuestionsMapper = (data: IOddOneOutRes[]) =>
  data?.map(oddOneOutQuestionsAdapter) || [];

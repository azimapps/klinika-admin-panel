import type { ITopicCategoryList, ITopicCategoryMapper } from '../types/Category';

export const categoryListAdapter = (item: ITopicCategoryList): ITopicCategoryMapper => ({
  id: item?._id ?? '',
  name: item?.name ?? '',
  description: item?.description ?? '',
  image: item?.image ?? '',
  status: item?.status ?? '',
  order: item?.order ?? 0,
});

export const categoryListMapper = (data: ITopicCategoryList[]) =>
  data?.map(categoryListAdapter) || [];

import type { ITopicWord, ITopicWordsRes } from '../types/WordList';

const topicsWordListAdapter = (item: ITopicWordsRes): ITopicWord => ({
  audio: item.audio ?? '',
  createdAt: item.createdAt ?? '',
  isActive: item.isActive ?? false,
  text: item.text ?? '',
  topic: item.topic ?? '',
  translation: item.translation ?? '',
  updatedAt: item.updatedAt ?? '',
  id: item._id ?? '',
  image: item?.image ?? '',
});

export const topicsWordMapper = (data: ITopicWordsRes[]) => data?.map(topicsWordListAdapter) || [];

import type { ITopicList, ITopicListRes } from '../types/TopicList';

const topicListAdapter = (item?: ITopicListRes): ITopicList => ({
  id: item?._id ?? '',
  image: item?.image ?? '',
  topic: item?.topic ?? '',
  description: item?.description ?? '',
  level: item?.difficultyLevel ?? '',
  lang: item?.language ?? '',
  status: item?.status ?? '',
  createdAt: item?.createdAt ?? '',
  category: item?.category ?? '',
  color1: item?.color1 ?? '',
  color2: item?.color2 ?? '',
  topicColor: item?.topicColor ?? '',
});

export const topicListMapper = (data: ITopicListRes[]) => data?.map(topicListAdapter) || [];

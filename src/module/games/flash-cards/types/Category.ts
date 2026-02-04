export interface ITopicCategory {
  name: string;
  description: string;
  image: string | File;
  status: string;
  order: number;
}

export interface ITopicCategoryList {
  _id: string;
  name: string;
  description: string;
  image: string;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITopicCategoryMapper {
  id: string;
  name: string;
  description: string;
  image: string;
  status: string;
  order: number;
}

export interface ITopicWordsRes {
  audio: string;
  createdAt: string;
  isActive: boolean;
  text: string;
  topic: string;
  translation: string;
  updatedAt: string;
  __v: number;
  _id: string;
  image: string;
}

export interface ITopicWord {
  audio: string;
  createdAt: string;
  isActive: boolean;
  text: string;
  topic: string;
  translation: string;
  updatedAt: string;
  id: string;
  image: string;
}

export interface IWordCreate {
  text: string;
  audio: string;
  isActive: string;
  translation: string;
  topic: string;
  image: string;
}

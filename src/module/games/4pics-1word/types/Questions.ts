export interface IQuestionsListRes {
  answer: string;
  createdAt: string;
  images: Array<string>;
  updatedAt: string;
  _id: string;
  keyboard: string[];
}

export interface IQuestionsList {
  answer: string;
  createdAt: string;
  images: Array<string>;
  updatedAt: string;
  id: string;
}

export interface IAudioSearchRes {
  createdAt: string;
  mimeType: string;
  name: string;
  size: number;
  url: string;
  __v: number;
  _id: string;
}

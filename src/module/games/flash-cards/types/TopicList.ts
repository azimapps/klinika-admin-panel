export interface ITopicListRes {
  category: string;
  createdAt: string; // Use string for date-time format
  description: string;
  difficultyLevel: 'easy' | 'medium' | 'hard'; // Use a union type for known values
  image: string;
  language: string; // Could be a specific language code, e.g., 'en', 'uz'
  status: 'active' | 'inactive' | 'pending'; // Use a union type for known values
  topic: string;
  translation: string; //  Language code
  updatedAt: string; // Use string for date-time format
  wordCount: number;
  color1: string;
  color2: string;
  topicColor: string;
  __v: number;
  _id: string;
}

export interface ITopicList {
  id: string;
  image: string;
  topic: string;
  description: string;
  level: string;
  lang: string;
  status: string;
  createdAt: string;
  category: string;
  color1: string;
  color2: string;
  topicColor: string;
}

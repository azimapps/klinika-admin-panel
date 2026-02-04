export interface IUserRes {
  activities: any[]; // you can replace 'any' with a specific type later
  authProvider: string;
  createdAt: string;
  educations: any[]; // same here
  email: string;
  experiences: any[]; // and here
  isPublic: boolean;
  lang: string;
  lastSeen: string;
  phone: string;
  ref: string;
  reference: string;
  roles: string[];
  status: 'ACTIVE' | 'INACTIVE' | string;
  updatedAt: string;
  username: string;
  __v: number;
  _id: string;
}

export enum UserRole {
  BASIC = 'BASIC',
  MENTOR = 'MENTOR',
  INSTRUCTOR = 'INSTRUCTOR',
  SUPPORT = 'SUPPORT',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  ORGANIZATION_OWNER = 'ORGANIZATION_OWNER',
  BOARD_MEMBER = 'BOARD_MEMBER',
  MANAGER = 'MANAGER',
  MIDDLE_MANAGER = 'MIDDLE_MANAGER',
}
export enum gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum ref {
  WEB = 'WEB',
  APP = 'APP',
}

export enum Reference {
  TWITTER = 'TWITTER',
  TELEGRAM = 'TELEGRAM',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  GOOGLE = 'GOOGLE',
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE',
  LINKEDIN = 'LINKEDIN',
  FRIENDS_FAMILY = 'FRIENDS_FAMILY',
  PLAY_STORE = 'PLAY_STORE',
  TV = 'TV',
  OTHERS = 'OTHERS',
}

export type UserExperience = {
  _id: string;
  title: string;
  company: string;
  link?: string;
  description?: string;
  period: {
    from: string;
    to: string;
  };
};

export interface IUserAdapter {
  fullName: string;
  id: string;
  phoneNumber: string;
  email: string;
  status: string;
  role: string[];
}

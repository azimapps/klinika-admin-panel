export interface IUserStatsListRes {
  createdAt: string;
  diamonds: number;
  gamesLost: number;
  gamesPlayed: number;
  gamesWon: number;
  highestWinStreak: number;
  stars: number;
  totalWordsPlayed: number;
  updatedAt: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    __v: number;
  };
  _id: string;
}

export interface IUserStatsList {
  fullName: string;
  wordsCount: number;
  stars: number;
  diamonds: number;
  streaksCount: number;
  gamesCount: number;
  gamesWon: number;
  gamesLost: number;
  id: string;
}

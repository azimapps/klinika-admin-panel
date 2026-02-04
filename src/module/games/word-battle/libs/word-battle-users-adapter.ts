import type { IUserStatsList, IUserStatsListRes } from '../types/UserList';

export const wordBattleUsersAdapter = (item: IUserStatsListRes): IUserStatsList => ({
  fullName: `${item.userId?.firstName} ${item.userId?.lastName}`,
  wordsCount: item.totalWordsPlayed ?? 0,
  stars: item.stars ?? 0,
  diamonds: item.diamonds ?? 0,
  streaksCount: item.highestWinStreak ?? 0,
  gamesCount: item.gamesPlayed ?? 0,
  gamesWon: item.gamesWon ?? 0,
  gamesLost: item.gamesLost ?? 0,
  id: item._id ?? '',
});

export const wordBattleUsersMapper = (data: IUserStatsListRes[]) =>
  data?.map(wordBattleUsersAdapter) || [];

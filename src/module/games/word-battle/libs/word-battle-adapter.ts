import type { IWordBattleCategory, IWordBattleCategoryRes } from '../types/GameList';

const wordBattleListAdapter = (item: IWordBattleCategoryRes): IWordBattleCategory => ({
  id: item._id ?? '',
  topic: item.topic ?? '--',
  image: item.image ?? '--',
  createdAt: item.createdAt ?? '--',
  updatedAt: item.updatedAt ?? '--',
});

export const wordBattleListMapper = (data: IWordBattleCategoryRes[]) =>
  data?.map(wordBattleListAdapter) || [];

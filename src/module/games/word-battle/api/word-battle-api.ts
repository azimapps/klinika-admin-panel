import type { IParams, IPagination } from 'src/types/params';

import axiosInstance from 'src/lib/axios';

import type { IWrodsListRes } from '../types/WordsList';
import type { IUserStatsListRes } from '../types/UserList';
import type { SettingsSchema } from '../service/SettingsScheme';
import type { IWordBattleCategoryRes } from '../types/GameList';
import type { EditCategory, CreateCategoryFormType } from '../service/FormScheme';

export const wordBattle = {
  getList: () =>
    axiosInstance
      .get<{ data: IWordBattleCategoryRes[] }>('word-battle/game/topic/all')
      .then((res) => res.data),
  deleteTopic: (id: string) =>
    axiosInstance.delete(`word-battle/game/topic/delete/${id}`).then((res) => res),
  create: (values: CreateCategoryFormType) =>
    axiosInstance.post('word-battle/game/topic/create', values).then((res) => res),
  usersList: (params: IParams) =>
    axiosInstance
      .get<{
        data: IUserStatsListRes[];
        pagination: IPagination;
      }>('word-battle/players/stats', { params })
      .then((res) => res.data),
  wordsList: (id: string) =>
    axiosInstance.get<IWrodsListRes>(`word-battle/game/topic/all/${id}`).then((res) => res.data),
  update: (value: EditCategory, id: string) =>
    axiosInstance.put(`word-battle/game/topic/update/${id}`, value).then((res) => res),
  deleteWord: (id: string, words: string[]) =>
    axiosInstance
      .delete(`word-battle/game/topic/delete/word/${id}`, {
        data: {
          wordsToDelete: words,
        },
      })
      .then((res) => res),
};

export const wbSettings = {
  update: (value: SettingsSchema) =>
    axiosInstance.put('word-battle/game/settings/update', value).then(),
  get: () => axiosInstance.get('word-battle/game/settings').then((res) => res.data),
};

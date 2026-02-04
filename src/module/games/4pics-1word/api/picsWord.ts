import type { IParams, IPaginatedResponse } from 'src/types/params';

import axiosInstance from 'src/lib/axios';

import type { IQuestionsListRes } from '../types/Questions';
import type { QuestionFormType } from '../service/questionScheme';
import type { PicsWordSettingsFormType } from '../service/settingsScheme';

export const picsWord = {
  get: (params: IParams) =>
    axiosInstance
      .get<IPaginatedResponse<IQuestionsListRes>>('pics-word/questions/all', { params })
      .then((res) => res.data),
  create: (values: QuestionFormType) =>
    axiosInstance.post('pics-word/questions/create', values).then(),
  delete: (id: string) => axiosInstance.delete(`pics-word/questions/delete/${id}`).then(),
  update: (value: QuestionFormType, id: string) =>
    axiosInstance.put(`pics-word/questions/update/${id}`, value).then(),
};

export const settings = {
  get: () =>
    axiosInstance
      .get<{
        game: PicsWordSettingsFormType;
      }>('pics-word/game/settings')
      .then((res) => res.data),
  update: (value: PicsWordSettingsFormType) =>
    axiosInstance.put('pics-word/game/settings/update', value).then(),
};

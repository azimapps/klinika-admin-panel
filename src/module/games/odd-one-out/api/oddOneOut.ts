import type { IParams, IPaginatedResponse } from 'src/types/params';

import axiosInstance from 'src/lib/axios';

import type { IOddOneOutRes } from '../types/Questions';

export const oddOneOutQuestions = {
  getAllQuestions: (params: IParams) =>
    axiosInstance
      .get<IPaginatedResponse<IOddOneOutRes>>('odd-one-out/questions/all', { params })
      .then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`odd-one-out/questions/delete/${id}`),
};

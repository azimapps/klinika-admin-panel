import type { IParams } from 'src/types/params';

import axiosInstance from 'src/lib/axios';

export const userApi = {
  getAll: (params: IParams) => axiosInstance.get('users', { params }).then((res) => res.data),
};

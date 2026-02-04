import type { IUserRes } from 'src/module/overview/users/types/IUsers';

import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token: string | null): IUserRes | null => {
  if (!token) return null;

  try {
    return jwtDecode<IUserRes>(token);
  } catch (err) {
    console.log(err);
    return null;
  }
};

import type { IUserRes, IUserAdapter } from '../types/IUsers';

export const usersAdapter = (item: IUserRes): IUserAdapter => ({
  fullName: item.username ?? '',
  id: item._id ?? '',
  phoneNumber: item.phone ?? '',
  email: item.email ?? '',
  status: item.status ?? '',
  role: item.roles ?? [],
});

export const usersMapper = (data: IUserRes[]) => data?.map(usersAdapter) || [];

// ----------------------------------------------------------------------
// HOMEMED staff user management (see docs/HOMEMED_API.md §9)
// ----------------------------------------------------------------------

export type StaffRole = 'operator' | 'senior_operator' | 'administrator';

export const STAFF_ROLES: StaffRole[] = ['operator', 'senior_operator', 'administrator'];

export interface IStaffUser {
  id: number;
  username: string;
  full_name: string;
  phone_number: string | null;
  role: StaffRole;
  is_active: boolean;
}

export interface IStaffCreate {
  username: string;
  full_name: string;
  password: string;
  role: StaffRole;
  phone_number?: string | null;
}

export interface IStaffUpdate {
  full_name?: string;
  phone_number?: string | null;
  role?: StaffRole;
}

export interface IStaffListParams {
  role?: StaffRole;
  is_active?: boolean;
}

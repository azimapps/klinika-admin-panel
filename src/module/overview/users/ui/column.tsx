import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

interface Props {
  t: TFunction;
}

export const usersColumn = ({ t }: Props): GridColDef<any>[] => [
  {
    field: 'fullName',
    headerName: t('table.name'),
    flex: 1,
  },
  {
    field: 'phoneNumber',
    headerName: t('table.phone'),
    width: 150,
    align: 'center',
  },
  {
    field: 'email',
    headerName: t('table.email'),
    flex: 1,
  },
  {
    field: 'status',
    headerName: t('table.status'),
    width: 120,
    align: 'center',
  },

  {
    field: 'role',
    headerName: t('table.role'),
    flex: 1,
  },
];

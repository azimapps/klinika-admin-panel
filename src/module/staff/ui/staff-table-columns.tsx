import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { StaffRole, IStaffUser } from '../types';

// ----------------------------------------------------------------------

const ROLE_COLOR: Record<StaffRole, 'default' | 'info' | 'warning'> = {
  operator: 'default',
  senior_operator: 'info',
  administrator: 'warning',
};

interface Props {
  t: TFunction;
  currentUserId?: number;
  onEdit: (row: IStaffUser) => void;
  onToggleBlock: (row: IStaffUser) => void;
  onResetPassword: (row: IStaffUser) => void;
}

export const staffTableColumns = ({
  t,
  currentUserId,
  onEdit,
  onToggleBlock,
  onResetPassword,
}: Props): GridColDef<IStaffUser>[] => [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'username',
    headerName: t('username'),
    flex: 1,
    minWidth: 140,
    renderCell: (params) => <strong>{params.row.username}</strong>,
  },
  {
    field: 'full_name',
    headerName: t('full_name'),
    flex: 1,
    minWidth: 160,
  },
  {
    field: 'phone_number',
    headerName: t('phone'),
    width: 150,
    renderCell: (params) => params.row.phone_number || '—',
  },
  {
    field: 'role',
    headerName: t('role'),
    width: 160,
    renderCell: (params) => (
      <Chip
        label={t(`role_${params.row.role}`)}
        color={ROLE_COLOR[params.row.role] || 'default'}
        size="small"
        variant="soft"
      />
    ),
  },
  {
    field: 'is_active',
    headerName: t('status'),
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.row.is_active ? t('active') : t('blocked')}
        color={params.row.is_active ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: t('actions'),
    width: 150,
    align: 'right',
    headerAlign: 'right',
    getActions: (params) => {
      const isSelf = params.row.id === currentUserId;
      return [
        <IconButton key="edit" onClick={() => onEdit(params.row)} title={t('edit')}>
          <Iconify icon="solar:pen-bold" />
        </IconButton>,
        <IconButton
          key="reset"
          onClick={() => onResetPassword(params.row)}
          title={t('reset_password')}
        >
          <Iconify icon={'solar:key-bold' as any} />
        </IconButton>,
        <Tooltip key="block" title={isSelf ? t('cannot_block_self') : ''}>
          <span>
            <IconButton
              onClick={() => onToggleBlock(params.row)}
              disabled={isSelf}
              color={params.row.is_active ? 'error' : 'success'}
              title={params.row.is_active ? t('block') : t('unblock')}
            >
              <Iconify
                icon={
                  (params.row.is_active
                    ? 'solar:lock-keyhole-bold'
                    : 'solar:lock-keyhole-unlocked-bold') as any
                }
              />
            </IconButton>
          </span>
        </Tooltip>,
      ];
    },
  },
];

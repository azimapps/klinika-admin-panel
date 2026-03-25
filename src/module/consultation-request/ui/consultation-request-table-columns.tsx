import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { getStatusName } from '../types';

import type { IConsultationRequest, ConsultationRequestStatusName } from '../types';

// ----------------------------------------------------------------------

const STATUS_COLOR_MAP: Record<
  ConsultationRequestStatusName,
  'warning' | 'success' | 'info' | 'error' | 'default'
> = {
  new: 'warning',
  reviewed: 'info',
  sent: 'warning',
  invoiced: 'warning',
  accepted: 'success',
  rejected: 'error',
  expired: 'default',
};

interface Props {
  t: TFunction;
  onView: (row: IConsultationRequest) => void;
}

export const consultationRequestTableColumns = ({
  t,
  onView,
}: Props): GridColDef<IConsultationRequest>[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 70,
  },
  {
    field: 'client_name',
    headerName: t('client_name'),
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'client_phone',
    headerName: t('client_phone'),
    width: 160,
  },
  {
    field: 'category_title_uz',
    headerName: t('category'),
    flex: 1,
    minWidth: 130,
  },
  {
    field: 'service_title_uz',
    headerName: t('service'),
    flex: 1,
    minWidth: 130,
  },
  {
    field: 'status',
    headerName: t('status'),
    width: 150,
    renderCell: (params) => {
      const statusName = getStatusName(params.row.status);
      return (
        <Chip
          label={t(`status_${statusName}`)}
          color={STATUS_COLOR_MAP[statusName] || 'default'}
          size="small"
          variant="outlined"
        />
      );
    },
  },
  {
    field: 'created_at',
    headerName: t('created_at'),
    width: 160,
    renderCell: (params) => fDateTime(params.row.created_at),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: t('actions'),
    width: 80,
    align: 'right',
    headerAlign: 'right',
    getActions: (params) => [
      <IconButton key="view" onClick={() => onView(params.row)} title={t('view')}>
        <Iconify icon="solar:eye-bold" />
      </IconButton>,
    ],
  },
];

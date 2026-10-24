import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { STATUS_COLOR, SERVICE_COLOR, PAYMENT_COLOR } from './ops-status';

import type { IOpsRequestListItem } from '../types';

// ----------------------------------------------------------------------

interface Props {
  t: TFunction;
  onView: (row: IOpsRequestListItem) => void;
}

export const opsRequestTableColumns = ({
  t,
  onView,
}: Props): GridColDef<IOpsRequestListItem>[] => [
  {
    field: 'request_number',
    headerName: t('col_number'),
    width: 130,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {params.row.is_overdue && (
          <Tooltip title={t('overdue')}>
            <Iconify icon={'solar:alarm-bold' as any} width={18} sx={{ color: 'error.main' }} />
          </Tooltip>
        )}
        <strong>{params.row.request_number}</strong>
      </Box>
    ),
  },
  {
    field: 'full_name',
    headerName: t('col_name'),
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'phone',
    headerName: t('col_phone'),
    width: 150,
  },
  {
    field: 'service_type',
    headerName: t('col_service'),
    width: 110,
    renderCell: (params) => (
      <Chip
        label={t(`service_${params.row.service_type}`)}
        color={SERVICE_COLOR[params.row.service_type] || 'default'}
        size="small"
        variant="soft"
      />
    ),
  },
  {
    field: 'district',
    headerName: t('col_district'),
    width: 130,
    renderCell: (params) => params.row.district || '—',
  },
  {
    field: 'status',
    headerName: t('col_status'),
    width: 140,
    renderCell: (params) => (
      <Chip
        label={t(`status_${params.row.status}`)}
        color={STATUS_COLOR[params.row.status] || 'default'}
        size="small"
        variant="soft"
      />
    ),
  },
  {
    field: 'operator',
    headerName: t('col_operator'),
    width: 130,
    renderCell: (params) => params.row.operator || '—',
  },
  {
    field: 'amount',
    headerName: t('col_amount'),
    width: 120,
    renderCell: (params) =>
      params.row.amount != null ? `${params.row.amount.toLocaleString()} ` : '—',
  },
  {
    field: 'payment_status',
    headerName: t('col_payment'),
    width: 110,
    renderCell: (params) => (
      <Chip
        label={t(`payment_${params.row.payment_status}`)}
        color={PAYMENT_COLOR[params.row.payment_status] || 'default'}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    field: 'created_at',
    headerName: t('col_created'),
    width: 150,
    renderCell: (params) => fDateTime(params.row.created_at),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: '',
    width: 60,
    align: 'right',
    headerAlign: 'right',
    getActions: (params) => [
      <IconButton key="view" onClick={() => onView(params.row)} title={t('view')}>
        <Iconify icon="solar:eye-bold" />
      </IconButton>,
    ],
  },
];

import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { IVideo } from '../types';

interface Props {
  t: TFunction;
  onEdit: (row: IVideo) => void;
  onDelete: (id: number) => void;
  onToggleActive: (row: IVideo) => void;
}

export const videoTableColumns = ({
  t,
  onEdit,
  onDelete,
  onToggleActive,
}: Props): GridColDef<IVideo>[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
  },
  {
    field: 'thumbnail',
    headerName: t('thumbnail'),
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <Avatar
        src={params.value || `https://img.youtube.com/vi/${params.row.video_id}/mqdefault.jpg`}
        variant="rounded"
        sx={{ width: 72, height: 48 }}
      />
    ),
  },
  {
    field: 'video_id',
    headerName: t('video_id'),
    width: 160,
    renderCell: (params) => (
      <Link
        href={`https://youtu.be/${params.value}`}
        target="_blank"
        rel="noopener"
        underline="hover"
      >
        {params.value}
      </Link>
    ),
  },
  {
    field: 'title_uz',
    headerName: t('title_uz'),
    flex: 1,
    minWidth: 180,
  },
  {
    field: 'subtitle_uz',
    headerName: t('subtitle_uz'),
    flex: 1,
    minWidth: 180,
  },
  {
    field: 'duration',
    headerName: t('duration'),
    width: 100,
  },
  {
    field: 'order',
    headerName: t('order'),
    width: 90,
  },
  {
    field: 'is_active',
    headerName: t('is_active'),
    width: 100,
    renderCell: (params) => (
      <Switch checked={params.value as boolean} onClick={() => onToggleActive(params.row)} />
    ),
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: t('actions'),
    width: 100,
    getActions: (params) => [
      <IconButton key="edit" onClick={() => onEdit(params.row)}>
        <Iconify icon="solar:pen-bold" />
      </IconButton>,
      <IconButton key="delete" onClick={() => onDelete(params.row.id)} sx={{ color: 'error.main' }}>
        <Iconify icon="solar:trash-bin-trash-bold" />
      </IconButton>,
    ],
  },
];

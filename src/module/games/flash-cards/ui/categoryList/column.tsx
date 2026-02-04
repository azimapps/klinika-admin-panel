import type { TFunction } from 'i18next';
import type { Theme } from '@mui/material';

import { Link } from 'react-router';

import { Typography } from '@mui/material';
import { type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import type { ITopicCategoryMapper } from '../../types/Category';

interface IProps {
  onEdit: (row: ITopicCategoryMapper) => void;
  onDelete: (id: string) => void;
  t: TFunction;
  theme: Theme;
}

export const flashCardCategoryListColumn = ({
  onEdit,
  onDelete,
  t,
  theme,
}: IProps): GridColDef<ITopicCategoryMapper>[] => [
  {
    headerName: 'Rasm',
    field: 'image',
    width: 100,
    renderCell: ({ row }) => (
      <Image
        src={row.image}
        alt={`${row.name}.image`}
        sx={{ width: '50px', height: '50px', borderRadius: '5px' }}
      />
    ),
  },
  {
    headerName: 'Nomi',
    field: 'name',
    flex: 1,
    renderCell: ({ row }) => (
      <Typography
        component={Link}
        sx={{ textDecoration: 'none' }}
        to={`${paths.dashboard.games.flashCard.root}/${row.id}/view`}
        color={theme.palette.success.dark}
        textTransform="none"
      >
        {row.name}
      </Typography>
    ),
  },
  {
    headerName: 'Matn',
    field: 'description',
    flex: 1,
  },
  {
    headerName: 'Tartib',
    field: 'order',
    width: 100,
  },
  {
    headerName: 'Holati',
    field: 'status',
    width: 100,
    renderCell: ({ row }) => (
      <Label color={row.status === 'active' ? 'success' : 'error'}>
        {row.status === 'active' ? t('enums.active') : t('enums.inactive')}
      </Label>
    ),
  },
  {
    field: 'action',
    type: 'actions',
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:pen-bold" color={theme.palette.success.dark} />}
        label={t('edit')}
        sx={{ color: theme.palette.success.dark }}
        onClick={() => onEdit(row)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:trash-bin-trash-bold" color={theme.palette.error.dark} />}
        label={t('delete')}
        sx={{ color: theme.palette.error.dark }}
        onClick={() => onDelete(row.id)}
      />,
    ],
  },
];

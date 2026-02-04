import type { TFunction } from 'i18next';
import type { Theme } from '@mui/material/styles';

import { Link } from 'react-router';

import { Typography } from '@mui/material';
import { type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fDate } from 'src/utils/format-time';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import type { IWordBattleCategory } from '../../types/GameList';

interface ICol {
  theme: Theme;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  t: TFunction;
}

export const wordBattleCol = ({
  t,
  theme,
  onDelete,
  onEdit,
}: ICol): GridColDef<IWordBattleCategory>[] => [
  {
    headerName: t('table.image'),
    flex: 1,
    field: 'image',
    renderCell: ({ row }) => (
      <Image
        src={row.image}
        alt={`${row.topic}.image`}
        sx={{ width: '50px', height: '50px', borderRadius: '5px' }}
      />
    ),
  },
  {
    headerName: t('table.topic'),
    flex: 1,
    field: 'topic',
    renderCell: ({ row }) => (
      <Typography
        component={Link}
        to={`/word-battle/${row.id}/view`}
        sx={{ textDecoration: 'none' }}
        color={theme.palette.primary.dark}
      >
        {row.topic}
      </Typography>
    ),
  },
  {
    headerName: t('table.createdAt'),
    flex: 1,
    field: 'createdAt',
    renderCell: ({ row }) => fDate(row.createdAt),
  },
  {
    headerName: t('table.updatedAt'),
    flex: 1,
    field: 'updatedAt',
    renderCell: ({ row }) => fDate(row.updatedAt),
  },
  {
    headerName: '',
    field: 'actions',
    type: 'actions',
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:pen-bold" color={theme.palette.success.dark} />}
        label={t('table.edit')}
        sx={{ color: theme.palette.success.dark }}
        onClick={() => onEdit(row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:trash-bin-trash-bold" color={theme.palette.error.dark} />}
        label={t('table.delete')}
        sx={{ color: theme.palette.error.dark }}
        onClick={() => onDelete(row.id)}
      />,
    ],
  },
];

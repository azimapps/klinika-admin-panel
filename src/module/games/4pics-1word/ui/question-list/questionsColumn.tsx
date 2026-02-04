import type { TFunction } from 'i18next';
import type { Theme } from '@mui/material';

import { Box } from '@mui/material';
import { type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fDate } from 'src/utils/format-time';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import type { IQuestionsList } from '../../types/Questions';

interface Props {
  theme: Theme;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  t: TFunction;
}

export const questionListColumn = ({
  onDelete,
  onEdit,
  theme,
  t,
}: Props): GridColDef<IQuestionsList>[] => [
  {
    headerName: t('table.images'),
    field: 'images',
    flex: 1,
    renderCell: ({ row }) => (
      <Box display="flex" gap={1}>
        {row.images.map((img) => (
          <Image
            src={img}
            alt={`${row.answer}.image`}
            sx={{ width: '50px', height: '50px', borderRadius: '5px' }}
          />
        ))}
      </Box>
    ),
  },
  {
    headerName: t('table.answer'),
    field: 'answer',
    flex: 1,
  },
  {
    headerName: t('table.createdAt'),
    field: 'createdAt',
    flex: 1,
    renderCell: ({ row }) => fDate(row.createdAt),
  },
  {
    headerName: t('table.updatedAt'),
    field: 'updatedAt',
    flex: 1,
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
        label={t('edit')}
        sx={{ color: theme.palette.success.dark }}
        onClick={() => onEdit(row.id)}
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

import { type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { fDate } from 'src/utils/format-time';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { QuestionsTypeLabels } from '../../service/label';

import type { IOddOneOut } from '../../types/Questions';
import type { QuestionsType } from '../../service/label';

interface Props {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const oddOneOutColumn = ({ onDelete, onEdit }: Props): GridColDef<IOddOneOut>[] => [
  {
    headerName: 'Javobi',
    field: 'answer',
    flex: 1,
    renderCell: ({ row }) => (
      <Image
        src={row.answer}
        alt={`${row.answer}.image`}
        sx={{ width: '50px', height: '50px', borderRadius: '5px' }}
      />
    ),
  },
  {
    headerName: 'Rasmlar',
    field: 'images',
    flex: 1,
    renderCell: ({ row }) =>
      row.images.map((url) => (
        <Image
          src={url}
          alt={`${url}.image`}
          sx={{ width: '50px', height: '50px', borderRadius: '5px' }}
        />
      )),
  },
  {
    headerName: 'Turi',
    field: 'type',
    flex: 1,
    renderCell: ({ row }) => QuestionsTypeLabels[row.type as QuestionsType],
  },
  {
    headerName: 'Yaratilgan sana',
    field: 'createdAt',
    flex: 1,
    renderCell: ({ row }) => fDate(row.createdAt),
  },
  {
    headerName: 'Yangilangan sana',
    field: 'updatedAt',
    flex: 1,
    renderCell: ({ row }) => fDate(row.updatedAt),
  },
  {
    field: 'action',
    type: 'actions',
    getActions: ({ row }) => [
      <GridActionsCellItem
        label="Taxrirlash"
        icon={<Iconify icon="solar:pen-bold" />}
        showInMenu
        onClick={() => onEdit(row.id)}
        sx={{
          color: (theme) => theme.palette.success.dark,
        }}
      />,
      <GridActionsCellItem
        label="O'chirish"
        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        showInMenu
        onClick={() => onDelete(row.id)}
        sx={{
          color: (theme) => theme.palette.error.dark,
        }}
      />,
    ],
  },
];

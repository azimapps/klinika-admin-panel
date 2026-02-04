import type { TFunction } from 'i18next';
import type { Theme } from '@mui/material/styles';

import { Link } from 'react-router';

import { Typography } from '@mui/material';
import { type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { LevelLabelsColors, StatusLabelsColors } from '../../service/enums';

import type { ITopicList } from '../../types/TopicList';
import type { level, Status, Language } from '../../service/enums';

interface IProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  theme: Theme;
  t: TFunction;
  levelLabels: Record<level, string>;
  statusLabels: Record<Status, string>;
  langLabels: Record<Language, string>;
}

export const flashCardTopicListColumn = ({
  onEdit,
  onDelete,
  theme,
  t,
  levelLabels,
  statusLabels,
  langLabels,
}: IProps): GridColDef<ITopicList>[] => [
  {
    headerName: t('table.image'),
    field: 'image',
    flex: 1,
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
    field: 'topic',
    flex: 1,
    renderCell: ({ row }) => (
      <Typography
        component={Link}
        sx={{ textDecoration: 'none' }}
        to={`${paths.dashboard.games.flashCard.root}/${row.id}/view`}
        color={theme.palette.success.dark}
        textTransform="none"
      >
        {row.topic}
      </Typography>
    ),
  },
  {
    headerName: t('table.level'),
    field: 'level',
    flex: 1,
    renderCell: ({ row }) => (
      <Label color={LevelLabelsColors[row.level as level]}>{levelLabels[row.level as level]}</Label>
    ),
  },
  {
    headerName: t('table.lang'),
    field: 'lang',
    flex: 1,
    renderCell: ({ row }) => langLabels[row.lang as Language],
  },
  {
    headerName: t('table.status'),
    field: 'status',
    flex: 1,
    renderCell: ({ row }) => (
      <Label color={StatusLabelsColors[row.status as Status]}>
        {statusLabels[row.status as Status]}
      </Label>
    ),
  },
  {
    headerName: 'Rang 1',
    field: 'color1',
    flex: 1,
    renderCell: ({ row }) => row.color1,
  },
  {
    headerName: 'Rang 2',
    field: 'color2',
    flex: 1,
    renderCell: ({ row }) => row.color2,
  },
  {
    headerName: 'Topik rangi',
    field: 'topicColor',
    flex: 1,
    renderCell: ({ row }) => row.topicColor,
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

import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { IService } from '../types';

// ----------------------------------------------------------------------

interface Props {
    t: TFunction;
    onEdit: (row: IService) => void;
    onDelete: (id: number) => void;
}

export const serviceTableColumns = ({ t, onEdit, onDelete }: Props): GridColDef<IService>[] => [
    {
        field: 'image',
        headerName: 'Rasm',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <Avatar
                alt={params.row.title_uz}
                src={params.row.image || ''}
                sx={{ width: 40, height: 40, border: (theme) => `solid 2px ${theme.palette.background.neutral}` }}
            />
        ),
    },
    {
        field: 'title_uz',
        headerName: 'Nomi (UZ)',
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'price',
        headerName: 'Narxi',
        width: 120,
        type: 'number',
    },
    {
        type: 'actions',
        field: 'actions',
        headerName: 'Amallar',
        width: 100,
        align: 'right',
        headerAlign: 'right',
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

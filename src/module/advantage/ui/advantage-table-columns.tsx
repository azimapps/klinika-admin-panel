import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
    t: TFunction;
    onEdit: (row: any) => void;
    onDelete: (id: number) => void;
}

export const advantageTableColumns = ({ t, onEdit, onDelete }: Props): GridColDef<any>[] => [
    {
        field: 'image',
        headerName: t('table.image'),
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <Avatar
                alt={params.row.title_uz}
                src={params.row.image}
                variant="rounded"
                sx={{ width: 40, height: 40, border: (theme) => `solid 2px ${theme.palette.background.neutral}` }}
            />
        ),
    },
    {
        field: 'title_uz',
        headerName: t('table.title_uz'),
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'description_uz',
        headerName: t('table.description_uz'),
        flex: 2,
        minWidth: 300,
    },
    {
        type: 'actions',
        field: 'actions',
        headerName: t('table.actions'),
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

import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
    t: TFunction;
    onEdit: (row: any) => void;
    onDelete: (id: number) => void;
}

export const founderTableColumns = ({ t, onEdit, onDelete }: Props): GridColDef<any>[] => [
    {
        field: 'avatar',
        headerName: t('table.avatar'),
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <Avatar
                alt={params.row.name_uz}
                src={params.row.avatar}
            />
        ),
    },
    {
        field: 'name_uz',
        headerName: t('table.name_uz'),
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'position_uz',
        headerName: t('table.position_uz'),
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'linked_url',
        headerName: t('table.linked_url'),
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
            params.row.linked_url ?
                <Link href={params.row.linked_url} target="_blank" rel="noopener">
                    {params.row.linked_url}
                </Link> : '-'
        ),
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

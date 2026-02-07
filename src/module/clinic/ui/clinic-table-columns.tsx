import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { IClinic } from '../types';

// ----------------------------------------------------------------------

interface Props {
    t: TFunction;
    onEdit: (row: IClinic) => void;
    onDelete: (id: number) => void;
}

export const clinicTableColumns = ({ t, onEdit, onDelete }: Props): GridColDef<IClinic>[] => [
    {
        field: 'title_uz',
        headerName: t('title_uz'),
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'address_uz',
        headerName: t('address_uz'),
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'lat',
        headerName: t('lat'),
        width: 120,
        type: 'number',
    },
    {
        field: 'lon',
        headerName: t('lon'),
        width: 120,
        type: 'number',
    },
    {
        type: 'actions',
        field: 'actions',
        headerName: t('actions'),
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

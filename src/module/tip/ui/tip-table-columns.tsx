import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { ITip } from '../types';

interface Props {
    t: TFunction;
    onEdit: (row: ITip) => void;
    onDelete: (id: number) => void;
    onToggleActive: (row: ITip) => void;
}

export const tipTableColumns = ({ t, onEdit, onDelete, onToggleActive }: Props): GridColDef<ITip>[] => [
    {
        field: 'id',
        headerName: 'ID',
        width: 80,
    },
    {
        field: 'image',
        headerName: t('image'),
        width: 80,
        renderCell: (params) => (
            <Avatar src={params.value} variant="rounded" sx={{ width: 48, height: 48 }} />
        ),
    },
    {
        field: 'title_uz',
        headerName: t('title_uz'),
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'description_uz',
        headerName: t('description_uz'),
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'order',
        headerName: t('order'),
        width: 100,
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

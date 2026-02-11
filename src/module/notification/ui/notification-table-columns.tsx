import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import type { INotification } from '../types';

// ----------------------------------------------------------------------

interface Props {
    t: TFunction;
    onDelete: (id: number) => void;
}

export const notificationTableColumns = ({ t, onDelete }: Props): GridColDef<INotification>[] => [
    {
        field: 'id',
        headerName: 'ID',
        width: 80,
    },
    {
        field: 'title_uz',
        headerName: t('title_uz'),
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'body_uz',
        headerName: t('body_uz'),
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'sent_to',
        headerName: t('sent_to'),
        width: 150,
    },
    {
        field: 'created_at',
        headerName: t('created_at'),
        width: 180,
        renderCell: (params) => fDateTime(params.value),
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: t('actions'),
        width: 100,
        getActions: (params) => [
            <IconButton key="delete" onClick={() => onDelete(params.row.id)} sx={{ color: 'error.main' }}>
                <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>,
        ],
    },
];


import type { GridColDef } from '@mui/x-data-grid';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar, ListItemText } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import type { IClient } from '../types';

// ----------------------------------------------------------------------

export function useClientTableColumns() {
    const { t } = useTranslation('client');

    return useMemo<GridColDef<IClient>[]>(
        () => [
            {
                field: 'first_name',
                headerName: t('first_name'),
                flex: 1,
                minWidth: 150,
                renderCell: (params) => (
                    <ListItemText
                        primary={`${params.row.first_name} ${params.row.last_name}`}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                    />
                ),
            },
            {
                field: 'avatar',
                headerName: 'Avatar',
                width: 64,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <Avatar src={params.row.avatar || ''} sx={{ width: 36, height: 36 }}>
                        {params.row.first_name?.charAt(0)}
                    </Avatar>
                ),
            },
            {
                field: 'phone_number',
                headerName: t('phone'),
                flex: 1,
                minWidth: 150,
            },
            {
                field: 'birth_date',
                headerName: t('birth_date'),
                width: 120,
                renderCell: (params) => fDate(params.row.birth_date),
            },
            {
                field: 'gender',
                headerName: t('gender'),
                width: 100,
                renderCell: (params) => t(params.row.gender),
            },
        ],
        [t]
    );
}

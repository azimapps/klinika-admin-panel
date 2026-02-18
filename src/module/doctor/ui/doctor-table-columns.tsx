import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
    t: TFunction;
    currentLang: string;
    onEdit: (row: any) => void;
    onDelete: (id: number) => void;
}

export const doctorTableColumns = ({ t, currentLang, onEdit, onDelete }: Props): GridColDef<any>[] => [
    {
        field: 'avatar',
        headerName: t('table.avatar'),
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <Avatar
                alt={params.row[`fullname_${currentLang}`] || params.row.fullname_uz}
                src={params.row.avatar}
                sx={{ width: 40, height: 40, border: (theme) => `solid 2px ${theme.palette.background.neutral}` }}
            />
        ),
    },
    {
        field: 'fullname',
        headerName: t('table.fullname_uz'),
        flex: 1,
        minWidth: 150,
        valueGetter: (value: any, row: any) => row[`fullname_${currentLang}`] || row.fullname_uz,
    },
    {
        field: 'phone_number',
        headerName: t('table.phone_number'),
        width: 150,
    },
    {
        field: 'category',
        headerName: t('table.category'),
        width: 150,
        valueGetter: (value: any, row: any) => row.category?.[`title_${currentLang}`] || row.category?.title_uz || '-',
    },
    {
        field: 'clinic',
        headerName: t('table.clinic'),
        width: 150,
        valueGetter: (value: any, row: any) => row.clinic?.[`title_${currentLang}`] || row.clinic?.title_uz || '-',
    },
    {
        field: 'price',
        headerName: t('table.price'),
        width: 120,
        type: 'number',
    },
    {
        field: 'experience',
        headerName: t('table.experience'),
        width: 100,
        type: 'number',
    },
    {
        field: 'rating',
        headerName: t('table.rating'),
        width: 100,
        type: 'number',
    },
    {
        field: 'is_active',
        headerName: t('table.status'),
        width: 100,
        renderCell: (params) => (
            <Label color={params.value ? 'success' : 'error'}>
                {params.value ? 'Active' : 'Inactive'}
            </Label>
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


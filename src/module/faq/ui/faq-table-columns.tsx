import type { TFunction } from 'i18next';
import type { GridColDef } from '@mui/x-data-grid';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { IFAQ } from '../types';

// ----------------------------------------------------------------------

interface Props {
    t: TFunction;
    onEdit: (row: IFAQ) => void;
    onDelete: (id: number) => void;
}

export const faqTableColumns = ({ t, onEdit, onDelete }: Props): GridColDef<IFAQ>[] => [
    {
        field: 'question_uz',
        headerName: t('question_uz'),
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'answer_uz',
        headerName: t('answer_uz'),
        flex: 1,
        minWidth: 200,
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

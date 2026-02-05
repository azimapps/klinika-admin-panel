import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { FounderFormDialog } from './founder-form-dialog';
import { useGetFounders, useDeleteFounder } from '../hooks';
import { founderTableColumns } from './founder-table-columns';

import type { IFounder } from '../types';

// ----------------------------------------------------------------------

export function FounderListView() {
    const { t } = useTranslate('founder');

    const { data: founders = [], isLoading } = useGetFounders();
    const { mutateAsync: deleteFounder } = useDeleteFounder();

    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IFounder | undefined>(undefined);

    const handleOpenForm = useCallback((row?: IFounder) => {
        setSelectedRow(row);
        setOpenForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setSelectedRow(undefined);
        setOpenForm(false);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm(t('confirmDelete') || "Haqiqatan ham o'chirmoqchimisiz?")) {
            try {
                await deleteFounder(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteFounder, t]);

    const columns = founderTableColumns({
        t,
        onEdit: handleOpenForm,
        onDelete: handleDelete,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={`${t('founders')} ${t('list')}`}
                links={[
                    { name: t('main'), href: paths.dashboard.root },
                    { name: t('founders') },
                    { name: t('list') },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={() => handleOpenForm()}
                    >
                        {t('add')}
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <Box sx={{ position: 'relative' }}>
                    <DataGridCustom<IFounder>
                        data={founders}
                        column={columns}
                        loading={isLoading}
                        rowCount={founders.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <FounderFormDialog
                open={openForm}
                onClose={handleCloseForm}
                currentRow={selectedRow}
            />
        </DashboardContent>
    );
}

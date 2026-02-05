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

import { AdvantageFormDialog } from './advantage-form-dialog';
import { useGetAdvantages, useDeleteAdvantage } from '../hooks';
import { advantageTableColumns } from './advantage-table-columns';

import type { IAdvantage } from '../types';

// ----------------------------------------------------------------------

export function AdvantageListView() {
    const { t } = useTranslate('advantage');

    // Public list uses Public GET endpoint.
    // Using hooks/index.ts which points to /advantages (public) or /admin/advantages (admin)? 
    // I setup hooks to use: list: '/advantages' (public)
    const { data: advantages = [], isLoading } = useGetAdvantages();
    const { mutateAsync: deleteAdvantage } = useDeleteAdvantage();

    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IAdvantage | undefined>(undefined);

    const handleOpenForm = useCallback((row?: IAdvantage) => {
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
                await deleteAdvantage(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteAdvantage, t]);

    const columns = advantageTableColumns({
        t,
        onEdit: handleOpenForm,
        onDelete: handleDelete,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={`${t('advantages')} ${t('list')}`}
                links={[
                    { name: t('main'), href: paths.dashboard.root },
                    { name: t('advantages') },
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
                    <DataGridCustom<IAdvantage>
                        data={advantages}
                        column={columns}
                        loading={isLoading}
                        rowCount={advantages.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <AdvantageFormDialog
                open={openForm}
                onClose={handleCloseForm}
                currentRow={selectedRow}
            />
        </DashboardContent>
    );
}

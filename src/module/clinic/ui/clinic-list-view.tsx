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

import { ClinicFormDialog } from './clinic-form-dialog';
import { useGetClinics, useDeleteClinic } from '../hooks';
import { clinicTableColumns } from './clinic-table-columns';

import type { IClinic } from '../types';

// ----------------------------------------------------------------------

export function ClinicListView() {
    const { t } = useTranslate('clinic');
    const { data: clinics = [], isLoading } = useGetClinics();
    const { mutateAsync: deleteClinic } = useDeleteClinic();

    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IClinic | undefined>(undefined);

    const handleOpenForm = useCallback((row?: IClinic) => {
        setSelectedRow(row);
        setOpenForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setSelectedRow(undefined);
        setOpenForm(false);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm(t('confirmDelete'))) {
            try {
                await deleteClinic(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteClinic, t]);

    const columns = clinicTableColumns({
        t,
        onEdit: handleOpenForm,
        onDelete: handleDelete,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={t('list_title')}
                links={[
                    { name: t('main'), href: paths.dashboard.root },
                    { name: t('clinics') },
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
                    <DataGridCustom<IClinic>
                        data={clinics}
                        column={columns}
                        loading={isLoading}
                        rowCount={clinics.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <ClinicFormDialog
                open={openForm}
                onClose={handleCloseForm}
                currentRow={selectedRow}
            />
        </DashboardContent>
    );
}

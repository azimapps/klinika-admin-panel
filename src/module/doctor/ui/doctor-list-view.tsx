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

import { DoctorFormDialog } from './doctor-form-dialog';
import { useGetDoctors, useDeleteDoctor } from '../hooks';
import { doctorTableColumns } from './doctor-table-columns';

import type { IDoctor } from '../types';

// ----------------------------------------------------------------------

export function DoctorListView() {
    const { t } = useTranslate('doctor');
    const { data: doctors = [], isLoading } = useGetDoctors();
    const { mutateAsync: deleteDoctor } = useDeleteDoctor();

    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IDoctor | undefined>(undefined);

    const handleOpenForm = useCallback((row?: IDoctor) => {
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
                await deleteDoctor(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteDoctor, t]);

    const columns = doctorTableColumns({
        t,
        onEdit: handleOpenForm,
        onDelete: handleDelete,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={`${t('doctors')} ${t('list')}`}
                links={[
                    { name: t('main'), href: paths.dashboard.root },
                    { name: t('doctors') },
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
                    <DataGridCustom<IDoctor>
                        data={doctors}
                        column={columns}
                        loading={isLoading}
                        rowCount={doctors.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <DoctorFormDialog
                open={openForm}
                onClose={handleCloseForm}
                currentRow={selectedRow}
            />
        </DashboardContent>
    );
}

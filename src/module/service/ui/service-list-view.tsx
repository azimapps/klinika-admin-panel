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

import { ServiceFormDialog } from './service-form-dialog';
import { useGetServices, useDeleteService } from '../hooks';
import { serviceTableColumns } from './service-table-columns';

import type { IService } from '../types';

// ----------------------------------------------------------------------

export function ServiceListView() {
    const { t } = useTranslate('service');
    const { data: services = [], isLoading } = useGetServices();
    const { mutateAsync: deleteService } = useDeleteService();

    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IService | undefined>(undefined);

    const handleOpenForm = useCallback((row?: IService) => {
        setSelectedRow(row);
        setOpenForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setSelectedRow(undefined);
        setOpenForm(false);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
            try {
                await deleteService(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteService]);

    const columns = serviceTableColumns({
        t,
        onEdit: handleOpenForm,
        onDelete: handleDelete,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Xizmatlar ro'yxati"
                links={[
                    { name: 'Bosh sahifa', href: paths.dashboard.root },
                    { name: 'Xizmatlar' },
                    { name: "Ro'yxat" },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={() => handleOpenForm()}
                    >
                        Yangi xizmat
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <Box sx={{ position: 'relative' }}>
                    <DataGridCustom<IService>
                        data={services}
                        column={columns}
                        loading={isLoading}
                        rowCount={services.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <ServiceFormDialog
                open={openForm}
                onClose={handleCloseForm}
                currentRow={selectedRow}
            />
        </DashboardContent>
    );
}

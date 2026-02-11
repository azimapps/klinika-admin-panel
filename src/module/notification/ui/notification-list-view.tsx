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

import { NotificationFormDialog } from './notification-form-dialog';
import { useGetNotifications, useDeleteNotification } from '../hooks';
import { notificationTableColumns } from './notification-table-columns';

import type { INotification } from '../types';

// ----------------------------------------------------------------------

export function NotificationListView() {
    const { t } = useTranslate('notification');
    const { data: notifications = [], isLoading } = useGetNotifications();
    const { mutateAsync: deleteNotification } = useDeleteNotification();

    const [openForm, setOpenForm] = useState(false);

    const handleOpenForm = useCallback(() => {
        setOpenForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setOpenForm(false);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deleteNotification(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteNotification, t]);

    const columns = notificationTableColumns({
        t,
        onDelete: handleDelete,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={t('list_title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('list_title') },
                    { name: t('list') },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={handleOpenForm}
                    >
                        {t('add')}
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <Box sx={{ position: 'relative' }}>
                    <DataGridCustom<INotification>
                        data={notifications}
                        column={columns}
                        loading={isLoading}
                        rowCount={notifications.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <NotificationFormDialog
                open={openForm}
                onClose={handleCloseForm}
            />
        </DashboardContent>
    );
}

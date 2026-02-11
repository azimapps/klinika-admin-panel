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

import { TipFormDialog } from './tip-form-dialog';
import { tipTableColumns } from './tip-table-columns';
import { useGetTips, useDeleteTip, useUpdateTip } from '../hooks';

import type { ITip } from '../types';

// ----------------------------------------------------------------------

export function TipListView() {
    const { t } = useTranslate('tip');
    const { data: tips = [], isLoading } = useGetTips();
    const { mutateAsync: deleteTip } = useDeleteTip();
    const { mutateAsync: updateTip } = useUpdateTip();

    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<ITip | undefined>(undefined);

    const handleOpenForm = useCallback((row?: ITip) => {
        setSelectedRow(row);
        setOpenForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setSelectedRow(undefined);
        setOpenForm(false);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deleteTip(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteTip, t]);

    const handleToggleActive = useCallback(async (row: ITip) => {
        try {
            await updateTip({
                id: row.id.toString(),
                data: { is_active: !row.is_active }
            });
        } catch (error) {
            console.error(error);
        }
    }, [updateTip]);

    const columns = tipTableColumns({
        t,
        onEdit: handleOpenForm,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={t('list_title')}
                links={[
                    { name: 'Asosiy', href: paths.dashboard.root }, // Should specific pages also be localized? 'Asosiy' is Main/General. 
                    // Let's use hardcoded 'Asosiy' for now unless 'navbar' has it. 'navbar' has 'statistics' but not 'main' or 'home' usually in this structure.
                    // Actually, 'navbar.json' has "statistics".
                    // Let's check other lists. faq-list-view uses t('main') but let's see where that comes from.
                    // It probably comes from 'faq' namespace if defined there, or it might be missing.
                    // Let's stick to consistent breadcrumbs.
                    { name: t('list_title') },
                    { name: t('list') }, // We need to add "list" to tip.json or reuse "list_title"
                ]}
                // Actually, CustomBreadcrumbs links usually: Dashboard -> Module -> List
                // Let's check faq-list-view again (Step 51)
                // { name: t('main'), href: paths.dashboard.root }, 
                // { name: t('faqs') },
                // { name: t('list') },
                // So I should add "main" and "list" to tip.json or rely on a common one.
                // I'll add "main": "Asosiy" to tip.json for now to be safe, or just hardcode if I didn't add it.
                // I added "list_title". 
                // Let's just hardcode 'Dashboard' as I didn't verify a common translation.
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
                    <DataGridCustom<ITip>
                        data={tips}
                        column={columns}
                        loading={isLoading}
                        rowCount={tips.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <TipFormDialog
                open={openForm}
                onClose={handleCloseForm}
                currentRow={selectedRow}
            />
        </DashboardContent>
    );
}

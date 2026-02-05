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

import { CategoryFormDialog } from './category-form-dialog';
import { useGetCategories, useDeleteCategory } from '../hooks';
import { categoryTableColumns } from './category-table-columns';

import type { ICategory } from '../types';

// ----------------------------------------------------------------------

export function CategoryListView() {
    const { t } = useTranslate('category');
    const { data: categories = [], isLoading } = useGetCategories();
    const { mutateAsync: deleteCategory } = useDeleteCategory();

    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<ICategory | undefined>(undefined);

    const handleOpenForm = useCallback((row?: ICategory) => {
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
                await deleteCategory(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteCategory, t]);

    const columns = categoryTableColumns({
        t,
        onEdit: handleOpenForm,
        onDelete: handleDelete,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={`${t('categories')} ${t('list')}`}
                links={[
                    { name: t('main'), href: paths.dashboard.root },
                    { name: t('categories') },
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
                    <DataGridCustom<ICategory>
                        data={categories}
                        column={columns}
                        loading={isLoading}
                        rowCount={categories.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <CategoryFormDialog
                open={openForm}
                onClose={handleCloseForm}
                currentRow={selectedRow}
            />
        </DashboardContent>
    );
}

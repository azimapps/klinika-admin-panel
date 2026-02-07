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

import { FAQFormDialog } from './faq-form-dialog';
import { useGetFAQs, useDeleteFAQ } from '../hooks';
import { faqTableColumns } from './faq-table-columns';

import type { IFAQ } from '../types';

// ----------------------------------------------------------------------

export function FAQListView() {
    const { t } = useTranslate('faq');
    const { data: faqs = [], isLoading } = useGetFAQs();
    const { mutateAsync: deleteFAQ } = useDeleteFAQ();

    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IFAQ | undefined>(undefined);

    const handleOpenForm = useCallback((row?: IFAQ) => {
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
                await deleteFAQ(id);
            } catch (error) {
                console.error(error);
            }
        }
    }, [deleteFAQ, t]);

    const columns = faqTableColumns({
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
                    { name: t('faqs') },
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
                    <DataGridCustom<IFAQ>
                        data={faqs}
                        column={columns}
                        loading={isLoading}
                        rowCount={faqs.length}
                        quickToolbar={false}
                    />
                </Box>
            </Card>

            <FAQFormDialog
                open={openForm}
                onClose={handleCloseForm}
                currentRow={selectedRow}
            />
        </DashboardContent>
    );
}

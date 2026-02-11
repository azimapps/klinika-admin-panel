
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { useGetClients } from '../hooks';
import { useClientTableColumns } from './client-table-columns';

import type { IClient } from '../types';

// ----------------------------------------------------------------------

export function ClientListView() {
    const { t } = useTranslate('client');

    const [params, setParams] = useState({
        page: 1,
        per_page: 20,
        search: '',
    });

    const { data, isLoading } = useGetClients({
        page: params.page,
        per_page: params.per_page,
        search: params.search || undefined,
    });

    const columns = useClientTableColumns();

    const handleSearchChange = useCallback((value: string) => {
        setParams((prev) => ({ ...prev, search: value, page: 1 }));
    }, []);

    const handlePaginationChange = useCallback((model: { page: number; pageSize: number }) => {
        setParams((prev) => ({ ...prev, page: model.page + 1, per_page: model.pageSize }));
    }, []);

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={t('list')}
                links={[
                    { name: t('main'), href: paths.dashboard.root },
                    { name: t('client'), href: paths.dashboard.client.root },
                    { name: t('list') },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <Box sx={{ position: 'relative' }}>
                    <DataGridCustom<IClient>
                        data={data?.items || []}
                        column={columns}
                        loading={isLoading}
                        rowCount={data?.total || 0}
                        quickToolbar={false}
                        search={params.search}
                        onSearchChange={handleSearchChange}
                        paginationMode="server"
                        paginationModel={{ page: params.page - 1, pageSize: params.per_page }}
                        onPaginationModelChange={handlePaginationChange}
                    />
                </Box>
            </Card>
        </DashboardContent>
    );
}

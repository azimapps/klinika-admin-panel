import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomTabs } from 'src/components/custom-tabs';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import {
    useGetConsultationRequests,
    useUpdateConsultationRequestStatus,
    useSendInvoice,
} from '../hooks';
import { consultationRequestTableColumns } from './consultation-request-table-columns';
import { ConsultationRequestDetailDialog } from './consultation-request-detail-dialog';

import type { IConsultationRequest } from '../types';

// ----------------------------------------------------------------------

const STATUS_TABS = [
    { value: -3, label: 'all' },
    { value: 0, label: 'new' },
    { value: 1, label: 'reviewed' },
    { value: 2, label: 'sent' },
    { value: 3, label: 'accepted' },
    { value: -2, label: 'expired' },
    { value: -1, label: 'rejected' },
];

export function ConsultationRequestListView() {
    const { t } = useTranslate('consultation-request');

    const [statusFilter, setStatusFilter] = useState(-3);
    const [params, setParams] = useState({
        page: 1,
        per_page: 20,
    });

    const queryParams = {
        ...params,
        ...(statusFilter !== -3 && { status: statusFilter }),
    };

    const { data, isLoading } = useGetConsultationRequests(queryParams);
    const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateConsultationRequestStatus();
    const { mutateAsync: sendInvoice, isPending: isSendingInvoice } = useSendInvoice();

    const [selectedRequest, setSelectedRequest] = useState<IConsultationRequest | undefined>(undefined);
    const [openDetail, setOpenDetail] = useState(false);

    const handleView = useCallback((row: IConsultationRequest) => {
        setSelectedRequest(row);
        setOpenDetail(true);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setSelectedRequest(undefined);
        setOpenDetail(false);
    }, []);

    const handleStatusChange = useCallback(
        async (id: number, status: number) => {
            try {
                await updateStatus({ id, status });
                handleCloseDetail();
            } catch (error) {
                console.error(error);
            }
        },
        [updateStatus, handleCloseDetail]
    );

    const handleSendInvoice = useCallback(
        async (id: number, amount: number) => {
            try {
                await sendInvoice({ id, amount });
                handleCloseDetail();
            } catch (error) {
                console.error(error);
            }
        },
        [sendInvoice, handleCloseDetail]
    );

    const handleTabChange = useCallback((_: any, newValue: number) => {
        setStatusFilter(newValue);
        setParams((prev) => ({ ...prev, page: 1 }));
    }, []);

    const handlePaginationChange = useCallback((model: { page: number; pageSize: number }) => {
        setParams((prev) => ({ ...prev, page: model.page + 1, per_page: model.pageSize }));
    }, []);

    const columns = consultationRequestTableColumns({
        t,
        onView: handleView,
    });

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={t('list_title')}
                links={[
                    { name: t('main'), href: paths.dashboard.root },
                    { name: t('consultation_requests') },
                    { name: t('list') },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <CustomTabs
                    value={statusFilter}
                    onChange={handleTabChange}
                    sx={{ px: 2.5, pt: 1 }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {STATUS_TABS.map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={t(`tab_${tab.label}`)} />
                    ))}
                </CustomTabs>

                <Box sx={{ position: 'relative' }}>
                    <DataGridCustom<IConsultationRequest>
                        data={data?.items || []}
                        column={columns}
                        loading={isLoading}
                        rowCount={data?.total || 0}
                        quickToolbar={false}
                        paginationMode="server"
                        paginationModel={{ page: params.page - 1, pageSize: params.per_page }}
                        onPaginationModelChange={handlePaginationChange}
                    />
                </Box>
            </Card>

            <ConsultationRequestDetailDialog
                open={openDetail}
                onClose={handleCloseDetail}
                request={selectedRequest}
                onStatusChange={handleStatusChange}
                onSendInvoice={handleSendInvoice}
                isUpdating={isUpdating}
                isSendingInvoice={isSendingInvoice}
            />
        </DashboardContent>
    );
}

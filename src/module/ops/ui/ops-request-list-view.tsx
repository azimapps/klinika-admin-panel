import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { SERVICE_TYPES } from './ops-status';
import { OpsRequestDetailDialog } from './ops-request-detail-dialog';
import { OpsRequestCreateDialog } from './ops-request-create-dialog';
import { opsRequestTableColumns } from './ops-request-table-columns';
import { useGetDistricts, useGetOpsRequests, useGetOpsNewCount } from '../hooks';

import type { ServiceType, RequestStatus, IOpsListParams, IOpsRequestListItem } from '../types';

// ----------------------------------------------------------------------

const STATUS_TABS: Array<{ value: RequestStatus | 'all'; label: string }> = [
  { value: 'all', label: 'all' },
  { value: 'new', label: 'new' },
  { value: 'in_progress', label: 'in_progress' },
  { value: 'confirmed', label: 'confirmed' },
  { value: 'assigned', label: 'assigned' },
  { value: 'on_the_way', label: 'on_the_way' },
  { value: 'completed', label: 'completed' },
  { value: 'paid', label: 'paid' },
  { value: 'cancelled', label: 'cancelled' },
];

const DEFAULT_LIMIT = 20;

export function OpsRequestListView() {
  const { t } = useTranslate('ops');

  const [statusTab, setStatusTab] = useState<RequestStatus | 'all'>('all');
  const [service, setService] = useState<ServiceType | 'all'>('all');
  const [districtId, setDistrictId] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  const [openCreate, setOpenCreate] = useState(false);
  const [detailId, setDetailId] = useState<number | undefined>(undefined);
  const [openDetail, setOpenDetail] = useState(false);

  const { data: districts = [] } = useGetDistricts();
  const { data: newCount } = useGetOpsNewCount();

  const params: IOpsListParams = {
    limit,
    offset,
    ...(statusTab !== 'all' && { status: statusTab }),
    ...(service !== 'all' && { service }),
    ...(districtId !== 'all' && { district_id: districtId }),
    ...(search.trim() && { search: search.trim() }),
  };

  const { data, isLoading } = useGetOpsRequests(params);

  const handleView = useCallback((row: IOpsRequestListItem) => {
    setDetailId(row.id);
    setOpenDetail(true);
  }, []);

  const handleTabChange = useCallback((_: React.SyntheticEvent, value: RequestStatus | 'all') => {
    setStatusTab(value);
    setOffset(0);
  }, []);

  const handlePaginationChange = useCallback((model: { page: number; pageSize: number }) => {
    setLimit(model.pageSize);
    setOffset(model.page * model.pageSize);
  }, []);

  const columns = opsRequestTableColumns({ t, onView: handleView });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('list_title')}
        links={[{ name: t('main'), href: paths.dashboard.root }, { name: t('requests') }]}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!!newCount?.new && (
              <Chip
                icon={<Iconify icon="solar:bell-bing-bold" />}
                color="error"
                label={t('new_count', { count: newCount.new })}
              />
            )}
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setOpenCreate(true)}
            >
              {t('create')}
            </Button>
          </Box>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CustomTabs
          value={statusTab}
          onChange={handleTabChange}
          sx={{ px: 2.5, pt: 1 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={t(`status_${tab.label}`)} />
          ))}
        </CustomTabs>

        <Box
          sx={{
            p: 2.5,
            gap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            select
            label={t('col_service')}
            value={service}
            onChange={(e) => {
              setService(e.target.value as ServiceType | 'all');
              setOffset(0);
            }}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">{t('status_all')}</MenuItem>
            {SERVICE_TYPES.map((s) => (
              <MenuItem key={s} value={s}>
                {t(`service_${s}`)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label={t('col_district')}
            value={districtId}
            onChange={(e) => {
              const v = e.target.value;
              setDistrictId(v === 'all' ? 'all' : Number(v));
              setOffset(0);
            }}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">{t('status_all')}</MenuItem>
            {districts.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name_uz}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <DataGridCustom<IOpsRequestListItem>
            data={data?.items || []}
            column={columns}
            loading={isLoading}
            rowCount={data?.total || 0}
            quickToolbar={false}
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setOffset(0);
            }}
            checkboxSelection={false}
            paginationMode="server"
            paginationModel={{ page: Math.floor(offset / limit), pageSize: limit }}
            onPaginationModelChange={handlePaginationChange}
          />
        </Box>
      </Card>

      <OpsRequestCreateDialog open={openCreate} onClose={() => setOpenCreate(false)} />

      <OpsRequestDetailDialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        requestId={detailId}
      />
    </DashboardContent>
  );
}

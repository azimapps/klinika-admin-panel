import { Navigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { usersColumn } from './column';
import { useGetAllUsers } from '../hooks/useGetUsers';
import { useFilterUsers } from '../hooks/useUsersFilter';

import type { IUserAdapter } from '../types/IUsers';

// ----------------------------------------------------------------------

export function UserListView() {
  const { t } = useTranslate('users');
  const { search, onSearchChange, pagination, onPaginationChange } = useFilterUsers();
  const { data, isLoading, error } = useGetAllUsers({
    search,
    page: pagination.page + 1,
    limit: pagination.pageSize,
  });
  if (error) return <Navigate to="/error/500" />;
  if (isLoading) return <LoadingScreen />;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`${t('users')} ${t('list')}`}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: t('users'), href: paths.dashboard.user.root },
          { name: t('list') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <DataGridCustom<IUserAdapter>
              data={data?.users || []}
              column={usersColumn({ t })}
              loading={isLoading}
              search={search}
              onSearchChange={onSearchChange}
              rowCount={data?.pagination.totalCount ?? 0}
              initialState={{
                pagination: { paginationModel: pagination },
              }}
              onPaginationModelChange={onPaginationChange}
              quickToolbar={false}
            />
          </Scrollbar>
        </Box>
      </Card>
    </DashboardContent>
  );
}

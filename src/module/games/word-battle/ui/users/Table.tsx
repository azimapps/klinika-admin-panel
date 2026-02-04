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

import { wordBattleUsersCol } from './column';
import { useGetUsersList } from '../../hooks/useGetUsersList';
import { useWordBattleFilter } from '../../hooks/useWordBattleFilter';

import type { IUserStatsList } from '../../types/UserList';

// ----------------------------------------------------------------------

export function WordBattleUsersList() {
  const { pagination, onPaginationChange } = useWordBattleFilter();
  const { t } = useTranslate('word-battle');
  const { data, error, isLoading } = useGetUsersList({
    page: pagination.page + 1,
    limit: pagination.pageSize,
  });
  if (error) return <Navigate to="/error/500" />;
  if (isLoading) return <LoadingScreen />;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('users.gamersList')}
        links={[
          { name: t('users.main'), href: paths.dashboard.root },
          { name: 'Word Battle', href: paths.dashboard.games.wordBattle.root },
          { name: t('users.gamers') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <DataGridCustom<IUserStatsList>
              data={data?.users || []}
              column={wordBattleUsersCol({ t })}
              loading={isLoading}
              quickToolbar
              rowCount={data?.pagination.totalCount || 0}
              initialState={{
                pagination: { paginationModel: pagination },
              }}
              onPaginationModelChange={onPaginationChange}
            />
          </Scrollbar>
        </Box>
      </Card>
    </DashboardContent>
  );
}

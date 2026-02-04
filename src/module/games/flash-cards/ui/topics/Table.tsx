import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { Navigate, useNavigate } from 'react-router';

import { Card, Button, useTheme } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { flashCardTopicListColumn } from './column';
import { useDeleteTopic } from '../../hooks/useDeleteTopic';
import { useGetTopicList } from '../../hooks/useGetTopicList';
import { useFlashCardFilter } from '../../hooks/useFilterFlashCardFilter';
import { useLevelLabels, useStatusLabels, useLanguageLabels } from '../../service/enums';

export const FlashCardTopics = () => {
  const levelLabels = useLevelLabels();
  const statusLabels = useStatusLabels();
  const langLabels = useLanguageLabels();
  const { t } = useTranslate('flash-card');
  const [clickedTopic, setClickedTopic] = useState<string>('');
  const { pagination, onPaginationChange } = useFlashCardFilter();
  const navigate = useNavigate();
  const { isPending, mutateAsync } = useDeleteTopic();
  const theme = useTheme();
  const openDeleteConfirm = useBoolean();
  const { data, error, isLoading } = useGetTopicList({
    page: pagination.page + 1,
    limit: pagination.pageSize,
  });
  const onDeleteTopic = async () => {
    await mutateAsync(clickedTopic);
    openDeleteConfirm.onFalse();
  };
  if (isLoading) return <LoadingScreen />;
  if (error) return <Navigate to="/error/500" />;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('title')}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: 'Flash Card', href: paths.dashboard.games.flashCard.root },
          { name: t('list') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.games.flashCard.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('add')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <DataGridCustom
          loading={isLoading}
          data={data?.topicList || []}
          column={flashCardTopicListColumn({
            theme,
            onDelete: (id) => {
              setClickedTopic(id);
              openDeleteConfirm.onTrue();
            },
            onEdit: (id: string) => navigate(paths.dashboard.games.flashCard.edit(id)),
            t,
            levelLabels,
            statusLabels,
            langLabels,
          })}
          quickToolbar
          onPaginationModelChange={onPaginationChange}
          initialState={{
            pagination: {
              paginationModel: pagination,
            },
          }}
          rowCount={data?.pagination.totalCount}
        />
      </Card>

      {clickedTopic && (
        <ConfirmDialog
          title={t('delete')}
          content={t('table.deleteDialogContent')}
          open={openDeleteConfirm.value}
          onClose={openDeleteConfirm.onFalse}
          action={
            <Button variant="contained" color="error" onClick={onDeleteTopic} loading={isPending}>
              {t('delete')}
            </Button>
          }
        />
      )}
    </DashboardContent>
  );
};

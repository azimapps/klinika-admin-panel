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

import { questionListColumn } from './questionsColumn';
import { useGetQuestions } from '../../hooks/useGetQuestions';
import { usePicsWordFilter } from '../../hooks/useFilterPicsWord';
import { useDeleteQuestion } from '../../hooks/useDeleteQuestion';

export const QuestionList = () => {
  const { t } = useTranslate('pic-word');
  const theme = useTheme();
  const navigate = useNavigate();
  const openDeleteConfirm = useBoolean();
  const [selectedQuestion, setSelectedQuestion] = useState<string>();
  const { pagination, onPaginationChange } = usePicsWordFilter();
  const { isDeleting, onDelete } = useDeleteQuestion();
  const { data, isLoading, error } = useGetQuestions({
    page: pagination.page + 1,
    limit: pagination.pageSize,
  });
  if (isLoading) return <LoadingScreen />;
  if (error) return <Navigate to="/error/500" />;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('title')}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: '4Pics 1Word', href: paths.dashboard.games.picsWord.root },
          { name: t('title') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.games.picsWord.create}
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
          data={data?.qeustions || []}
          column={questionListColumn({
            theme,
            onDelete: (id: string) => {
              setSelectedQuestion(id);
              openDeleteConfirm.onTrue();
            },
            onEdit: (id: string) => navigate(paths.dashboard.games.picsWord.update(id)),
            t,
          })}
          quickToolbar
          rowCount={data?.pagination.totalCount}
          onPaginationModelChange={onPaginationChange}
          initialState={{
            pagination: {
              paginationModel: pagination,
            },
          }}
        />
      </Card>
      {selectedQuestion && (
        <ConfirmDialog
          title={t('delete')}
          content={t('table.deleteContent')}
          open={openDeleteConfirm.value}
          onClose={openDeleteConfirm.onFalse}
          action={
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                await onDelete(selectedQuestion);
                openDeleteConfirm.onFalse();
              }}
              loading={isDeleting}
            >
              {t('delete')}
            </Button>
          }
        />
      )}
    </DashboardContent>
  );
};

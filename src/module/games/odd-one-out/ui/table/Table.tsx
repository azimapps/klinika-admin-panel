import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { Navigate, useNavigate } from 'react-router';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { oddOneOutColumn } from './column';
import { useDeleteQuestion } from '../../hooks/useDeleteQuestion';
import { useGetAllQuestions } from '../../hooks/useGetAllQuestions';
import { useOddOneOutFilter } from '../../hooks/useFilterOddOneOut';

export const OddOneOutQuestionsList = () => {
  const navigate = useNavigate();
  const { isPending, mutateAsync } = useDeleteQuestion();
  const [deleteQuestion, setDeleteQuestion] = useState<string>();
  const openDeleteDialog = useBoolean();
  const { pagination, onPaginationChange } = useOddOneOutFilter();
  const { data, isLoading, error } = useGetAllQuestions({
    limit: pagination.pageSize,
    page: pagination.page + 1,
  });

  if (error) return <Navigate to="/error/500" />;
  if (isLoading) return <LoadingScreen />;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Savollar ro'yxati"
        links={[
          { name: 'Asosiy', href: paths.dashboard.root },
          { name: 'Odd One Out', href: paths.dashboard.games.oddOneOut.root },
          { name: "Ro'yxati" },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.games.oddOneOut.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Qo&apos;shish
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <DataGridCustom
          data={data?.questions || []}
          column={oddOneOutColumn({
            onDelete: (id: string) => {
              setDeleteQuestion(id);
              openDeleteDialog.onTrue();
            },
            onEdit: (id: string) => navigate(paths.dashboard.games.oddOneOut.edit(id)),
          })}
          loading={isLoading}
          quickToolbar
          onPaginationModelChange={onPaginationChange}
          initialState={{
            pagination: { paginationModel: pagination },
          }}
          rowCount={data?.pagination.totalCount}
        />
      </Card>

      {deleteQuestion && (
        <ConfirmDialog
          open={openDeleteDialog.value}
          onClose={openDeleteDialog.onFalse}
          title="O'chirish"
          content="Siz ushbu savolni rostdanham o'chirmoqchimisiz? Ushbu savoln butunlay o'chib ketadi."
          action={
            <Button
              onClick={async () => {
                await mutateAsync(deleteQuestion);
                openDeleteDialog.onFalse();
              }}
              loading={isPending}
              variant="contained"
              color="error"
            >
              O&apos;chirish
            </Button>
          }
        />
      )}
    </DashboardContent>
  );
};

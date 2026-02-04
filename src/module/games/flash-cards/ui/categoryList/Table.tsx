import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Card, Button, useTheme, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { flashCardCategoryListColumn } from './column';
import { FlashCardCategoryForm } from '../actions/addCategory';
import { useDeleteCategory } from '../../hooks/useDeleteCategory';
import { useGetCategoryList } from '../../hooks/useGetCategoryList';

import type { ITopicCategoryMapper } from '../../types/Category';

export const FlashCardCategoryList = () => {
  const [editData, setEditData] = useState<ITopicCategoryMapper>();
  const [deleteData, setDeleteData] = useState<string>();
  const theme = useTheme();
  const { t } = useTranslate('flash-card');
  const { data, isLoading } = useGetCategoryList();
  const openAddCategory = useBoolean();
  const openEditCategory = useBoolean();
  const openDeleteConfirm = useBoolean();
  const { isDeleting, deleteAsync } = useDeleteCategory();
  if (isLoading) return <CircularProgress />;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Kategoriya list"
        links={[
          { name: 'Main', href: paths.dashboard.root },
          { name: 'Flash Card', href: paths.dashboard.games.flashCard.root },
          { name: 'Kategoriya list' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openAddCategory.onTrue}
          >
            {t('add')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <DataGridCustom
          loading={isLoading}
          data={data || []}
          column={flashCardCategoryListColumn({
            t,
            theme,
            onEdit: (row: ITopicCategoryMapper) => {
              setEditData(row);
              openEditCategory.onTrue();
            },
            onDelete: (id: string) => {
              openDeleteConfirm.onTrue();
              setDeleteData(id);
            },
          })}
          quickToolbar
        />
      </Card>
      <FlashCardCategoryForm open={openAddCategory.value} onClose={openAddCategory.onFalse} />
      {editData && (
        <FlashCardCategoryForm
          open={openEditCategory.value}
          onClose={openEditCategory.onFalse}
          initialValue={editData}
        />
      )}
      {deleteData && (
        <ConfirmDialog
          open={openDeleteConfirm.value}
          onClose={openDeleteConfirm.onFalse}
          title={t('delete')}
          content="Siz ushbu kategoriyani rostdanham o'chirmoqchimisiz? Ushbu kategoriya butunlay o'chib ketadi."
          action={
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                await deleteAsync(deleteData);
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

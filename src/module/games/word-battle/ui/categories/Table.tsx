import { useState } from 'react';
import { Navigate } from 'react-router';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { wordBattleCol } from './column';
import { EditCategoryDialog } from '../actions/edit';
import { useGetWordsList } from '../../hooks/useGetWordsList';
import { useDeleteWordBattleTopic } from '../../hooks/useDeleteTopic';
import { useGetWordBattleList } from '../../hooks/useGetWordBattleList';

import type { IWordBattleCategory } from '../../types/GameList';

// ----------------------------------------------------------------------

export function WordBattleCategoryList() {
  const { t } = useTranslate('word-battle');
  const [categoryId, setCategoryId] = useState<string>();
  const theme = useTheme();
  const { data, error, isLoading } = useGetWordBattleList();
  const { data: editData, isLoading: isEditing } = useGetWordsList(categoryId || '');
  const { isPending, mutateAsync } = useDeleteWordBattleTopic();
  const openDeleteConfirm = useBoolean();
  const openEditCategory = useBoolean();

  const onDelete = async () => {
    if (categoryId) {
      await mutateAsync(categoryId);
      openDeleteConfirm.onFalse();
    }
  };
  if (error) return <Navigate to="/error/500" />;
  if (isLoading) return <LoadingScreen />;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('categories')}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: 'Word Battle', href: paths.dashboard.games.wordBattle.root },
          { name: t('list') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.games.wordBattle.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('add')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <DataGridCustom<IWordBattleCategory>
              data={data || []}
              column={wordBattleCol({
                t,
                theme,
                onEdit: (id: string) => {
                  setCategoryId(id);
                  openEditCategory.onTrue();
                },
                onDelete: (id: string) => {
                  openDeleteConfirm.onTrue();
                  setCategoryId(id);
                },
              })}
              loading={isLoading}
              quickToolbar
              rowCount={data?.length || 0}
            />
          </Scrollbar>
        </Box>
      </Card>
      {categoryId && (
        <ConfirmDialog
          open={openDeleteConfirm.value}
          onClose={openDeleteConfirm.onFalse}
          title={t('deleteDialog.title')}
          action={
            <Button loading={isPending} onClick={onDelete} variant="contained" color="error">
              {t('deleteDialog.delete')}
            </Button>
          }
          content={t('deleteDialog.content')}
        />
      )}
      {editData && !isEditing && (
        <EditCategoryDialog
          open={openEditCategory.value}
          onClose={openEditCategory.onFalse}
          data={editData?.category}
          id={editData.category.id}
        />
      )}
    </DashboardContent>
  );
}

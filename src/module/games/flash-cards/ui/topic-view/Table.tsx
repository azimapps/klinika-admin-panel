import { debounce } from 'lodash';
import { Navigate } from 'react-router';
import { useBoolean } from 'minimal-shared/hooks';
import { memo, useMemo, useState, useCallback } from 'react';

import { Card, Button, useTheme } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { BulkUpload } from '../actions/bulkUpload';
import { useFlashCardTopicWordColumn } from './column';
import { FlashCardWordForm } from '../actions/addWord';
import { useAudioSearch } from '../../hooks/useSendBulk';
import { useDeleteWord } from '../../hooks/useDeleteWord';
import { useGetTopicWords } from '../../hooks/useGetTopicWords';
import { useUpdateWordBySelect } from '../../hooks/useUpdateWord';

import type { ITopicWord } from '../../types/WordList';

interface Props {
  topicId: string;
}

const FlashCardTopicViewComponent = ({ topicId }: Props) => {
  const { t } = useTranslate('flash-card');
  const { data, error, isLoading } = useGetTopicWords(topicId);
  const openBulkUpload = useBoolean();
  const { isDeleting, onDeleteWord } = useDeleteWord();
  const [categoryId, setCategoryId] = useState<string>();
  const [singleWord, setSingleWord] = useState<ITopicWord>();
  const openDeleteConfirm = useBoolean();
  const openEditForm = useBoolean();
  const openFormDialog = useBoolean();
  const theme = useTheme();

  // Audio search state and logic
  const [search, setSearch] = useState<string | undefined>(undefined);
  const { data: audioData, isLoading: isAudioLoading } = useAudioSearch(search);
  const { onUpdateBySelect, isUpdatingBySelect } = useUpdateWordBySelect();

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string | undefined) => {
        setSearch(value);
      }, 300),
    []
  );

  // Memoized event handlers
  const handleAudioSelect = useCallback(
    async (rowId: string, audioUrl: string) => {
      await onUpdateBySelect({ id: rowId, audio: audioUrl });
      setSearch(undefined);
    },
    [onUpdateBySelect]
  );

  const handleUpdateStatus = useCallback(
    async (id: string, isActive: boolean) => {
      await onUpdateBySelect({ id, isActive });
    },
    [onUpdateBySelect]
  );

  const handleDelete = useCallback(
    (id: string) => {
      openDeleteConfirm.onTrue();
      setCategoryId(id);
    },
    [openDeleteConfirm]
  );

  const handleEdit = useCallback(
    (row: ITopicWord) => {
      setSingleWord(row);
      openEditForm.onTrue();
    },
    [openEditForm]
  );

  const handleSearchChange = useCallback(
    (value?: string) => debouncedSetSearch(value || undefined),
    [debouncedSetSearch]
  );

  // Memoized audio options
  const audioOptions = useMemo(() => audioData?.data || [], [audioData?.data]);

  // Memoized breadcrumbs data
  const breadcrumbsData = useMemo(
    () => [
      { name: t('main'), href: paths.dashboard.root },
      { name: 'Flash Card', href: paths.dashboard.games.flashCard.root },
      { name: t('table.topic'), href: paths.dashboard.games.flashCard.list },
      { name: t('innerTable.words') },
    ],
    [t]
  );

  const breadcrumbsHeading = useMemo(
    () => `${t('innerTable.title')} (${data?.length || 0} ${t('innerTable.word')})`,
    [t, data?.length]
  );

  const flashCardTopicWordColumn = useFlashCardTopicWordColumn({
    onDelete: handleDelete,
    onEdit: handleEdit,
    onAudioSelect: handleAudioSelect,
    theme,
    t,
    search,
    handleSearchChange,
    audioOptions,
    isAudioLoading,
    isUpdatingAudio: isUpdatingBySelect,
    onUpdateStatus: handleUpdateStatus,
  });
  // Memoized action buttons
  const actionButtons = useMemo(
    () => (
      <>
        <Button
          onClick={openFormDialog.onTrue}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          {t('add')}
        </Button>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={openBulkUpload.onTrue}
        >
          Upload bulk
        </Button>
      </>
    ),
    [openFormDialog.onTrue, openBulkUpload.onTrue, t]
  );

  // Memoized delete handler
  const handleDeleteConfirm = useCallback(async () => {
    if (categoryId) {
      await onDeleteWord(categoryId);
      openDeleteConfirm.onFalse();
    }
  }, [categoryId, onDeleteWord, openDeleteConfirm]);

  // Memoized data grid props
  const dataGridProps = useMemo(
    () => ({
      loading: isLoading,
      data: data || [],
      column: flashCardTopicWordColumn,
      quickToolbar: true,
      rowCount: data?.length,
    }),
    [isLoading, data, flashCardTopicWordColumn]
  );
  if (isLoading) return <LoadingScreen />;
  if (error) return <Navigate to="/error/500" />;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={breadcrumbsHeading}
        links={breadcrumbsData}
        action={actionButtons}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <DataGridCustom {...dataGridProps} />
      </Card>

      <FlashCardWordForm open={openFormDialog.value} onClose={openFormDialog.onFalse} />
      {singleWord && (
        <FlashCardWordForm
          open={openEditForm.value}
          onClose={openEditForm.onFalse}
          initialValue={singleWord}
        />
      )}

      {categoryId && (
        <ConfirmDialog
          open={openDeleteConfirm.value}
          onClose={openDeleteConfirm.onFalse}
          title={t('innerTable.deleteWord')}
          action={
            <Button
              loading={isDeleting}
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
            >
              {t('delete')}
            </Button>
          }
          content={t('innerTable.deleteDialogContent')}
        />
      )}
      <BulkUpload open={openBulkUpload.value} onClose={openBulkUpload.onFalse} />
    </DashboardContent>
  );
};

export const FlashCardTopicView = memo(FlashCardTopicViewComponent);

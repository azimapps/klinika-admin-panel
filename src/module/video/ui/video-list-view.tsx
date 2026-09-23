import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from 'src/module/_examples/mui/data-grid-view/data-grid-custom';

import { VideoFormDialog } from './video-form-dialog';
import { videoTableColumns } from './video-table-columns';
import { useGetVideos, useDeleteVideo, useUpdateVideo } from '../hooks';

import type { IVideo } from '../types';

// ----------------------------------------------------------------------

export function VideoListView() {
  const { t } = useTranslate('video');
  const { data: videos = [], isLoading } = useGetVideos();
  const { mutateAsync: deleteVideo } = useDeleteVideo();
  const { mutateAsync: updateVideo } = useUpdateVideo();

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IVideo | undefined>(undefined);

  const handleOpenForm = useCallback((row?: IVideo) => {
    setSelectedRow(row);
    setOpenForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setSelectedRow(undefined);
    setOpenForm(false);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (window.confirm(t('confirm_delete'))) {
        try {
          await deleteVideo(id);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [deleteVideo, t]
  );

  const handleToggleActive = useCallback(
    async (row: IVideo) => {
      try {
        await updateVideo({ id: row.id.toString(), data: { is_active: !row.is_active } });
      } catch (error) {
        console.error(error);
      }
    },
    [updateVideo]
  );

  const columns = videoTableColumns({
    t,
    onEdit: handleOpenForm,
    onDelete: handleDelete,
    onToggleActive: handleToggleActive,
  });

  // The mobile home screen shows exactly one video: the first active row by order.
  const featured = videos.filter((video) => video.is_active).sort((a, b) => a.order - b.order)[0];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('list_title')}
        links={[{ name: 'Asosiy', href: paths.dashboard.root }, { name: t('list_title') }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenForm()}
          >
            {t('add')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {!isLoading && (
        <Alert severity={featured ? 'info' : 'warning'} sx={{ mb: 3 }}>
          {featured ? t('featured_hint', { title: featured.title_uz }) : t('featured_empty')}
        </Alert>
      )}

      <Card>
        <Box sx={{ position: 'relative' }}>
          <DataGridCustom<IVideo>
            data={videos}
            column={columns}
            loading={isLoading}
            rowCount={videos.length}
            quickToolbar={false}
          />
        </Box>
      </Card>

      <VideoFormDialog open={openForm} onClose={handleCloseForm} currentRow={selectedRow} />
    </DashboardContent>
  );
}

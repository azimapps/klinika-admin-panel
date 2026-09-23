import { z as zod } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { useCreateVideo, useUpdateVideo, useUploadVideoThumbnail } from '../hooks';

import type { IVideo } from '../types';

// ----------------------------------------------------------------------

/**
 * Mirrors the backend's `_normalize_video_id` so the dialog can preview the
 * thumbnail before the value is ever submitted.
 */
const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
  /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  /(?:youtube\.com\/(?:embed|shorts|live|v)\/)([A-Za-z0-9_-]{11})/,
];

export function extractVideoId(value: string): string | null {
  const trimmed = (value || '').trim();

  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  currentRow?: IVideo;
}

export function VideoFormDialog({ open, onClose, currentRow }: Props) {
  const { t } = useTranslate('video');

  const VideoSchema = useMemo(
    () =>
      zod.object({
        video_id: zod
          .string()
          .min(1, { message: t('video_id_required') })
          .refine((value) => extractVideoId(value) !== null, { message: t('video_id_invalid') }),
        title_uz: zod.string().min(1, { message: t('title_uz_required') }),
        title_ru: zod.string(),
        title_en: zod.string(),
        subtitle_uz: zod.string(),
        subtitle_ru: zod.string(),
        subtitle_en: zod.string(),
        duration: zod.string(),
        order: zod.coerce.number(),
        is_active: zod.boolean(),
        thumbnail: zod.any().nullable().optional(),
      }),
    [t]
  );

  type VideoSchemaType = zod.infer<typeof VideoSchema>;

  const [currentTab, setCurrentTab] = useState('uz');

  const { mutateAsync: createVideo, isPending: createPending } = useCreateVideo();
  const { mutateAsync: updateVideo, isPending: updatePending } = useUpdateVideo();
  const { mutateAsync: uploadThumbnail } = useUploadVideoThumbnail();

  const defaultValues = useMemo(
    () => ({
      video_id: currentRow?.video_id || '',
      title_uz: currentRow?.title_uz || '',
      title_ru: currentRow?.title_ru || '',
      title_en: currentRow?.title_en || '',
      subtitle_uz: currentRow?.subtitle_uz || '',
      subtitle_ru: currentRow?.subtitle_ru || '',
      subtitle_en: currentRow?.subtitle_en || '',
      duration: currentRow?.duration || '',
      order: currentRow?.order || 0,
      is_active: currentRow?.is_active ?? true,
      thumbnail: currentRow?.thumbnail || null,
    }),
    [currentRow]
  );

  const methods = useForm<VideoSchemaType>({
    resolver: zodResolver(VideoSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentRow, reset, defaultValues]);

  const watchedVideoId = useWatch({ control, name: 'video_id' });
  const previewId = extractVideoId(watchedVideoId || '');

  const handleChangeTab = useCallback((event: any, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const thumbnailFile = data.thumbnail instanceof File ? data.thumbnail : null;
      // The thumbnail has its own multipart endpoint, so it never goes in the JSON body.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { thumbnail: _thumbnail, ...rest } = data;

      if (currentRow) {
        await updateVideo({ id: currentRow.id.toString(), data: rest });
        if (thumbnailFile) {
          await uploadThumbnail({ id: currentRow.id, file: thumbnailFile });
        }
      } else {
        const res = await createVideo(rest);
        if (thumbnailFile && res?.id) {
          await uploadThumbnail({ id: res.id, file: thumbnailFile });
        }
      }
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue('thumbnail', Object.assign(file, { preview: URL.createObjectURL(file) }), {
          shouldValidate: true,
        });
      }
    },
    [setValue]
  );

  const TABS = [
    { value: 'uz', label: "O'zbekcha", hasError: !!errors.title_uz || !!errors.subtitle_uz },
    { value: 'ru', label: 'Русский', hasError: !!errors.title_ru || !!errors.subtitle_ru },
    { value: 'en', label: 'English', hasError: !!errors.title_en || !!errors.subtitle_en },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentRow ? t('edit') : t('add')}</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Field.Text name="video_id" label={t('video_id')} helperText={t('video_id_help')} />

            {previewId && (
              <Box
                sx={{
                  width: 1,
                  maxWidth: 360,
                  overflow: 'hidden',
                  borderRadius: 2,
                  aspectRatio: '16 / 9',
                  bgcolor: 'background.neutral',
                }}
              >
                <Box
                  component="iframe"
                  src={`https://www.youtube.com/embed/${previewId}`}
                  title={t('preview')}
                  allowFullScreen
                  sx={{ width: 1, height: 1, border: 0, display: 'block' }}
                />
              </Box>
            )}

            <Tabs value={currentTab} onChange={handleChangeTab}>
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  sx={{
                    ...(tab.hasError && {
                      color: 'error.main',
                      '&.Mui-selected': { color: 'error.main' },
                    }),
                  }}
                />
              ))}
            </Tabs>

            {currentTab === 'uz' && (
              <Stack spacing={2}>
                <Field.Text name="title_uz" label={t('title_uz')} />
                <Field.Text name="subtitle_uz" label={t('subtitle_uz')} />
              </Stack>
            )}

            {currentTab === 'ru' && (
              <Stack spacing={2}>
                <Field.Text name="title_ru" label={t('title_ru')} />
                <Field.Text name="subtitle_ru" label={t('subtitle_ru')} />
              </Stack>
            )}

            {currentTab === 'en' && (
              <Stack spacing={2}>
                <Field.Text name="title_en" label={t('title_en')} />
                <Field.Text name="subtitle_en" label={t('subtitle_en')} />
              </Stack>
            )}

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
            >
              <Field.Text name="duration" label={t('duration')} placeholder="3:42" />
              <Field.Text name="order" label={t('order')} type="number" />
              <Field.Switch name="is_active" label={t('is_active')} />
            </Box>

            <Box sx={{ mb: 5 }}>
              <Field.Upload
                name="thumbnail"
                maxSize={307200}
                onDrop={handleDrop}
                onDelete={() => setValue('thumbnail', null, { shouldValidate: true })}
              />
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.disabled',
                }}
              >
                {t('thumbnail_optional')}
                <br /> {t('max_size')}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={createPending || updatePending || isSubmitting}
          >
            {t('save')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

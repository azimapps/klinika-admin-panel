import { memo, useEffect } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useUploadFile } from 'src/utils/useUploadFile';

import { useTranslate } from 'src/locales';

import { Form, RHFSelect, RHFUpload, RHFTextField, RHFUploadBox } from 'src/components/hook-form';

import { wordSchema } from '../../service/wordScheme';
import { useCreateWord } from '../../hooks/useCreateWord';
import { useUpdateWord } from '../../hooks/useUpdateWord';

import type { ITopicWord } from '../../types/WordList';
import type { WordCreateFormType } from '../../service/wordScheme';

interface Props {
  open: boolean;
  onClose: () => void;
  initialValue?: ITopicWord;
}

export const FlashCardWordForm = memo(({ open, onClose, initialValue }: Props) => {
  const { t } = useTranslate('flash-card');
  const params = useParams() as { id: string };
  const { uploadAsync, isPending: isUploading } = useUploadFile();
  const { mutateAsync, isPending } = useCreateWord();
  const { isUpdating, onUpdating } = useUpdateWord(initialValue?.id || '');
  const form = useForm<WordCreateFormType>({
    defaultValues: {
      audio: initialValue?.audio || '',
      isActive: initialValue?.isActive.toString() || '',
      text: initialValue?.text || '',
      translation: initialValue?.translation || '',
      image: initialValue?.image || '',
    },
    resolver: zodResolver(wordSchema),
  });

  useEffect(() => {
    if (initialValue) {
      form.setValue('audio', initialValue.audio);
      form.setValue('isActive', String(initialValue.isActive));
      form.setValue('text', initialValue.text);
      form.setValue('translation', initialValue.translation);
    }
  }, [initialValue, form]);
  const formSubmit = form.handleSubmit(async (value: WordCreateFormType) => {
    const isActiveBoolean = value.isActive === 'true';

    // Upload audio first
    const audioUrl =
      value.audio instanceof File
        ? await uploadAsync({ file: value.audio }).then((res) => res.data.url)
        : value.audio;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const imageUrl =
      value.image instanceof File
        ? await uploadAsync({ file: value.image }).then((res) => res.data.url)
        : value.image;

    if (initialValue) {
      await onUpdating({ ...value, audio: audioUrl, isActive: isActiveBoolean, image: imageUrl });
    } else {
      await mutateAsync({
        ...value,
        audio: audioUrl,
        topic: params.id,
        isActive: isActiveBoolean,
        image: imageUrl,
      });
    }
    onClose();
    form.reset();
  });

  const removeImage = () => {
    form.setValue('image', '');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Form methods={form} onSubmit={formSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          {initialValue ? t('wordCreateUpdate.edit') : t('wordCreateUpdate.title')}
        </DialogTitle>
        <DialogContent>
          <Grid pt={2} container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="text" label={t('wordCreateUpdate.word')} placeholder="Hello" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="translation"
                label={t('wordCreateUpdate.translate')}
                placeholder="Salom"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="isActive" label={t('wordCreateUpdate.status')}>
                <MenuItem value="true" selected>
                  {t('enums.active')}
                </MenuItem>
                <MenuItem value="false">{t('enums.inactive')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFUploadBox
                name="audio"
                sx={{ width: '100%', height: 56 }}
                placeholder={t('wordCreateUpdate.file')}
                accept={{ file: ['audio/*'] }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFUpload
                name="image"
                sx={{ width: '100%' }}
                placeholder="Rasm"
                accept={{ file: ['image/*'] }}
                onDelete={removeImage}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={() => {
              form.reset();
              onClose();
            }}
            variant="outlined"
            color="inherit"
          >
            {t('cancel')}
          </Button>
          <Button
            loading={isUploading || isPending || isUpdating}
            variant="contained"
            color="primary"
            type="submit"
          >
            {t('save')}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
});

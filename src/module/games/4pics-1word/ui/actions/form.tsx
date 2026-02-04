import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, Grid, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useUploadImage } from 'src/utils/useUpload';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Form, RHFUpload, RHFTextField } from 'src/components/hook-form';

import { useCreateQuestion } from '../../hooks/useCreateQuestion';
import { useUpdateQuestion } from '../../hooks/useUpdateQuestion';
import { questionScheme, type QuestionFormType } from '../../service/questionScheme';

interface Props {
  initialValue?: QuestionFormType | null;
}

export const FormQuestions = ({ initialValue }: Props) => {
  const { t } = useTranslate('pic-word');
  const navigate = useNavigate();
  const params = useParams() as { id: string };
  const [uploading, setUploading] = useState(false);
  const { isUpdating, onUpdateAsync } = useUpdateQuestion(params.id);
  const { uploadAsync } = useUploadImage();
  const { isPending, mutateAsync } = useCreateQuestion();
  const form = useForm<QuestionFormType>({
    defaultValues: {
      images: initialValue?.images || [],
      answer: initialValue?.answer || '',
    },
    resolver: zodResolver(questionScheme),
  });

  const formSubmit = form.handleSubmit(async (values: QuestionFormType) => {
    const imagesUrl: string[] = [];
    setUploading(true);
    try {
      for (const file of values.images) {
        if (file instanceof File) {
          const res = await uploadAsync({ file });
          imagesUrl.push(res.data.url);
        } else {
          imagesUrl.push(file);
        }
        await new Promise((resolve) => setTimeout(resolve, 2100));
      }
      const finalPayload = { ...values, images: imagesUrl };
      if (initialValue) {
        await onUpdateAsync(finalPayload);
      } else {
        await mutateAsync(finalPayload);
      }
      navigate(paths.dashboard.games.picsWord.list);
    } catch (error) {
      console.error('Upload error', error);
    } finally {
      setUploading(false);
    }
  });

  const watcher = form.watch();

  const handleRemoveAllFiles = useCallback(() => {
    form.setValue('images', []);
  }, [form]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = watcher.images && watcher.images?.filter((file) => file !== inputFile);
      form.setValue('images', filtered);
    },
    [form, watcher.images]
  );

  return (
    <DashboardContent maxWidth="md">
      <CustomBreadcrumbs
        heading={params.id ? t('form.titleUpdated') : t('form.title')}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: '4Pics 1Word', href: paths.dashboard.games.picsWord.root },
          { name: params.id ? t('edit') : t('add') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3 }}>
        <Form methods={form} onSubmit={formSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <RHFTextField name="answer" label={t('form.answer')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <RHFUpload
                name="images"
                multiple
                maxFiles={4}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                disabled={watcher.images.length === 4}
              />
            </Grid>
            <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
              <Button color="inherit" variant="outlined" type="button" onClick={() => form.reset()}>
                {t('cancel')}
              </Button>
              <Button
                loading={uploading || isPending || isUpdating}
                color="primary"
                variant="contained"
                type="submit"
              >
                {t('save')}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Card>
    </DashboardContent>
  );
};

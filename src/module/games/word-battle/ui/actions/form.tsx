import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useUploadImage } from 'src/utils/useUpload';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Form, RHFUpload, RHFTextField } from 'src/components/hook-form';

import { DynamicFieldArray } from './multiWordInput';
import { useCreateCategory } from '../../hooks/useCreateCategory';
import { createCategoryFormScheme, type CreateCategoryFormType } from '../../service/FormScheme';

export const CategoryCreateForm = () => {
  const { t } = useTranslate('word-battle');
  const { isPending, mutateAsync } = useCreateCategory();
  const { uploadAsync } = useUploadImage();

  const form = useForm<CreateCategoryFormType>({
    defaultValues: {
      topic: '',
      image: '',
      words: [],
    },
    resolver: zodResolver(createCategoryFormScheme),
  });

  const onSubmit = form.handleSubmit(async (data: CreateCategoryFormType) => {
    const uploadedImage =
      data.image instanceof File
        ? await uploadAsync({ file: data.image }).then((res) => res.data.url)
        : data.image;
    await mutateAsync({ ...data, image: uploadedImage });
    form.reset();
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('create.add')}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: 'Word Battle', href: paths.dashboard.games.wordBattle.root },
          { name: t('create.create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Form methods={form} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 4 }}>
            <Card sx={{ p: 3 }}>
              <RHFUpload name="image" onDelete={() => form.setValue('image', '')} />
            </Card>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <RHFTextField name="topic" label={t('create.categoryName')} />
                </Grid>
                <DynamicFieldArray />
              </Grid>
            </Card>
            <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={1} mt={2}>
              <Button type="button" variant="outlined" onClick={() => form.reset()}>
                {t('create.cancel')}
              </Button>
              <Button loading={isPending} type="submit" variant="contained" color="primary">
                {t('create.save')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </DashboardContent>
  );
};

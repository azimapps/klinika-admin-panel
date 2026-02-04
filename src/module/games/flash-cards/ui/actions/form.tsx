import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, Grid, Button, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useUploadImage } from 'src/utils/useUpload';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Form, RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

import { useCreateTopic } from '../../hooks/useCreateTopic';
import { useUpdateTopic } from '../../hooks/useUpdateTopic';
import { useGetCategoryList } from '../../hooks/useGetCategoryList';
import { CreateTopicSchema, type ICreateTopicFormType } from '../../service/scheme';
import {
  level,
  Status,
  Language,
  useLevelLabels,
  useStatusLabels,
  useLanguageLabels,
} from '../../service/enums';

interface Props {
  initialValue?: ICreateTopicFormType;
  id?: string;
}

export const FlashCardTopicForm = ({ initialValue, id }: Props) => {
  const { data: categoryList, isLoading } = useGetCategoryList();
  const LevelLabels = useLevelLabels();
  const { t } = useTranslate('flash-card');
  const LanguageLabelsUz = useLanguageLabels();
  const StatusLabels = useStatusLabels();
  const { isPending: isUploading, uploadAsync } = useUploadImage();
  const { isPending, mutateAsync } = useCreateTopic();
  const navigate = useNavigate();
  const { isUpdating, updateAsync } = useUpdateTopic(id || '');
  const form = useForm<ICreateTopicFormType>({
    defaultValues: {
      description: initialValue?.description || '',
      difficultyLevel: initialValue?.difficultyLevel || level.EASY,
      image: initialValue?.image || '',
      language: initialValue?.language || Language.UZ,
      status: initialValue?.status || Status.ACTIVE,
      topic: initialValue?.topic || '',
      translation: initialValue?.translation || Language.UZ,
      category: initialValue?.category || '',
      color1: initialValue?.color1 || '',
      color2: initialValue?.color2 || '',
      topicColor: initialValue?.topicColor || '',
    },
    resolver: zodResolver(CreateTopicSchema),
  });

  const onSubmit = form.handleSubmit(async (values: ICreateTopicFormType) => {
    const uploadedImage =
      values.image instanceof File
        ? await uploadAsync({ file: values.image as File }).then((res) => res.data.url)
        : values.image;
    if (!initialValue) {
      await mutateAsync({ ...values, image: uploadedImage });
    } else {
      await updateAsync({ ...values, image: uploadedImage });
    }
    form.reset();
    navigate(paths.dashboard.games.flashCard.list);
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          initialValue
            ? `${initialValue.topic} ${t('topicCreateUpdate.edit')}`
            : t('topicCreateUpdate.title')
        }
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: 'Flash Card', href: paths.dashboard.games.flashCard.root },
          { name: initialValue ? t('edit') : t('topicCreateUpdate.create') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3 }}>
        <Form methods={form} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="topic" label={t('topicCreateUpdate.topicName')} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="description" label={t('topicCreateUpdate.topicDesc')} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="language" label={t('topicCreateUpdate.lang')}>
                {Object.values(Language).map((lang) => (
                  <MenuItem value={lang} key={lang}>
                    {LanguageLabelsUz[lang]}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="translation" label={t('topicCreateUpdate.translate')}>
                {Object.values(Language).map((lang) => (
                  <MenuItem value={lang} key={lang}>
                    {LanguageLabelsUz[lang]}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="difficultyLevel" label={t('topicCreateUpdate.level')}>
                {Object.values(level).map((lev) => (
                  <MenuItem value={lev} key={lev}>
                    {LevelLabels[lev]}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="status" label={t('topicCreateUpdate.status')}>
                {Object.values(Status).map((stat) => (
                  <MenuItem value={stat} key={stat}>
                    {StatusLabels[stat]}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="category" label="Category">
                {isLoading ? (
                  <MenuItem value="">Loading...</MenuItem>
                ) : (
                  categoryList?.map((cat) => (
                    <MenuItem value={cat.id} key={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="color1" label="Color 1" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="color2" label="Color 2" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="topicColor" label="Topic Color" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFUpload name="image" onDelete={() => form.setValue('image', '')} />
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-end"
              gap={2}
            >
              <Button variant="outlined" type="button" onClick={() => form.reset()}>
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                loading={isUploading || isPending || isUpdating}
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

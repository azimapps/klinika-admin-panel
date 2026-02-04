import { memo, useEffect } from 'react';
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

import { Form, RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

import { useCreateCategory } from '../../hooks/useCreateCategory';
import { useUpdateCategory } from '../../hooks/useUpdateCategory';
import { categorySchema, type CategoryCreateFormType } from '../../service/categroy';

import type { ITopicCategoryMapper } from '../../types/Category';

interface Props {
  open: boolean;
  onClose: () => void;
  initialValue?: ITopicCategoryMapper;
}

export const FlashCardCategoryForm = memo(({ open, onClose, initialValue }: Props) => {
  const { t } = useTranslate('flash-card');

  const { categoryCreateLoading, categoryCreate } = useCreateCategory();
  const { isUpdating, updateAsync } = useUpdateCategory(initialValue?.id || '');
  const { uploadAsync, isPending: isUploading } = useUploadFile();
  const form = useForm<CategoryCreateFormType>({
    defaultValues: {
      image: initialValue?.image || '',
      status: initialValue?.status.toString() || '',
      name: initialValue?.name || '',
      description: initialValue?.description || '',
      order: initialValue?.order || 0,
    },
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (initialValue) {
      form.setValue('image', initialValue.image);
      form.setValue('status', String(initialValue.status));
      form.setValue('name', initialValue.name);
      form.setValue('description', initialValue.description);
      form.setValue('order', initialValue.order);
    }
  }, [initialValue, form]);
  const removeImage = () => {
    form.setValue('image', '');
  };
  const formSubmit = form.handleSubmit(async (value: CategoryCreateFormType) => {
    const imageUrl =
      value.image instanceof File
        ? await uploadAsync({ file: value.image }).then((res) => res.data.url)
        : value.image;
    if (initialValue) {
      await updateAsync({ ...value, image: imageUrl });
    } else {
      await categoryCreate({ ...value, image: imageUrl });
    }
    onClose();
    form.reset();
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Form methods={form} onSubmit={formSubmit}>
        <DialogTitle sx={{ pb: 1 }}>{initialValue ? 'Taxrirlash' : "Qo'shish"}</DialogTitle>
        <DialogContent>
          <Grid pt={2} container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="name" label="Nomi" placeholder="Example Name" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="order" label="Order" placeholder="Example Order" type="number" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="description" label="Matn" placeholder="Example Description" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="status" label="Holat">
                <MenuItem value="active" selected>
                  {t('enums.active')}
                </MenuItem>
                <MenuItem value="inactive">{t('enums.inactive')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFUpload
                name="image"
                placeholder="Rasm"
                accept={{ file: ['image/*'] }}
                onDelete={removeImage}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onClose} variant="outlined" color="inherit">
            {t('cancel')}
          </Button>
          <Button
            loading={categoryCreateLoading || isUploading || isUpdating}
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

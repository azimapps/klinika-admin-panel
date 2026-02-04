import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  Button,
  useTheme,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useUploadImage } from 'src/utils/useUpload';

import { useTranslate } from 'src/locales';

import { Form, RHFUpload, RHFTextField } from 'src/components/hook-form';

import { useUpdateCategory } from '../../hooks/useUpdateCategory';

import type { EditCategory } from '../../service/FormScheme';

interface Props {
  open: boolean;
  onClose: () => void;
  id: string;
  data: {
    name: string;
    image: string | File;
  };
}

export const EditCategoryDialog = ({ open, onClose, data, id }: Props) => {
  const { t } = useTranslate('word-battle');
  const { uploadAsync, isPending: isUploading } = useUploadImage();
  const { mutateAsync, isPending } = useUpdateCategory(id);
  const theme = useTheme();
  const form = useForm<EditCategory>({
    defaultValues: {
      topic: data.name,
      image: data.image,
    },
  });

  const onSubmit = form.handleSubmit(async (value: EditCategory) => {
    console.log(value);
    const uploadedImage =
      value.image instanceof File
        ? await uploadAsync({ file: value.image as File }).then((res) => res.data.url)
        : value.image;
    await mutateAsync({ topic: value.topic, image: uploadedImage });
    onClose();
  });
  useEffect(() => {
    form.setValue('image', data.image);
    form.setValue('topic', data.name);
  }, [data.image, data.name, form]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Form methods={form} onSubmit={onSubmit}>
        <DialogTitle display="flex" alignItems="center">
          <Typography variant="h6" mr={1} color={theme.palette.primary.dark}>
            {`${data.name}`}
          </Typography>
          {t('editDialog.edit')}
        </DialogTitle>
        <DialogContent>
          <RHFUpload name="image" onDelete={() => form.setValue('image', '')} />
          <RHFTextField label={t('editDialog.categoryName')} name="topic" sx={{ mt: 3 }} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" type="button" onClick={onClose}>
            {t('editDialog.cancel')}
          </Button>
          <Button
            type="submit"
            loading={isPending || isUploading}
            variant="contained"
            color="primary"
          >
            {t('editDialog.save')}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

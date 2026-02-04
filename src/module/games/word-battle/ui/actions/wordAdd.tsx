import { useForm } from 'react-hook-form';

import { Box, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useTranslate } from 'src/locales';

import { Form } from 'src/components/hook-form';

import { DynamicFieldArray } from './multiWordInput';
import { useUpdateCategory } from '../../hooks/useUpdateCategory';

import type { EditCategory } from '../../service/FormScheme';

interface Props {
  open: boolean;
  onClose: () => void;
  id: string;
}

export const WordAdd = ({ open, onClose, id }: Props) => {
  const { t } = useTranslate('word-battle');
  const { isPending, mutateAsync } = useUpdateCategory(id);
  const form = useForm<EditCategory>({
    defaultValues: {
      words: [],
    },
  });

  const onFormSubmit = form.handleSubmit(async (values: EditCategory) => {
    await mutateAsync({ words: values.words });
    onClose();
    form.reset();
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Form methods={form} onSubmit={onFormSubmit}>
        <DialogTitle sx={{ pb: 1 }}>{t('addWord.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DynamicFieldArray mt={3} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              onClose();
              form.reset();
            }}
          >
            {t('editDialog.cancel')}
          </Button>
          <Button type="submit" variant="contained" color="primary" loading={isPending}>
            {t('editDialog.save')}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

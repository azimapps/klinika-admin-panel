import { useState, useEffect } from 'react';

import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import { useDeleteWord } from '../../hooks/useDeleteWord';
import { useUpdateCategory } from '../../hooks/useUpdateCategory';

interface Props {
  open: boolean;
  onClose: () => void;
  word: string;
  id: string;
}

export const WordEdit = ({ open, onClose, word, id }: Props) => {
  const { t } = useTranslate('word-battle');
  const [editableWord, setEditableWord] = useState<string>(word);
  const { isPending, mutateAsync } = useUpdateCategory(id);
  const { isDeleting, onDeleteWord } = useDeleteWord(id);
  useEffect(() => {
    setEditableWord(word);
  }, [word]);

  const handleDeleteWord = async () => {
    await onDeleteWord([word]);
    if (editableWord) {
      await mutateAsync({ words: [editableWord] });
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: { maxWidth: 400 },
        },
      }}
      fullWidth
    >
      <DialogTitle>{t('table.edit')}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          value={editableWord}
          onChange={(e) => setEditableWord(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('editDialog.cancel')}
        </Button>
        <Button
          onClick={handleDeleteWord}
          variant="contained"
          color="primary"
          loading={isDeleting || isPending}
        >
          {t('editDialog.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

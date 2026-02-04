import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import type { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export function ConfirmDialog({
  open,
  title,
  action,
  content,
  onClose,
  ...other
}: ConfirmDialogProps) {
  const { t } = useTranslate('word-battle');
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('editDialog.cancel')}
        </Button>
        {action}
      </DialogActions>
    </Dialog>
  );
}

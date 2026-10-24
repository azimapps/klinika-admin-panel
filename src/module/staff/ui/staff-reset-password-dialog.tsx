import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { useResetStaffPassword } from '../hooks';

import type { IStaffUser } from '../types';

// ----------------------------------------------------------------------

interface Props {
  open: boolean;
  onClose: () => void;
  user?: IStaffUser;
}

export function StaffResetPasswordDialog({ open, onClose, user }: Props) {
  const { t } = useTranslate('staff');
  const resetPassword = useResetStaffPassword();

  const [password, setPassword] = useState('');
  const [error, setErrorState] = useState('');

  useEffect(() => {
    if (open) {
      setPassword('');
      setErrorState('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setErrorState(t('password_min'));
      return;
    }
    try {
      await resetPassword.mutateAsync({ id: user!.id, new_password: password });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('reset_password')}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {user && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user.full_name} (@{user.username})
            </Typography>
          )}
          <TextField
            autoFocus
            fullWidth
            type="password"
            label={t('new_password')}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorState('');
            }}
            error={!!error}
            helperText={error || t('password_hint')}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('cancel')}
        </Button>
        <LoadingButton variant="contained" loading={resetPassword.isPending} onClick={handleSubmit}>
          {t('save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { useCreateStaff, useUpdateStaff } from '../hooks';

import type { StaffRole, IStaffUser } from '../types';

// ----------------------------------------------------------------------

const Schema = zod.object({
  username: zod.string().optional(),
  full_name: zod.string().min(1, { message: 'F.I.SH majburiy!' }),
  password: zod.string().optional(),
  role: zod.enum(['operator', 'senior_operator', 'administrator']),
  phone_number: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  currentRow?: IStaffUser;
}

export function StaffFormDialog({ open, onClose, currentRow }: Props) {
  const { t } = useTranslate('staff');
  const isEdit = !!currentRow;

  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      username: '',
      full_name: '',
      password: '',
      role: 'operator',
      phone_number: '',
    },
  });

  const { reset, setError, handleSubmit } = methods;

  useEffect(() => {
    if (open) {
      reset({
        username: currentRow?.username || '',
        full_name: currentRow?.full_name || '',
        password: '',
        role: currentRow?.role || 'operator',
        phone_number: currentRow?.phone_number || '',
      });
    }
  }, [open, currentRow, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await updateStaff.mutateAsync({
          id: currentRow!.id,
          data: {
            full_name: data.full_name,
            phone_number: data.phone_number?.trim() ? data.phone_number.trim() : null,
            role: data.role as StaffRole,
          },
        });
      } else {
        if (!data.username?.trim()) {
          setError('username', { message: t('username_required') });
          return;
        }
        if (!data.password || data.password.length < 8) {
          setError('password', { message: t('password_min') });
          return;
        }
        await createStaff.mutateAsync({
          username: data.username.trim(),
          full_name: data.full_name,
          password: data.password,
          role: data.role as StaffRole,
          phone_number: data.phone_number?.trim() ? data.phone_number.trim() : null,
        });
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? t('edit_title') : t('create_title')}</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {!isEdit && <Field.Text name="username" label={t('username')} />}

            <Field.Text name="full_name" label={t('full_name')} />

            {!isEdit && (
              <Field.Text
                name="password"
                label={t('password')}
                type="password"
                helperText={t('password_hint')}
              />
            )}

            <Field.Select name="role" label={t('role')}>
              <MenuItem value="operator">{t('role_operator')}</MenuItem>
              <MenuItem value="senior_operator">{t('role_senior_operator')}</MenuItem>
              <MenuItem value="administrator">{t('role_administrator')}</MenuItem>
            </Field.Select>

            <Field.Text name="phone_number" label={t('phone')} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={createStaff.isPending || updateStaff.isPending}
          >
            {t('save')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

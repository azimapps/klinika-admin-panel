import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useGetDistricts, useClientLookup, useCreateOpsRequest } from '../hooks';

import type { IDistrict, IOpsRequestCreate } from '../types';

// ----------------------------------------------------------------------

const Schema = zod.object({
  full_name: zod.string().min(1, { message: 'Ism majburiy!' }),
  phone: zod
    .string()
    .regex(/^\+998\d{9}$/, { message: "To'liq telefon raqam kiriting: +998 va 9 ta raqam" }),
  service_type: zod.enum(['doctor', 'nurse', 'nanny']),
  district_id: zod.coerce.number().optional(),
  visit_at: zod.string().optional(),
  operator_comment: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OpsRequestCreateDialog({ open, onClose }: Props) {
  const { t } = useTranslate('ops');

  const { data: districts = [] } = useGetDistricts();
  const createReq = useCreateOpsRequest();

  const [lookupPhone, setLookupPhone] = useState('');
  const { data: lookup } = useClientLookup(lookupPhone, !!lookupPhone);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      full_name: '',
      phone: '+998',
      service_type: 'doctor',
      district_id: 0,
      visit_at: '',
      operator_comment: '',
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const phoneValue = watch('phone');

  // Keep the field anchored to the +998 prefix and capped at 9 subscriber digits.
  const handlePhoneChange = (raw: string) => {
    const digits = (raw.startsWith('+998') ? raw.slice(4) : raw.replace(/^\+?998?/, ''))
      .replace(/\D/g, '')
      .slice(0, 9);
    setValue('phone', `+998${digits}`, { shouldValidate: true });
  };

  useEffect(() => {
    if (open) {
      reset();
      setLookupPhone('');
    }
  }, [open, reset]);

  useEffect(() => {
    if (lookup?.known_client && lookup.prefill?.full_name) {
      setValue('full_name', lookup.prefill.full_name);
    }
  }, [lookup, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const payload: IOpsRequestCreate = {
      full_name: data.full_name,
      phone: data.phone,
      service_type: data.service_type,
      district_id: data.district_id && data.district_id > 0 ? data.district_id : null,
      visit_at: data.visit_at?.trim() ? data.visit_at : null,
      operator_comment: data.operator_comment?.trim() ? data.operator_comment : null,
    };
    try {
      await createReq.mutateAsync(payload);
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{t('create_title')}</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <TextField
                fullWidth
                label={t('col_phone')}
                value={phoneValue}
                onChange={(e) => handlePhoneChange(e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 13 } }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={() => setLookupPhone(phoneValue)}
                startIcon={<Iconify icon={'solar:magnifer-bold' as any} />}
                sx={{ height: 56, whiteSpace: 'nowrap' }}
              >
                {t('lookup')}
              </Button>
            </Stack>

            {lookup?.known_client && (
              <Alert severity="info">
                {t('known_client', { count: lookup.history?.length ?? 0 })}
              </Alert>
            )}

            <Field.Text name="full_name" label={t('col_name')} />

            <Field.Select name="service_type" label={t('col_service')}>
              <MenuItem value="doctor">{t('service_doctor')}</MenuItem>
              <MenuItem value="nurse">{t('service_nurse')}</MenuItem>
              <MenuItem value="nanny">{t('service_nanny')}</MenuItem>
            </Field.Select>

            <Box
              sx={{
                rowGap: 2.5,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Select name="district_id" label={t('district')}>
                <MenuItem value={0}>—</MenuItem>
                {districts.map((d: IDistrict) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name_uz}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text
                name="visit_at"
                label={t('visit_at')}
                type="datetime-local"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <Field.Text
              name="operator_comment"
              label={t('operator_comment')}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained" loading={createReq.isPending}>
            {t('create')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

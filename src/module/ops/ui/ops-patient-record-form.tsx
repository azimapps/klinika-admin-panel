import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { useGetDistricts } from '../hooks';

import type { IDistrict, IOpsRequestDetail, IOpsRequestUpdate } from '../types';

// ----------------------------------------------------------------------

const Schema = zod.object({
  birth_date: zod.string().optional(),
  sex: zod.string().optional(),
  extra_phone: zod.string().optional(),
  contact_person: zod.string().optional(),
  district_id: zod.coerce.number().optional(),
  street: zod.string().optional(),
  building: zod.string().optional(),
  apartment: zod.string().optional(),
  entrance: zod.string().optional(),
  floor: zod.string().optional(),
  landmark: zod.string().optional(),
  visit_at: zod.string().optional(),
  specialty: zod.string().optional(),
  urgency: zod.string().optional(),
  complaints: zod.string().optional(),
  temperature: zod.string().optional(),
  blood_pressure: zod.string().optional(),
  chronic_conditions: zod.string().optional(),
  allergies: zod.string().optional(),
  current_medication: zod.string().optional(),
  child_age: zod.string().optional(),
  num_children: zod.coerce.number().optional(),
  duration: zod.string().optional(),
  special_requirements: zod.string().optional(),
  price: zod.coerce.number().optional(),
  payment_method: zod.string().optional(),
  operator_comment: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

// ----------------------------------------------------------------------

function buildDefaults(request: IOpsRequestDetail): SchemaType {
  const str = (v: string | null | undefined) => v ?? '';
  return {
    birth_date: request.birth_date ? request.birth_date.slice(0, 10) : '',
    sex: str(request.sex),
    extra_phone: str(request.extra_phone),
    contact_person: str(request.contact_person),
    district_id: request.district_id ?? 0,
    street: str(request.street),
    building: str(request.building),
    apartment: str(request.apartment),
    entrance: str(request.entrance),
    floor: str(request.floor),
    landmark: str(request.landmark),
    visit_at: request.visit_at ? request.visit_at.slice(0, 16) : '',
    specialty: str(request.specialty),
    urgency: str(request.urgency),
    complaints: str(request.complaints),
    temperature: str(request.temperature),
    blood_pressure: str(request.blood_pressure),
    chronic_conditions: str(request.chronic_conditions),
    allergies: str(request.allergies),
    current_medication: str(request.current_medication),
    child_age: str(request.child_age),
    num_children: request.num_children ?? 0,
    duration: str(request.duration),
    special_requirements: str(request.special_requirements),
    price: request.amount ?? 0,
    payment_method: str(request.payment_method),
    operator_comment: str(request.operator_comment),
  };
}

/** Collapse empty strings to null and 0-selects to null for the PATCH payload. */
function toPayload(data: SchemaType): IOpsRequestUpdate {
  const nz = (v: string | undefined) => (v && v.trim() !== '' ? v.trim() : null);
  const num = (v: number | undefined) => (v && v > 0 ? v : null);

  return {
    birth_date: nz(data.birth_date),
    sex: (nz(data.sex) as IOpsRequestUpdate['sex']) ?? null,
    extra_phone: nz(data.extra_phone),
    contact_person: nz(data.contact_person),
    district_id: num(data.district_id),
    street: nz(data.street),
    building: nz(data.building),
    apartment: nz(data.apartment),
    entrance: nz(data.entrance),
    floor: nz(data.floor),
    landmark: nz(data.landmark),
    visit_at: nz(data.visit_at),
    specialty: nz(data.specialty),
    urgency: nz(data.urgency),
    complaints: nz(data.complaints),
    temperature: nz(data.temperature),
    blood_pressure: nz(data.blood_pressure),
    chronic_conditions: nz(data.chronic_conditions),
    allergies: nz(data.allergies),
    current_medication: nz(data.current_medication),
    child_age: nz(data.child_age),
    num_children: num(data.num_children),
    duration: nz(data.duration),
    special_requirements: nz(data.special_requirements),
    price: num(data.price),
    payment_method: (nz(data.payment_method) as IOpsRequestUpdate['payment_method']) ?? null,
    operator_comment: nz(data.operator_comment),
  };
}

// ----------------------------------------------------------------------

interface Props {
  request: IOpsRequestDetail;
  disabled?: boolean;
  isSaving: boolean;
  onSave: (data: IOpsRequestUpdate) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
      {children}
    </Typography>
  );
}

const grid = {
  rowGap: 2,
  columnGap: 2,
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
};

export function OpsPatientRecordForm({ request, disabled, isSaving, onSave }: Props) {
  const { t } = useTranslate('ops');
  const { data: districts = [] } = useGetDistricts();

  const defaults = useMemo(() => buildDefaults(request), [request]);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: defaults,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const onSubmit = handleSubmit((data) => onSave(toPayload(data)));

  const isNanny = request.service_type === 'nanny';

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 1 }}>
        {/* Patient */}
        <SectionTitle>{t('sec_patient')}</SectionTitle>
        <Box sx={grid}>
          <Field.Text
            name="birth_date"
            label={t('birth_date')}
            type="date"
            disabled={disabled}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Field.Select name="sex" label={t('sex')} disabled={disabled}>
            <MenuItem value="">—</MenuItem>
            <MenuItem value="male">{t('sex_male')}</MenuItem>
            <MenuItem value="female">{t('sex_female')}</MenuItem>
          </Field.Select>
          <Field.Text name="extra_phone" label={t('extra_phone')} disabled={disabled} />
          <Field.Text name="contact_person" label={t('contact_person')} disabled={disabled} />
        </Box>

        <Divider />

        {/* Address */}
        <SectionTitle>{t('sec_address')}</SectionTitle>
        <Box sx={grid}>
          <Field.Select name="district_id" label={t('district')} disabled={disabled}>
            <MenuItem value={0}>—</MenuItem>
            {districts.map((d: IDistrict) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name_uz}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text name="street" label={t('street')} disabled={disabled} />
          <Field.Text name="building" label={t('building')} disabled={disabled} />
          <Field.Text name="apartment" label={t('apartment')} disabled={disabled} />
          <Field.Text name="entrance" label={t('entrance')} disabled={disabled} />
          <Field.Text name="floor" label={t('floor')} disabled={disabled} />
        </Box>
        <Field.Text name="landmark" label={t('landmark')} disabled={disabled} />

        <Divider />

        {/* Visit */}
        <SectionTitle>{t('sec_visit')}</SectionTitle>
        <Box sx={grid}>
          <Field.Text
            name="visit_at"
            label={t('visit_at')}
            type="datetime-local"
            disabled={disabled}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Field.Text name="urgency" label={t('urgency')} disabled={disabled} />
        </Box>

        <Divider />

        {/* Medical */}
        <SectionTitle>{t('sec_medical')}</SectionTitle>
        <Box sx={grid}>
          <Field.Text name="specialty" label={t('specialty')} disabled={disabled} />
          <Field.Text name="temperature" label={t('temperature')} disabled={disabled} />
          <Field.Text name="blood_pressure" label={t('blood_pressure')} disabled={disabled} />
          <Field.Text name="allergies" label={t('allergies')} disabled={disabled} />
        </Box>
        <Field.Text
          name="complaints"
          label={t('complaints')}
          multiline
          rows={2}
          disabled={disabled}
        />
        <Field.Text
          name="chronic_conditions"
          label={t('chronic_conditions')}
          multiline
          rows={2}
          disabled={disabled}
        />
        <Field.Text name="current_medication" label={t('current_medication')} disabled={disabled} />

        {/* Nanny-specific */}
        {isNanny && (
          <>
            <Divider />
            <SectionTitle>{t('sec_nanny')}</SectionTitle>
            <Box sx={grid}>
              <Field.Text name="child_age" label={t('child_age')} disabled={disabled} />
              <Field.Text
                name="num_children"
                label={t('num_children')}
                type="number"
                disabled={disabled}
              />
              <Field.Text name="duration" label={t('duration')} disabled={disabled} />
            </Box>
            <Field.Text
              name="special_requirements"
              label={t('special_requirements')}
              multiline
              rows={2}
              disabled={disabled}
            />
          </>
        )}

        <Divider />

        {/* Payment + internal */}
        <SectionTitle>{t('sec_payment')}</SectionTitle>
        <Box sx={grid}>
          <Field.Text name="price" label={t('price')} type="number" disabled={disabled} />
          <Field.Select name="payment_method" label={t('payment_method')} disabled={disabled}>
            <MenuItem value="">—</MenuItem>
            <MenuItem value="cash">{t('method_cash')}</MenuItem>
            <MenuItem value="card">{t('method_card')}</MenuItem>
            <MenuItem value="click">{t('method_click')}</MenuItem>
            <MenuItem value="payme">{t('method_payme')}</MenuItem>
          </Field.Select>
        </Box>
        <Field.Text
          name="operator_comment"
          label={t('operator_comment')}
          multiline
          rows={2}
          disabled={disabled}
        />

        {!disabled && (
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSaving}
            sx={{ alignSelf: 'flex-end' }}
          >
            {t('save')}
          </LoadingButton>
        )}
      </Stack>
    </Form>
  );
}

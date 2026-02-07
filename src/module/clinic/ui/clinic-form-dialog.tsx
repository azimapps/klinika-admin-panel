import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';

import { useCreateClinic, useUpdateClinic } from '../hooks';

import type { IClinic } from '../types';

// ----------------------------------------------------------------------

const ClinicSchema = zod.object({
    title_uz: zod.string().min(1, { message: 'Nomi (UZ) majburiy!' }),
    title_ru: zod.string().min(1, { message: 'Nomi (RU) majburiy!' }),
    title_en: zod.string().min(1, { message: 'Nomi (EN) majburiy!' }),
    address_uz: zod.string().min(1, { message: 'Manzil (UZ) majburiy!' }),
    address_ru: zod.string().min(1, { message: 'Manzil (RU) majburiy!' }),
    address_en: zod.string().min(1, { message: 'Manzil (EN) majburiy!' }),
    lat: zod.number({ invalid_type_error: 'Kenglik raqam bo\'lishi kerak!' }),
    lon: zod.number({ invalid_type_error: 'Uzunlik raqam bo\'lishi kerak!' }),
});

type ClinicSchemaType = zod.infer<typeof ClinicSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: IClinic;
}

export function ClinicFormDialog({ open, onClose, currentRow }: Props) {
    // const { t } = useTranslate('clinic'); // Removed unused t

    const { mutateAsync: createClinic, isPending: createPending } = useCreateClinic();
    const { mutateAsync: updateClinic, isPending: updatePending } = useUpdateClinic(currentRow?.id?.toString() || '');

    const methods = useForm<ClinicSchemaType>({
        resolver: zodResolver(ClinicSchema),
        defaultValues: {
            title_uz: '',
            title_ru: '',
            title_en: '',
            address_uz: '',
            address_ru: '',
            address_en: '',
            lat: 0,
            lon: 0,
        },
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentRow) {
            reset({
                title_uz: currentRow.title_uz,
                title_ru: currentRow.title_ru,
                title_en: currentRow.title_en,
                address_uz: currentRow.address_uz,
                address_ru: currentRow.address_ru,
                address_en: currentRow.address_en,
                lat: currentRow.lat,
                lon: currentRow.lon,
            });
        } else {
            reset({
                title_uz: '',
                title_ru: '',
                title_en: '',
                address_uz: '',
                address_ru: '',
                address_en: '',
                lat: 0,
                lon: 0,
            });
        }
    }, [currentRow, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentRow) {
                await updateClinic(data);
            } else {
                await createClinic(data);
            }
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{currentRow ? 'Klinikani tahrirlash' : 'Yangi klinika'}</DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <Field.Text name="title_uz" label="Nomi (UZ)" />
                        <Field.Text name="title_ru" label="Nomi (RU)" />
                        <Field.Text name="title_en" label="Nomi (EN)" />

                        <Field.Text name="address_uz" label="Manzil (UZ)" />
                        <Field.Text name="address_ru" label="Manzil (RU)" />
                        <Field.Text name="address_en" label="Manzil (EN)" />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Field.Text name="lat" label="Latitude" type="number" />
                            <Field.Text name="lon" label="Longitude" type="number" />
                        </Stack>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Bekor qilish
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={createPending || updatePending || isSubmitting}>
                        Saqlash
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}

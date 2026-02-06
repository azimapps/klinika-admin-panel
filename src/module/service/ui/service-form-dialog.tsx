import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { useCreateService, useUpdateService, useUploadServiceImage } from '../hooks';

import type { IService } from '../types';

// ----------------------------------------------------------------------

const ServiceSchema = zod.object({
    title_uz: zod.string().min(1, { message: 'Sarlavha (UZ) majburiy!' }),
    title_ru: zod.string().min(1, { message: 'Sarlavha (RU) majburiy!' }),
    title_en: zod.string().min(1, { message: 'Sarlavha (EN) majburiy!' }),
    description_uz: zod.string().min(1, { message: 'Tavsif (UZ) majburiy!' }),
    description_ru: zod.string().min(1, { message: 'Tavsif (RU) majburiy!' }),
    description_en: zod.string().min(1, { message: 'Tavsif (EN) majburiy!' }),
    price: zod.number().min(0, { message: 'Narx 0 dan katta yoki teng bo\'lishi kerak!' }),
});

type ServiceSchemaType = zod.infer<typeof ServiceSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: IService;
}

export function ServiceFormDialog({ open, onClose, currentRow }: Props) {
    useTranslate('service'); // Assumes 'service' namespace exists in locales, otherwise defaults

    const { mutateAsync: createService, isPending: createPending } = useCreateService();
    const { mutateAsync: updateService, isPending: updatePending } = useUpdateService(currentRow?.id?.toString() || '');
    const { mutateAsync: uploadImage } = useUploadServiceImage(currentRow?.id?.toString() || '');

    const methods = useForm<ServiceSchemaType>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: {
            title_uz: '',
            title_ru: '',
            title_en: '',
            description_uz: '',
            description_ru: '',
            description_en: '',
            price: 0,
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
                description_uz: currentRow.description_uz,
                description_ru: currentRow.description_ru,
                description_en: currentRow.description_en,
                price: currentRow.price,
            });
        } else {
            reset({
                title_uz: '',
                title_ru: '',
                title_en: '',
                description_uz: '',
                description_ru: '',
                description_en: '',
                price: 0,
            });
        }
    }, [currentRow, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentRow) {
                await updateService(data);
            } else {
                await createService(data);
            }
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    const handleDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file && currentRow) {
                try {
                    await uploadImage(file);
                } catch (error) {
                    console.error(error);
                }
            }
        },
        [currentRow, uploadImage]
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{currentRow ? 'Xizmatni tahrirlash' : 'Yangi xizmat'}</DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <Field.Text name="title_uz" label="Sarlavha (UZ)" />
                            <Field.Text name="title_ru" label="Sarlavha (RU)" />
                            <Field.Text name="title_en" label="Sarlavha (EN)" />
                            <Field.Text name="price" label="Narxi (so'm)" type="number" />
                        </Box>

                        <Field.Text name="description_uz" label="Tavsif (UZ)" multiline rows={3} />
                        <Field.Text name="description_ru" label="Tavsif (RU)" multiline rows={3} />
                        <Field.Text name="description_en" label="Tavsif (EN)" multiline rows={3} />

                        {currentRow && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Rasm</Typography>
                                <Field.Upload
                                    name="image"
                                    thumbnail
                                    onDrop={handleDrop}
                                    value={currentRow.image}
                                    onRemove={() => { }}
                                />
                            </Box>
                        )}
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

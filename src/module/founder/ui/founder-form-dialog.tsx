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

import { useCreateFounder, useUpdateFounder, useUploadFounderAvatar } from '../hooks';

import type { IFounder } from '../types';

// ----------------------------------------------------------------------

const FounderSchema = zod.object({
    name_uz: zod.string().min(1, { message: 'Ism (UZ) majburiy!' }),
    name_ru: zod.string().min(1, { message: 'Ism (RU) majburiy!' }),
    name_en: zod.string().min(1, { message: 'Ism (EN) majburiy!' }),
    position_uz: zod.string().min(1, { message: 'Lavozim (UZ) majburiy!' }),
    position_ru: zod.string().min(1, { message: 'Lavozim (RU) majburiy!' }),
    position_en: zod.string().min(1, { message: 'Lavozim (EN) majburiy!' }),
    description_uz: zod.string().min(1, { message: 'Tavsif (UZ) majburiy!' }),
    description_ru: zod.string().min(1, { message: 'Tavsif (RU) majburiy!' }),
    description_en: zod.string().min(1, { message: 'Tavsif (EN) majburiy!' }),
    linked_url: zod.string().url({ message: "Noto'g'ri URL formati!" }).optional().or(zod.literal('')),
    avatar: zod.any().nullable().optional(),
});

type FounderSchemaType = zod.infer<typeof FounderSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: IFounder;
}

export function FounderFormDialog({ open, onClose, currentRow }: Props) {
    const { t } = useTranslate('founder');

    const { mutateAsync: createFounder, isPending: createPending } = useCreateFounder();
    const { mutateAsync: updateFounder, isPending: updatePending } = useUpdateFounder(currentRow?.id?.toString() || '');
    const { mutateAsync: uploadAvatar } = useUploadFounderAvatar();

    const methods = useForm<FounderSchemaType>({
        resolver: zodResolver(FounderSchema),
        defaultValues: {
            name_uz: '',
            name_ru: '',
            name_en: '',
            position_uz: '',
            position_ru: '',
            position_en: '',
            description_uz: '',
            description_ru: '',
            description_en: '',
            linked_url: '',
            avatar: null,
        },
    });

    const {
        reset,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentRow) {
            reset({
                name_uz: currentRow.name_uz,
                name_ru: currentRow.name_ru,
                name_en: currentRow.name_en,
                position_uz: currentRow.position_uz,
                position_ru: currentRow.position_ru,
                position_en: currentRow.position_en,
                description_uz: currentRow.description_uz,
                description_ru: currentRow.description_ru,
                description_en: currentRow.description_en,
                linked_url: currentRow.linked_url,
                avatar: currentRow.avatar,
            });
        } else {
            reset({
                name_uz: '',
                name_ru: '',
                name_en: '',
                position_uz: '',
                position_ru: '',
                position_en: '',
                description_uz: '',
                description_ru: '',
                description_en: '',
                linked_url: '',
                avatar: null,
            });
        }
    }, [currentRow, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const avatarFile = data.avatar instanceof File ? data.avatar : null;
            delete data.avatar;

            if (currentRow) {
                // We cast data to any or specific update type if needed to satisfy TS checks for now
                const updateData = { ...data, linked_url: data.linked_url || "" };
                await updateFounder(updateData);
                if (avatarFile) {
                    await uploadAvatar({ id: currentRow.id.toString(), file: avatarFile });
                }
            } else {
                const createData = { ...data, linked_url: data.linked_url || "" };
                const res = await createFounder(createData);
                if (avatarFile && res?.id) {
                    await uploadAvatar({ id: res.id.toString(), file: avatarFile });
                }
            }
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('avatar', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{currentRow ? t('edit') : t('add')}</DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(3, 1fr)',
                            }}
                        >
                            <Field.Text name="name_uz" label={t('name_uz')} />
                            <Field.Text name="name_ru" label={t('name_ru')} />
                            <Field.Text name="name_en" label={t('name_en')} />

                            <Field.Text name="position_uz" label={t('position_uz')} />
                            <Field.Text name="position_ru" label={t('position_ru')} />
                            <Field.Text name="position_en" label={t('position_en')} />
                        </Box>

                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <Field.Text name="description_uz" label={t('description_uz')} multiline rows={3} />
                            <Field.Text name="description_ru" label={t('description_ru')} multiline rows={3} />
                            <Field.Text name="description_en" label={t('description_en')} multiline rows={3} />

                            <Field.Text name="linked_url" label={t('linked_url')} />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, display: 'none' }}>{t('avatar')}</Typography>
                            <Field.UploadAvatar
                                name="avatar"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.disabled',
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {3}MB
                                    </Typography>
                                }
                            />
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        {t('cancel')}
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={createPending || updatePending || isSubmitting}>
                        {t('save')}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}

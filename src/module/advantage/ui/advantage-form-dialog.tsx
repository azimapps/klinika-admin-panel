import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
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
import { CustomTabs } from 'src/components/custom-tabs';

import { useCreateAdvantage, useUpdateAdvantage, useUploadAdvantageImage } from '../hooks';

import type { IAdvantage } from '../types';

// ----------------------------------------------------------------------

const AdvantageSchema = zod.object({
    title_uz: zod.string().min(1, { message: 'Sarlavha (UZ) majburiy!' }),
    title_ru: zod.string().min(1, { message: 'Sarlavha (RU) majburiy!' }),
    title_en: zod.string().min(1, { message: 'Sarlavha (EN) majburiy!' }),
    description_uz: zod.string().min(1, { message: 'Tavsif (UZ) majburiy!' }),
    description_ru: zod.string().min(1, { message: 'Tavsif (RU) majburiy!' }),
    description_en: zod.string().min(1, { message: 'Tavsif (EN) majburiy!' }),
    image: zod.any().nullable().optional(),
});

type AdvantageSchemaType = zod.infer<typeof AdvantageSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: IAdvantage;
}

export function AdvantageFormDialog({ open, onClose, currentRow }: Props) {
    const { t } = useTranslate('advantage');

    const [currentTab, setCurrentTab] = useState('uz');

    const { mutateAsync: createAdvantage, isPending: createPending } = useCreateAdvantage();
    const { mutateAsync: updateAdvantage, isPending: updatePending } = useUpdateAdvantage(currentRow?.id?.toString() || '');
    const { mutateAsync: uploadImage } = useUploadAdvantageImage();

    const methods = useForm<AdvantageSchemaType>({
        resolver: zodResolver(AdvantageSchema),
        defaultValues: {
            title_uz: '',
            title_ru: '',
            title_en: '',
            description_uz: '',
            description_ru: '',
            description_en: '',
            image: null,
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
                title_uz: currentRow.title_uz,
                title_ru: currentRow.title_ru,
                title_en: currentRow.title_en,
                description_uz: currentRow.description_uz,
                description_ru: currentRow.description_ru,
                description_en: currentRow.description_en,
                image: currentRow.image,
            });
        } else {
            reset({
                title_uz: '',
                title_ru: '',
                title_en: '',
                description_uz: '',
                description_ru: '',
                description_en: '',
                image: null,
            });
        }
    }, [currentRow, reset]);

    const handleChangeTab = useCallback((event: any, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const imageFile = data.image instanceof File ? data.image : null;
            delete data.image;

            if (currentRow) {
                await updateAdvantage(data);
                if (imageFile) {
                    await uploadImage({ id: currentRow.id.toString(), file: imageFile });
                }
            } else {
                const res = await createAdvantage(data);
                if (imageFile && res?.id) {
                    await uploadImage({ id: res.id.toString(), file: imageFile });
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
                setValue('image', newFile, { shouldValidate: true });
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
                        <CustomTabs value={currentTab} onChange={handleChangeTab}>
                            <Tab value="uz" label="O'zbekcha" />
                            <Tab value="ru" label="Русский" />
                            <Tab value="en" label="English" />
                        </CustomTabs>

                        <Box sx={{ display: currentTab === 'uz' ? 'block' : 'none' }}>
                            <Stack spacing={3}>
                                <Field.Text name="title_uz" label={t('title_uz')} />
                                <Field.Text name="description_uz" label={t('description_uz')} multiline rows={3} />
                            </Stack>
                        </Box>

                        <Box sx={{ display: currentTab === 'ru' ? 'block' : 'none' }}>
                            <Stack spacing={3}>
                                <Field.Text name="title_ru" label={t('title_ru')} />
                                <Field.Text name="description_ru" label={t('description_ru')} multiline rows={3} />
                            </Stack>
                        </Box>

                        <Box sx={{ display: currentTab === 'en' ? 'block' : 'none' }}>
                            <Stack spacing={3}>
                                <Field.Text name="title_en" label={t('title_en')} />
                                <Field.Text name="description_en" label={t('description_en')} multiline rows={3} />
                            </Stack>
                        </Box>

                        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('image')}</Typography>
                            <Field.Upload
                                name="image"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                onRemove={() => setValue('image', null)}
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

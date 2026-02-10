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

import { useCreateService, useUpdateService, useUploadServiceImage } from '../hooks';

import type { IService } from '../types';

// ----------------------------------------------------------------------

const ServiceSchema = zod.object({
    title_uz: zod.string().min(1, { message: 'Title (UZ) is required!' }),
    title_ru: zod.string().min(1, { message: 'Title (RU) is required!' }),
    title_en: zod.string().min(1, { message: 'Title (EN) is required!' }),
    description_uz: zod.string().min(1, { message: 'Description (UZ) is required!' }),
    description_ru: zod.string().min(1, { message: 'Description (RU) is required!' }),
    description_en: zod.string().min(1, { message: 'Description (EN) is required!' }),
    price: zod.coerce.number().min(1, { message: 'Narx majburiy!' }),
});

type ServiceSchemaType = zod.infer<typeof ServiceSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: IService;
}

export function ServiceFormDialog({ open, onClose, currentRow }: Props) {
    const { t } = useTranslate('service');

    const [currentTab, setCurrentTab] = useState('uz');

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
            price: '' as any,
        },
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;

    const TABS = [
        {
            value: 'uz',
            label: "O'zbekcha",
            hasError: !!errors.title_uz || !!errors.description_uz,
        },
        {
            value: 'ru',
            label: 'Русский',
            hasError: !!errors.title_ru || !!errors.description_ru,
        },
        {
            value: 'en',
            label: 'English',
            hasError: !!errors.title_en || !!errors.description_en,
        },
    ];

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
                price: '' as any,
            });
        }
    }, [currentRow, reset]);

    const handleChangeTab = useCallback((event: any, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

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
                <DialogTitle>{currentRow ? t('edit_title') : t('create_title')}</DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <CustomTabs value={currentTab} onChange={handleChangeTab}>
                            {TABS.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    value={tab.value}
                                    label={tab.label}
                                    sx={{
                                        ...(tab.hasError && {
                                            color: 'error.main',
                                            '&.Mui-selected': {
                                                color: 'error.main',
                                            },
                                        }),
                                    }}
                                />
                            ))}
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

                        <Field.Text name="price" label={t('price')} type="number" />

                        {currentRow && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('image')}</Typography>
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

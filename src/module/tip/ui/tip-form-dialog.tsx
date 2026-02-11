import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
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

import { useCreateTip, useUpdateTip, useUploadTipImage } from '../hooks';

import type { ITip } from '../types';

// ----------------------------------------------------------------------

// Define schema shape but use t() inside component for messages if possible.
// Or define a function to get schema with localized messages.
// For now, to keep it simple and consistent with other modules (which seem to use hardcoded strings in schema or passed from outside),
// we will verify if we can use dynamic schema.
// Since zod schema is usually static, we can recreate it inside the component or use t() directly if we put schema creation inside component scope.

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: ITip;
}

export function TipFormDialog({ open, onClose, currentRow }: Props) {
    const { t } = useTranslate('tip');

    const TipSchema = useMemo(() => zod.object({
        title_uz: zod.string().min(1, { message: t('title_uz_required') }),
        title_ru: zod.string().min(1, { message: t('title_ru_required') }),
        title_en: zod.string().min(1, { message: t('title_en_required') }),
        description_uz: zod.string().min(1, { message: t('description_uz_required') }),
        description_ru: zod.string().min(1, { message: t('description_ru_required') }),
        description_en: zod.string().min(1, { message: t('description_en_required') }),
        order: zod.coerce.number(),
        is_active: zod.boolean(),
        image: zod.any().nullable().optional(),
    }), [t]);

    // We need to infer type from the schema instance or define it compatible
    type TipSchemaType = zod.infer<typeof TipSchema>;

    const [currentTab, setCurrentTab] = useState('uz');

    const { mutateAsync: createTip, isPending: createPending } = useCreateTip();
    const { mutateAsync: updateTip, isPending: updatePending } = useUpdateTip();
    const { mutateAsync: uploadImage } = useUploadTipImage();

    const defaultValues = useMemo(() => ({
        title_uz: currentRow?.title_uz || '',
        title_ru: currentRow?.title_ru || '',
        title_en: currentRow?.title_en || '',
        description_uz: currentRow?.description_uz || '',
        description_ru: currentRow?.description_ru || '',
        description_en: currentRow?.description_en || '',
        order: currentRow?.order || 0,
        is_active: currentRow?.is_active ?? true,
        image: currentRow?.image || null,
    }), [currentRow]);

    const methods = useForm<TipSchemaType>({
        resolver: zodResolver(TipSchema),
        defaultValues,
    });

    const {
        reset,
        setValue,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, [currentRow, reset, defaultValues]);

    const handleChangeTab = useCallback((event: any, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const imageFile = data.image instanceof File ? data.image : null;
            // Remove image from data sent to create/update endpoint as it's handled separately
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { image: _image, ...rest } = data;

            if (currentRow) {
                await updateTip({ id: currentRow.id.toString(), data: rest });
                if (imageFile) {
                    await uploadImage({ id: currentRow.id, file: imageFile });
                }
            } else {
                const res = await createTip(rest);
                if (imageFile && res?.id) {
                    await uploadImage({ id: res.id, file: imageFile });
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

    const TABS = [
        { value: 'uz', label: "O'zbekcha", hasError: !!errors.title_uz || !!errors.description_uz },
        { value: 'ru', label: 'Русский', hasError: !!errors.title_ru || !!errors.description_ru },
        { value: 'en', label: 'English', hasError: !!errors.title_en || !!errors.description_en },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{currentRow ? t('edit') : t('add')}</DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <Tabs value={currentTab} onChange={handleChangeTab}>
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
                        </Tabs>

                        {currentTab === 'uz' && (
                            <Stack spacing={2}>
                                <Field.Text name="title_uz" label={t('title_uz')} />
                                <Field.Text name="description_uz" label={t('description_uz')} multiline rows={4} />
                            </Stack>
                        )}

                        {currentTab === 'ru' && (
                            <Stack spacing={2}>
                                <Field.Text name="title_ru" label={t('title_ru')} />
                                <Field.Text name="description_ru" label={t('description_ru')} multiline rows={4} />
                            </Stack>
                        )}

                        {currentTab === 'en' && (
                            <Stack spacing={2}>
                                <Field.Text name="title_en" label={t('title_en')} />
                                <Field.Text name="description_en" label={t('description_en')} multiline rows={4} />
                            </Stack>
                        )}

                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <Field.Text name="order" label={t('order')} type="number" />
                            <Field.Switch name="is_active" label={t('is_active')} />
                        </Box>

                        <Box sx={{ mb: 5 }}>
                            <Field.Upload
                                name="image"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                onDelete={() => setValue('image', null, { shouldValidate: true })}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 2,
                                    mx: 'auto',
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.disabled',
                                }}
                            >
                                {t('upload_allowed')}
                                <br /> {t('max_size')}
                            </Typography>
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

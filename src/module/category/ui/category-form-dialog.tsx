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

import { useCreateCategory, useUpdateCategory, useUploadCategoryAvatar } from '../hooks';

import type { ICategory } from '../types';

// ----------------------------------------------------------------------

const CategorySchema = zod.object({
    title_uz: zod.string().min(1, { message: 'Sarlavha (UZ) majburiy!' }),
    title_ru: zod.string().min(1, { message: 'Sarlavha (RU) majburiy!' }),
    title_en: zod.string().min(1, { message: 'Sarlavha (EN) majburiy!' }),
});

type CategorySchemaType = zod.infer<typeof CategorySchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: ICategory;
}

export function CategoryFormDialog({ open, onClose, currentRow }: Props) {
    const { t } = useTranslate('category');

    const { mutateAsync: createCategory, isPending: createPending } = useCreateCategory();
    const { mutateAsync: updateCategory, isPending: updatePending } = useUpdateCategory(currentRow?.id?.toString() || '');
    const { mutateAsync: uploadAvatar } = useUploadCategoryAvatar(currentRow?.id?.toString() || '');

    const methods = useForm<CategorySchemaType>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            title_uz: '',
            title_ru: '',
            title_en: '',
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
            });
        } else {
            reset({
                title_uz: '',
                title_ru: '',
                title_en: '',
            });
        }
    }, [currentRow, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentRow) {
                await updateCategory(data);
            } else {
                await createCategory(data);
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
                    await uploadAvatar(file);
                } catch (error) {
                    console.error(error);
                }
            }
        },
        [currentRow, uploadAvatar]
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{currentRow ? t('edit') : t('add')}</DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <Field.Text name="title_uz" label={t('title_uz')} />
                        <Field.Text name="title_ru" label={t('title_ru')} />
                        <Field.Text name="title_en" label={t('title_en')} />

                        {currentRow && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('avatar')}</Typography>
                                <Field.Upload
                                    name="avatar"
                                    thumbnail
                                    onDrop={handleDrop}
                                    value={currentRow.avatar}
                                    onRemove={() => { }} // Not implemented in API
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

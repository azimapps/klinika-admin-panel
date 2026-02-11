import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { useCreateNotification } from '../hooks';

// ----------------------------------------------------------------------

interface Props {
    open: boolean;
    onClose: () => void;
}

export function NotificationFormDialog({ open, onClose }: Props) {
    const { t } = useTranslate('notification');
    const [currentTab, setCurrentTab] = useState('uz');
    const { mutateAsync: createNotification, isPending } = useCreateNotification();

    const NotificationSchema = useMemo(() => zod.object({
        title_uz: zod.string().min(1, { message: t('title_uz_required') }),
        title_ru: zod.string().min(1, { message: t('title_ru_required') }),
        title_en: zod.string().optional(),
        body_uz: zod.string().min(1, { message: t('body_uz_required') }),
        body_ru: zod.string().min(1, { message: t('body_ru_required') }),
        body_en: zod.string().optional(),
    }), [t]);

    type NotificationSchemaType = zod.infer<typeof NotificationSchema>;

    const defaultValues = {
        title_uz: '',
        title_ru: '',
        title_en: '',
        body_uz: '',
        body_ru: '',
        body_en: '',
    };

    const methods = useForm<NotificationSchemaType>({
        resolver: zodResolver(NotificationSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { errors },
    } = methods;

    const handleChangeTab = useCallback((event: any, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createNotification(data);
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    const TABS = [
        { value: 'uz', label: "O'zbekcha", hasError: !!errors.title_uz || !!errors.body_uz },
        { value: 'ru', label: 'Русский', hasError: !!errors.title_ru || !!errors.body_ru },
        { value: 'en', label: 'English', hasError: !!errors.title_en || !!errors.body_en },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{t('create_title')}</DialogTitle>

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
                                <Field.Text name="body_uz" label={t('body_uz')} multiline rows={4} />
                            </Stack>
                        )}

                        {currentTab === 'ru' && (
                            <Stack spacing={2}>
                                <Field.Text name="title_ru" label={t('title_ru')} />
                                <Field.Text name="body_ru" label={t('body_ru')} multiline rows={4} />
                            </Stack>
                        )}

                        {currentTab === 'en' && (
                            <Stack spacing={2}>
                                <Field.Text name="title_en" label={t('title_en')} />
                                <Field.Text name="body_en" label={t('body_en')} multiline rows={4} />
                            </Stack>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        {t('cancel')}
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isPending}>
                        {t('send')}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}

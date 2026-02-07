import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';
import { CustomTabs } from 'src/components/custom-tabs';

import { useCreateFAQ, useUpdateFAQ } from '../hooks';

import type { IFAQ } from '../types';

// ----------------------------------------------------------------------

const FAQSchema = zod.object({
    question_uz: zod.string().min(1, { message: 'Required!' }),
    question_ru: zod.string().min(1, { message: 'Required!' }),
    question_en: zod.string().min(1, { message: 'Required!' }),
    answer_uz: zod.string().min(1, { message: 'Required!' }),
    answer_ru: zod.string().min(1, { message: 'Required!' }),
    answer_en: zod.string().min(1, { message: 'Required!' }),
});

type FAQSchemaType = zod.infer<typeof FAQSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: IFAQ;
}

export function FAQFormDialog({ open, onClose, currentRow }: Props) {
    const { t } = useTranslate('faq');

    const [currentTab, setCurrentTab] = useState('uz');

    const { mutateAsync: createFAQ, isPending: createPending } = useCreateFAQ();
    const { mutateAsync: updateFAQ, isPending: updatePending } = useUpdateFAQ(currentRow?.id?.toString() || '');

    const methods = useForm<FAQSchemaType>({
        resolver: zodResolver(FAQSchema),
        defaultValues: {
            question_uz: '',
            question_ru: '',
            question_en: '',
            answer_uz: '',
            answer_ru: '',
            answer_en: '',
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
                question_uz: currentRow.question_uz,
                question_ru: currentRow.question_ru,
                question_en: currentRow.question_en,
                answer_uz: currentRow.answer_uz,
                answer_ru: currentRow.answer_ru,
                answer_en: currentRow.answer_en,
            });
        } else {
            reset({
                question_uz: '',
                question_ru: '',
                question_en: '',
                answer_uz: '',
                answer_ru: '',
                answer_en: '',
            });
        }
    }, [currentRow, reset]);

    const handleChangeTab = useCallback((event: any, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentRow) {
                await updateFAQ(data);
                onClose();
                reset();
            } else {
                await createFAQ(data);
                onClose();
                reset();
            }
        } catch (error) {
            console.error(error);
        }
    });

    const onSaveAndAdd = handleSubmit(async (data) => {
        try {
            await createFAQ(data);
            reset({
                question_uz: '',
                question_ru: '',
                question_en: '',
                answer_uz: '',
                answer_ru: '',
                answer_en: '',
            });
            setCurrentTab('uz'); // Reset to first tab
        } catch (error) {
            console.error(error);
        }
    });

    const TABS = [
        { value: 'uz', label: 'O\'zbekcha' },
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{currentRow ? t('edit_title') : t('create_title')}</DialogTitle>

                <DialogContent>
                    <CustomTabs
                        value={currentTab}
                        onChange={handleChangeTab}
                        sx={{ mb: 3 }}
                    >
                        {TABS.map((tab) => (
                            <Tab key={tab.value} value={tab.value} label={tab.label} />
                        ))}
                    </CustomTabs>

                    <Stack spacing={3}>
                        <Box sx={{ display: currentTab === 'uz' ? 'block' : 'none' }}>
                            <Stack spacing={3}>
                                <Field.Text name="question_uz" label={t('question_uz')} multiline rows={2} />
                                <Field.Text name="answer_uz" label={t('answer_uz')} multiline rows={3} />
                            </Stack>
                        </Box>

                        <Box sx={{ display: currentTab === 'ru' ? 'block' : 'none' }}>
                            <Stack spacing={3}>
                                <Field.Text name="question_ru" label={t('question_ru')} multiline rows={2} />
                                <Field.Text name="answer_ru" label={t('answer_ru')} multiline rows={3} />
                            </Stack>
                        </Box>

                        <Box sx={{ display: currentTab === 'en' ? 'block' : 'none' }}>
                            <Stack spacing={3}>
                                <Field.Text name="question_en" label={t('question_en')} multiline rows={2} />
                                <Field.Text name="answer_en" label={t('answer_en')} multiline rows={3} />
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        {t('cancel')}
                    </Button>

                    {!currentRow && (
                        <LoadingButton
                            type="button"
                            variant="outlined"
                            loading={createPending || isSubmitting}
                            onClick={onSaveAndAdd}
                        >
                            {t('save_and_add')}
                        </LoadingButton>
                    )}

                    <LoadingButton type="submit" variant="contained" loading={createPending || updatePending || isSubmitting}>
                        {t('save')}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}

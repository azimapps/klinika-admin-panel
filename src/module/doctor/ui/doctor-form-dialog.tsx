import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';
import { CustomTabs } from 'src/components/custom-tabs';

import { useGetCategories } from 'src/module/category/hooks';

import { useCreateDoctor, useUpdateDoctor, useUploadDoctorAvatar } from '../hooks';

import type { IDoctor } from '../types';

// ----------------------------------------------------------------------

const DoctorSchema = zod.object({
    fullname_uz: zod.string().min(1, { message: 'F.I.SH (UZ) majburiy!' }),
    fullname_ru: zod.string().min(1, { message: 'F.I.SH (RU) majburiy!' }),
    fullname_en: zod.string().min(1, { message: 'F.I.SH (EN) majburiy!' }),
    phone_number: zod.string().min(1, { message: 'Telefon raqam majburiy!' }),
    price: zod.coerce.number().min(1, { message: 'Narx majburiy!' }),
    experience: zod.coerce.number().min(0, { message: 'Tajriba noto\'g\'ri!' }),
    category_id: zod.coerce.number().min(1, { message: 'Kategoriya tanlanishi shart!' }),
    is_active: zod.boolean(),
    avatar: zod.any().nullable().optional(),
});

type DoctorSchemaType = zod.infer<typeof DoctorSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: IDoctor;
}

export function DoctorFormDialog({ open, onClose, currentRow }: Props) {
    const { t } = useTranslate('doctor');

    const [currentTab, setCurrentTab] = useState('uz');

    const { data: categories = [] } = useGetCategories();

    const { mutateAsync: createDoctor, isPending: createPending } = useCreateDoctor();
    const { mutateAsync: updateDoctor, isPending: updatePending } = useUpdateDoctor(currentRow?.id?.toString() || '');
    const { mutateAsync: uploadAvatar } = useUploadDoctorAvatar();

    const methods = useForm<DoctorSchemaType>({
        resolver: zodResolver(DoctorSchema),
        defaultValues: {
            fullname_uz: '',
            fullname_ru: '',
            fullname_en: '',
            phone_number: '',
            price: '' as any,
            experience: '' as any,
            category_id: 0,
            is_active: true,
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
                fullname_uz: currentRow.fullname_uz,
                fullname_ru: currentRow.fullname_ru,
                fullname_en: currentRow.fullname_en,
                phone_number: currentRow.phone_number,
                price: currentRow.price,
                experience: currentRow.experience,
                category_id: currentRow.category_id,
                is_active: currentRow.is_active,
                avatar: currentRow.avatar,
            });
        } else {
            reset({
                fullname_uz: '',
                fullname_ru: '',
                fullname_en: '',
                phone_number: '',
                price: '' as any,
                experience: '' as any,
                category_id: 0,
                is_active: true,
                avatar: null,
            });
        }
    }, [currentRow, reset]);

    const handleChangeTab = useCallback((event: any, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const avatarFile = data.avatar instanceof File ? data.avatar : null;
            delete data.avatar;

            if (currentRow) {
                await updateDoctor(data);
                if (avatarFile) {
                    await uploadAvatar({ id: currentRow.id.toString(), file: avatarFile });
                }
            } else {
                const res = await createDoctor(data);
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

    const TABS = [
        { value: 'uz', label: 'O\'zbekcha' },
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{currentRow ? t('edit') : t('add')}</DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <CustomTabs value={currentTab} onChange={handleChangeTab}>
                            {TABS.map((tab) => (
                                <Tab key={tab.value} value={tab.value} label={tab.label} />
                            ))}
                        </CustomTabs>

                        <Box sx={{ display: currentTab === 'uz' ? 'block' : 'none' }}>
                            <Field.Text name="fullname_uz" label={t('fullname_uz')} />
                        </Box>

                        <Box sx={{ display: currentTab === 'ru' ? 'block' : 'none' }}>
                            <Field.Text name="fullname_ru" label={t('fullname_ru')} />
                        </Box>

                        <Box sx={{ display: currentTab === 'en' ? 'block' : 'none' }}>
                            <Field.Text name="fullname_en" label={t('fullname_en')} />
                        </Box>

                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <Field.Text name="phone_number" label={t('phone_number')} />

                            <Field.Text name="price" label={t('price')} type="number" />
                            <Field.Text name="experience" label={t('experience')} type="number" />

                            <Field.Select name="category_id" label={t('category')}>
                                <MenuItem value={0} disabled>Tanlang...</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.title_uz}
                                    </MenuItem>
                                ))}
                            </Field.Select>

                            <Field.Switch name="is_active" label={t('is_active')} />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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

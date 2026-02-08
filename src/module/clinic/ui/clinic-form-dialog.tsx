import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import { YMaps, Placemark, Map as YMap } from '@pbe/react-yandex-maps';

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

import { Form, Field } from 'src/components/hook-form';
import { CustomTabs } from 'src/components/custom-tabs';

import { MapSelectionDialog } from './map-selection-dialog';
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
    lat: zod.coerce.number({ invalid_type_error: 'Kenglik raqam bo\'lishi kerak!' }),
    lon: zod.coerce.number({ invalid_type_error: 'Uzunlik raqam bo\'lishi kerak!' }),
});

type ClinicSchemaType = zod.infer<typeof ClinicSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    currentRow?: IClinic;
}

export function ClinicFormDialog({ open, onClose, currentRow }: Props) {
    const [currentTab, setCurrentTab] = useState('uz');

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
            lat: '' as any,
            lon: '' as any,
        },
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

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
                lat: '' as any,
                lon: '' as any,
            });
        }
    }, [currentRow, reset]);

    const handleChangeTab = useCallback((event: any, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    const TABS = [
        { value: 'uz', label: 'O\'zbekcha' },
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' },
    ];

    const [openMap, setOpenMap] = useState(false);

    const handleOpenMap = useCallback(() => {
        setOpenMap(true);
    }, []);

    const handleCloseMap = useCallback(() => {
        setOpenMap(false);
    }, []);

    const handleSelectLocation = useCallback((coords: [number, number], addresses: { uz: string; ru: string; en: string }) => {
        setValue('lat', coords[0], { shouldValidate: true });
        setValue('lon', coords[1], { shouldValidate: true });
        if (addresses.uz) setValue('address_uz', addresses.uz, { shouldValidate: true });
        if (addresses.ru) setValue('address_ru', addresses.ru, { shouldValidate: true });
        if (addresses.en) setValue('address_en', addresses.en, { shouldValidate: true });
    }, [setValue]);

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
                    <Box
                        display="grid"
                        gap={3}
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            md: '320px 1fr',
                        }}
                        sx={{ mt: 2 }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="subtitle2">Joylashuv</Typography>
                            <Box
                                onClick={handleOpenMap}
                                sx={{
                                    height: 200,
                                    width: 1,
                                    borderRadius: 1.5,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    '&:hover': { opacity: 0.8 },
                                }}
                            >
                                <YMaps>
                                    <YMap
                                        width="100%"
                                        height="100%"
                                        state={{
                                            center: [values.lat || 41.2995, values.lon || 69.2401],
                                            zoom: values.lat ? 14 : 11,
                                        }}
                                        options={{
                                            suppressMapOpenBlock: true,
                                        }}
                                    >
                                        {values.lat && values.lon && (
                                            <Placemark geometry={[values.lat, values.lon]} />
                                        )}
                                    </YMap>
                                </YMaps>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: 1,
                                        p: 1,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography variant="caption" fontWeight="bold">
                                        TANLANGAN MANZIL
                                    </Typography>
                                    <Typography variant="caption" display="block" noWrap>
                                        {values.address_uz || 'Manzilni tanlang'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Field.Text name="lat" label="Lat" type="number" size="small" disabled />
                                <Field.Text name="lon" label="Lon" type="number" size="small" disabled />
                            </Stack>
                        </Stack>

                        <Stack spacing={3}>
                            <CustomTabs value={currentTab} onChange={handleChangeTab}>
                                {TABS.map((tab) => (
                                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                                ))}
                            </CustomTabs>

                            <Box sx={{ display: currentTab === 'uz' ? 'block' : 'none' }}>
                                <Stack spacing={3}>
                                    <Field.Text name="title_uz" label="Nomi (UZ) 🇺🇿" />
                                    <Field.Text name="address_uz" label="Manzil (UZ) 🇺🇿" multiline rows={2} />
                                </Stack>
                            </Box>

                            <Box sx={{ display: currentTab === 'ru' ? 'block' : 'none' }}>
                                <Stack spacing={3}>
                                    <Field.Text name="title_ru" label="Nomi (RU) 🇷🇺" />
                                    <Field.Text name="address_ru" label="Manzil (RU) 🇷🇺" multiline rows={2} />
                                </Stack>
                            </Box>

                            <Box sx={{ display: currentTab === 'en' ? 'block' : 'none' }}>
                                <Stack spacing={3}>
                                    <Field.Text name="title_en" label="Nomi (EN) 🇺🇸" />
                                    <Field.Text name="address_en" label="Manzil (EN) 🇺🇸" multiline rows={2} />
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                </DialogContent>

                <MapSelectionDialog
                    open={openMap}
                    onClose={handleCloseMap}
                    onSelect={handleSelectLocation}
                    initialCoords={values.lat && values.lon ? [values.lat, values.lon] : undefined}
                />

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Bekor qilish
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={createPending || updatePending || isSubmitting}>
                        Saqlash
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog >
    );
}

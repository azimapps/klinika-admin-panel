import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useGetDoctors, useGetDoctorSchedule, useUpdateDoctorSchedule } from '../hooks';

import type { IDoctorScheduleSlot } from '../types';

// ----------------------------------------------------------------------

const DAYS = [
  { value: 0, label_uz: 'DUSHANBA', label_en: 'MONDAY', label_ru: 'ПОНЕДЕЛЬНИК' },
  { value: 1, label_uz: 'SESHANBA', label_en: 'TUESDAY', label_ru: 'ВТОРНИК' },
  { value: 2, label_uz: 'CHORSHANBA', label_en: 'WEDNESDAY', label_ru: 'СРЕДА' },
  { value: 3, label_uz: 'PAYSHANBA', label_en: 'THURSDAY', label_ru: 'ЧЕТВЕРГ' },
  { value: 4, label_uz: 'JUMA', label_en: 'FRIDAY', label_ru: 'ПЯТНИЦА' },
  { value: 5, label_uz: 'SHANBA', label_en: 'SATURDAY', label_ru: 'СУББОТА' },
  { value: 6, label_uz: 'YAKSHANBA', label_en: 'SUNDAY', label_ru: 'ВОСКРЕСЕНЬЕ' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const DEFAULT_SLOTS = HOURS.slice(9, 19); // 09:00 to 18:00

export function DoctorScheduleView() {
  const { t, currentLang } = useTranslate('doctor');
  const { data: doctors = [] } = useGetDoctors();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [localSchedules, setLocalSchedules] = useState<IDoctorScheduleSlot[]>([]);

  const { data: scheduleData } = useGetDoctorSchedule(selectedDoctorId);
  const { mutateAsync: updateSchedule, isPending: updatePending } =
    useUpdateDoctorSchedule(selectedDoctorId);

  useEffect(() => {
    if (scheduleData && scheduleData.length > 0) {
      setLocalSchedules(scheduleData.map((s) => ({ day_of_week: s.day_of_week, slots: s.slots })));
    } else if (selectedDoctorId) {
      const defaultSchedules = DAYS.map((day) => ({
        day_of_week: day.value,
        slots: DEFAULT_SLOTS,
      }));
      setLocalSchedules(defaultSchedules);
    } else {
      setLocalSchedules([]);
    }
  }, [scheduleData, selectedDoctorId]);

  const handleToggleSlot = (dayIndex: number, slot: string) => {
    const daySchedule = localSchedules.find((s) => s.day_of_week === dayIndex);

    if (daySchedule) {
      const isSelected = daySchedule.slots.includes(slot);
      const updatedSlots = isSelected
        ? daySchedule.slots.filter((s) => s !== slot)
        : [...daySchedule.slots, slot].sort();

      const updatedSchedules = localSchedules.map((s) =>
        s.day_of_week === dayIndex ? { ...s, slots: updatedSlots } : s
      );
      setLocalSchedules(updatedSchedules);
    } else {
      setLocalSchedules([...localSchedules, { day_of_week: dayIndex, slots: [slot] }]);
    }
  };

  const handleSelectAllDay = (dayIndex: number) => {
    const updatedSchedules = localSchedules.filter((s) => s.day_of_week !== dayIndex);
    updatedSchedules.push({ day_of_week: dayIndex, slots: [...HOURS] });
    setLocalSchedules(updatedSchedules);
  };

  const handleClearDay = (dayIndex: number) => {
    const updatedSchedules = localSchedules.map((s) =>
      s.day_of_week === dayIndex ? { ...s, slots: [] } : s
    );
    setLocalSchedules(updatedSchedules);
  };

  const handleSave = async () => {
    try {
      const finalSchedules = localSchedules.filter((s) => s.slots.length > 0);
      await updateSchedule(finalSchedules);
    } catch (error) {
      console.error(error);
    }
  };

  const getDayLabel = (day: (typeof DAYS)[0]) => {
    if (currentLang.value === 'uz') return day.label_uz;
    if (currentLang.value === 'ru') return day.label_ru;
    return day.label_en;
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('schedule.title')}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: t('doctors'), href: paths.dashboard.doctor.list },
          { name: t('schedule.title') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={4}>
        <Card sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl fullWidth sx={{ maxWidth: 400 }}>
              <InputLabel id="doctor-select-label">SHIFOKORNI TANLANG</InputLabel>
              <Select
                labelId="doctor-select-label"
                value={selectedDoctorId}
                label="SHIFOKORNI TANLANG"
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id.toString()}>
                    {(doctor as any)[`fullname_${currentLang.value}`] || doctor.fullname_uz}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />

            <LoadingButton
              variant="contained"
              size="large"
              onClick={handleSave}
              loading={updatePending}
              disabled={!selectedDoctorId}
              sx={{
                px: 4,
                height: 56,
                borderRadius: 1.5,
                boxShadow: (theme: any) => `0 8px 16px 0 ${theme.palette.primary.main}33`,
              }}
            >
              SAQLASH
            </LoadingButton>
          </Stack>
        </Card>

        {selectedDoctorId && (
          <Stack spacing={3}>
            {DAYS.map((day) => {
              const daySchedule = localSchedules.find((s) => s.day_of_week === day.value);
              const selectedSlots = daySchedule?.slots || [];

              return (
                <Card key={day.value}>
                  <CardHeader
                    title={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="solar:calendar-date-bold" width={24} />
                        <Typography variant="h6">{getDayLabel(day)}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          ISH SOATLARINI TANLANG
                        </Typography>
                      </Stack>
                    }
                    action={
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="soft"
                          color="info"
                          onClick={() => handleSelectAllDay(day.value)}
                        >
                          HAMMA SOATLAR
                        </Button>
                        <Button
                          size="small"
                          variant="soft"
                          color="error"
                          onClick={() => handleClearDay(day.value)}
                        >
                          TOZALASH
                        </Button>
                      </Stack>
                    }
                  />
                  <CardContent>
                    <Grid container spacing={1.5}>
                      {HOURS.map((hour) => {
                        const isSelected = selectedSlots.includes(hour);
                        return (
                          <Grid size={{ xs: 3, sm: 2, md: 1.5, lg: 1 }} key={hour}>
                            <Button
                              fullWidth
                              variant={isSelected ? 'contained' : 'outlined'}
                              color={isSelected ? 'primary' : 'inherit'}
                              onClick={() => handleToggleSlot(day.value, hour)}
                              sx={{
                                py: 1.5,
                                borderRadius: 1.5,
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                bgcolor: isSelected ? 'primary.main' : 'transparent',
                                color: isSelected ? 'primary.contrastText' : 'text.primary',
                                '&:hover': {
                                  bgcolor: isSelected ? 'primary.dark' : 'background.neutral',
                                },
                                fontSize: '0.875rem',
                                fontWeight: isSelected ? 'bold' : 'medium',
                              }}
                            >
                              {hour}
                            </Button>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Stack>
    </DashboardContent>
  );
}

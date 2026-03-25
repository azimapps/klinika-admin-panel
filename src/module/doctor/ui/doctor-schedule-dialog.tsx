import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';

import { useGetDoctorSchedule, useUpdateDoctorSchedule } from '../hooks';

import type { IDoctorScheduleSlot } from '../types';

// ----------------------------------------------------------------------

interface Props {
  open: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
}

export function DoctorScheduleDialog({ open, onClose, doctorId, doctorName }: Props) {
  const { t } = useTranslate('doctor');
  const [currentTab, setCurrentTab] = useState(0);
  const [localSchedules, setLocalSchedules] = useState<IDoctorScheduleSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(
    dayjs().set('hour', 9).set('minute', 0)
  );

  const { data: scheduleData } = useGetDoctorSchedule(doctorId);
  const { mutateAsync: updateSchedule, isPending } = useUpdateDoctorSchedule(doctorId);

  useEffect(() => {
    if (open) {
      if (scheduleData) {
        setLocalSchedules(
          scheduleData.map((s) => ({ day_of_week: s.day_of_week, slots: s.slots }))
        );
      } else {
        setLocalSchedules([]);
      }
    }
  }, [scheduleData, open]);

  const handleAddSlot = () => {
    if (!selectedTime) return;
    const timeStr = selectedTime.format('HH:mm');
    const currentSchedule = localSchedules.find((s) => s.day_of_week === currentTab);

    if (currentSchedule) {
      if (!currentSchedule.slots.includes(timeStr)) {
        const updatedSchedules = localSchedules.map((s) =>
          s.day_of_week === currentTab ? { ...s, slots: [...s.slots, timeStr].sort() } : s
        );
        setLocalSchedules(updatedSchedules);
      }
    } else {
      setLocalSchedules([...localSchedules, { day_of_week: currentTab, slots: [timeStr] }]);
    }
  };

  const handleRemoveSlot = (slot: string) => {
    const updatedSchedules = localSchedules.map((s) =>
      s.day_of_week === currentTab
        ? { ...s, slots: s.slots.filter((timeStr) => timeStr !== slot) }
        : s
    );
    setLocalSchedules(updatedSchedules);
  };

  const handleCopyToAll = () => {
    const currentSchedule = localSchedules.find((s) => s.day_of_week === currentTab);
    if (!currentSchedule) return;

    const newSchedules: IDoctorScheduleSlot[] = DAYS.map((day) => ({
      day_of_week: day.value,
      slots: [...currentSchedule.slots],
    }));
    setLocalSchedules(newSchedules);
  };

  const handleClearDay = () => {
    const updatedSchedules = localSchedules.map((s) =>
      s.day_of_week === currentTab ? { ...s, slots: [] } : s
    );
    setLocalSchedules(updatedSchedules);
  };

  const handleSave = async () => {
    try {
      const finalSchedules = localSchedules.filter((s) => s.slots.length > 0);
      await updateSchedule(finalSchedules);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const DAYS = [
    { value: 0, label: t('schedule.day_0') },
    { value: 1, label: t('schedule.day_1') },
    { value: 2, label: t('schedule.day_2') },
    { value: 3, label: t('schedule.day_3') },
    { value: 4, label: t('schedule.day_4') },
    { value: 5, label: t('schedule.day_5') },
    { value: 6, label: t('schedule.day_6') },
  ];

  const currentSlots = localSchedules.find((s) => s.day_of_week === currentTab)?.slots || [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6">{t('schedule.title')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {doctorName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <CustomTabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ my: 2 }}>
          {DAYS.map((day) => (
            <Tab key={day.value} value={day.value} label={day.label} />
          ))}
        </CustomTabs>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TimePicker
                label={t('schedule.selectTime')}
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                ampm={false}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <Button
                variant="contained"
                onClick={handleAddSlot}
                startIcon={<Iconify icon="mingcute:add-line" />}
                sx={{ height: 40, whiteSpace: 'nowrap' }}
              >
                {t('schedule.add')}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                {DAYS.find((d) => d.value === currentTab)?.label}:
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title={t('schedule.copyToAll')}>
                  <IconButton size="small" onClick={handleCopyToAll} color="primary">
                    <Iconify icon="solar:copy-bold" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('schedule.clearDay')}>
                  <IconButton size="small" onClick={handleClearDay} color="error">
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.neutral',
                minHeight: 100,
                alignContent: 'flex-start',
              }}
            >
              {currentSlots.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('schedule.noSlots')}
                  </Typography>
                </Box>
              ) : (
                currentSlots.map((slot) => (
                  <Chip
                    key={slot}
                    label={slot}
                    onDelete={() => handleRemoveSlot(slot)}
                    color="primary"
                    variant="soft"
                    sx={{ fontWeight: 'bold' }}
                  />
                ))
              )}
            </Box>
          </Stack>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('cancel')}
        </Button>
        <LoadingButton variant="contained" loading={isPending} onClick={handleSave}>
          {t('save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

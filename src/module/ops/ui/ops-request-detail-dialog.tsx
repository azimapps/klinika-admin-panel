import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';

import { useGetDoctors } from 'src/module/doctor/hooks';

import { REASON_REQUIRED_STATUSES } from '../types';
import { OpsPaymentPanel } from './ops-payment-panel';
import { OpsPatientRecordForm } from './ops-patient-record-form';
import { STATUS_COLOR, SERVICE_COLOR, getAllowedTransitions } from './ops-status';
import {
  useTakeRequest,
  useMarkPayment,
  useGetOpsRequest,
  useChangeOpsStatus,
  useSendPaymentLink,
  useAssignSpecialist,
  useGetStatusHistory,
  useUpdateOpsRequest,
} from '../hooks';

import type { RequestStatus } from '../types';

// ----------------------------------------------------------------------

interface Props {
  open: boolean;
  onClose: () => void;
  requestId?: number;
}

export function OpsRequestDetailDialog({ open, onClose, requestId }: Props) {
  const { t } = useTranslate('ops');

  const [tab, setTab] = useState('info');
  const [targetStatus, setTargetStatus] = useState<RequestStatus | ''>('');
  const [reason, setReason] = useState('');
  const [specialistId, setSpecialistId] = useState<number | ''>('');

  const { data: request, isLoading } = useGetOpsRequest(requestId);
  const { data: history = [] } = useGetStatusHistory(tab === 'history' ? requestId : undefined);
  const { data: doctors = [] } = useGetDoctors();

  const takeReq = useTakeRequest();
  const updateReq = useUpdateOpsRequest();
  const changeStatus = useChangeOpsStatus();
  const assign = useAssignSpecialist();
  const sendLink = useSendPaymentLink();
  const markPayment = useMarkPayment();

  useEffect(() => {
    if (open) {
      setTab('info');
      setTargetStatus('');
      setReason('');
      setSpecialistId('');
    }
  }, [open, requestId]);

  const handleApplyStatus = async () => {
    if (!request || !targetStatus) return;
    const needsReason = REASON_REQUIRED_STATUSES.includes(targetStatus);
    if (needsReason && !reason.trim()) return;
    await changeStatus.mutateAsync({
      id: request.id,
      data: { status: targetStatus, ...(needsReason ? { reason: reason.trim() } : {}) },
    });
    setTargetStatus('');
    setReason('');
  };

  const handleAssign = async () => {
    if (!request || specialistId === '') return;
    await assign.mutateAsync({ id: request.id, specialist_id: Number(specialistId) });
    setSpecialistId('');
  };

  const transitions = request ? getAllowedTransitions(request.status) : [];
  const reasonNeeded = targetStatus !== '' && REASON_REQUIRED_STATUSES.includes(targetStatus);
  const canTake = request?.status === 'new';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {isLoading || !request ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {request.request_number}
            <Chip
              label={t(`status_${request.status}`)}
              color={STATUS_COLOR[request.status]}
              size="small"
            />
            <Chip
              label={t(`service_${request.service_type}`)}
              color={SERVICE_COLOR[request.service_type]}
              size="small"
              variant="soft"
            />
            {request.is_overdue && (
              <Chip
                icon={<Iconify icon={'solar:alarm-bold' as any} />}
                label={t('overdue')}
                color="error"
                size="small"
                variant="soft"
              />
            )}
          </DialogTitle>

          <DialogContent dividers>
            {/* Summary */}
            <Box
              sx={{
                mb: 2,
                rowGap: 1,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Typography variant="body2">
                <strong>{t('col_name')}:</strong> {request.full_name}
              </Typography>
              <Typography variant="body2">
                <strong>{t('col_phone')}:</strong>{' '}
                <Link href={`tel:${request.phone}`}>{request.phone}</Link>
              </Typography>
              <Typography variant="body2">
                <strong>{t('col_operator')}:</strong> {request.operator || '—'}
              </Typography>
              <Typography variant="body2">
                <strong>{t('specialist')}:</strong> {request.specialist || '—'}
              </Typography>
              <Typography variant="body2">
                <strong>{t('source')}:</strong> {t(`source_${request.source}`)}
              </Typography>
              <Typography variant="body2">
                <strong>{t('col_created')}:</strong> {fDateTime(request.created_at)}
              </Typography>
            </Box>

            {request.cancel_reason && (
              <Typography variant="body2" sx={{ mb: 2, color: 'error.main' }}>
                <strong>{t('cancel_reason')}:</strong> {request.cancel_reason}
              </Typography>
            )}

            {/* Action bar: take / status / assign */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Stack spacing={2}>
                {canTake && (
                  <LoadingButton
                    variant="contained"
                    loading={takeReq.isPending}
                    onClick={() => takeReq.mutateAsync(request.id)}
                    startIcon={<Iconify icon={'solar:hand-shake-bold' as any} />}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {t('take')}
                  </LoadingButton>
                )}

                {/* Status */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
                  <TextField
                    select
                    label={t('change_status')}
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as RequestStatus)}
                    size="small"
                    sx={{ minWidth: 180 }}
                    disabled={!transitions.length}
                  >
                    {transitions.map((s) => (
                      <MenuItem key={s} value={s}>
                        {t(`status_${s}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                  {reasonNeeded && (
                    <TextField
                      label={t('reason')}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      size="small"
                      sx={{ flex: 1, minWidth: 200 }}
                      required
                    />
                  )}
                  <LoadingButton
                    variant="outlined"
                    loading={changeStatus.isPending}
                    disabled={!targetStatus || (reasonNeeded && !reason.trim())}
                    onClick={handleApplyStatus}
                    sx={{ height: 40 }}
                  >
                    {t('apply')}
                  </LoadingButton>
                </Stack>

                {/* Assign */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
                  <TextField
                    select
                    label={t('assign_specialist')}
                    value={specialistId}
                    onChange={(e) => setSpecialistId(Number(e.target.value))}
                    size="small"
                    sx={{ minWidth: 220 }}
                  >
                    {doctors.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.fullname_uz}
                      </MenuItem>
                    ))}
                  </TextField>
                  <LoadingButton
                    variant="outlined"
                    loading={assign.isPending}
                    disabled={specialistId === ''}
                    onClick={handleAssign}
                    startIcon={<Iconify icon={'solar:user-check-bold' as any} />}
                    sx={{ height: 40 }}
                  >
                    {t('assign')}
                  </LoadingButton>
                </Stack>
              </Stack>
            </Paper>

            <CustomTabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab value="info" label={t('tab_info')} />
              <Tab value="payment" label={t('tab_payment')} />
              <Tab value="history" label={t('tab_history')} />
            </CustomTabs>

            {tab === 'info' && (
              <OpsPatientRecordForm
                request={request}
                isSaving={updateReq.isPending}
                onSave={(data) => updateReq.mutateAsync({ id: request.id, data })}
              />
            )}

            {tab === 'payment' && (
              <OpsPaymentPanel
                request={request}
                isSendingLink={sendLink.isPending}
                isMarking={markPayment.isPending}
                onSendLink={(data) => sendLink.mutateAsync({ id: request.id, data })}
                onMark={(data) => markPayment.mutateAsync({ id: request.id, data })}
              />
            )}

            {tab === 'history' && (
              <Stack spacing={1.5} sx={{ pt: 1 }}>
                {history.length === 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('no_history')}
                  </Typography>
                )}
                {history.map((h, i) => (
                  <Box key={i}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={h.from ? t(`status_${h.from}`) : '—'}
                        size="small"
                        variant="outlined"
                      />
                      <Iconify icon="eva:arrow-forward-fill" width={16} />
                      <Chip label={t(`status_${h.to}`)} color={STATUS_COLOR[h.to]} size="small" />
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {fDateTime(h.at)}
                      </Typography>
                    </Stack>
                    {h.reason && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', pl: 0.5 }}>
                        {t('reason')}: {h.reason}
                      </Typography>
                    )}
                    {i < history.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                  </Box>
                ))}
              </Stack>
            )}
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              {t('close')}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { getStatusName } from '../types';

import type { IConsultationRequest, ConsultationRequestStatusName } from '../types';

// ----------------------------------------------------------------------

const STATUS_COLOR_MAP: Record<
  ConsultationRequestStatusName,
  'warning' | 'success' | 'info' | 'error' | 'default'
> = {
  new: 'warning',
  reviewed: 'info',
  sent: 'warning',
  invoiced: 'warning',
  accepted: 'success',
  rejected: 'error',
  expired: 'default',
};

interface Props {
  open: boolean;
  onClose: () => void;
  request?: IConsultationRequest;
  onStatusChange: (id: number, status: number) => void;
  onSendInvoice: (id: number, amount: number) => void;
  isUpdating: boolean;
  isSendingInvoice: boolean;
}

export function ConsultationRequestDetailDialog({
  open,
  onClose,
  request,
  onStatusChange,
  onSendInvoice,
  isUpdating,
  isSendingInvoice,
}: Props) {
  const { t } = useTranslate('consultation-request');

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    if (open) {
      setAmount('');
      setAmountError('');
    }
  }, [open]);

  if (!request) return null;

  const handleSendInvoice = () => {
    const parsed = Number(amount);
    if (!amount || parsed <= 0 || !Number.isInteger(parsed)) {
      setAmountError(t('amount_error'));
      return;
    }
    setAmountError('');
    onSendInvoice(request.id, parsed);
  };

  const statusName = getStatusName(request.status);

  const canSendInvoice =
    statusName === 'new' ||
    statusName === 'reviewed' ||
    statusName === 'expired' ||
    statusName === 'sent' ||
    statusName === 'invoiced';
  const canReject = statusName === 'new' || statusName === 'reviewed';
  const canMarkReviewed = statusName === 'new';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {t('request_details')} #{request.id}
        <Chip
          label={t(`status_${statusName}`)}
          color={STATUS_COLOR_MAP[statusName] || 'default'}
          size="small"
          variant="outlined"
          sx={{ ml: 'auto' }}
        />
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {/* Client Info */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('client_info')}
            </Typography>
            <Typography variant="body1">{request.client_name}</Typography>
            <Link
              href={`tel:${request.client_phone}`}
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
            >
              <Iconify icon="solar:phone-bold" width={16} />
              {request.client_phone}
            </Link>
          </Box>

          {/* Category & Service */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('category')} / {t('service')}
            </Typography>
            <Typography variant="body2">
              {request.category_title_uz} &bull; {request.service_title_uz}
            </Typography>
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('description')}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {request.description}
            </Typography>
          </Box>

          {/* Files */}
          {request.files && request.files.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('files')} ({request.files.length})
              </Typography>
              <Stack spacing={1}>
                {request.files.map((file, index) => {
                  const fileName = file.split('/').pop() || `File ${index + 1}`;
                  return (
                    <Link
                      key={index}
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Iconify icon={'solar:file-bold' as any} width={16} />
                      {fileName}
                    </Link>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Invoice Info */}
          {request.invoice && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('invoice_info')}
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2">
                  {t('amount')}: <strong>{request.invoice.amount.toLocaleString()} UZS</strong>
                </Typography>
                <Typography variant="body2">
                  {t('payment_state')}: {t(`invoice_${request.invoice.state}`)}
                </Typography>
                {request.invoice.expires_at && (
                  <Typography variant="body2">
                    {t('expires_at')}: {fDateTime(request.invoice.expires_at)}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {/* Expired notice */}
          {statusName === 'expired' && <Alert severity="warning">{t('expired_notice')}</Alert>}

          {/* Accepted notice */}
          {statusName === 'accepted' && <Alert severity="success">{t('accepted_notice')}</Alert>}

          {/* Invoiced notice */}
          {(statusName === 'invoiced' || statusName === 'sent') && (
            <Alert severity="info">{t('invoiced_notice')}</Alert>
          )}

          {/* Send Invoice Form */}
          {canSendInvoice && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {statusName === 'expired' ? t('resend_invoice') : t('send_invoice')}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <TextField
                  type="number"
                  label={t('amount')}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setAmountError('');
                  }}
                  error={!!amountError}
                  helperText={amountError}
                  size="small"
                  sx={{ flex: 1 }}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">UZS</InputAdornment>,
                    },
                  }}
                />
                <LoadingButton
                  variant="contained"
                  loading={isSendingInvoice}
                  onClick={handleSendInvoice}
                  startIcon={<Iconify icon={'solar:bill-check-bold' as any} />}
                  sx={{ minWidth: 120, height: 40 }}
                >
                  {t('send')}
                </LoadingButton>
              </Stack>
            </Box>
          )}

          {/* Date */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('created_at')}
            </Typography>
            <Typography variant="body2">{fDateTime(request.created_at)}</Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('close')}
        </Button>

        {canReject && (
          <LoadingButton
            variant="outlined"
            color="error"
            loading={isUpdating}
            onClick={() => onStatusChange(request.id, -1)}
            startIcon={<Iconify icon="solar:close-circle-bold" />}
          >
            {t('mark_rejected')}
          </LoadingButton>
        )}

        {canMarkReviewed && (
          <LoadingButton
            variant="contained"
            color="info"
            loading={isUpdating}
            onClick={() => onStatusChange(request.id, 1)}
            startIcon={<Iconify icon="solar:check-circle-bold" />}
          >
            {t('mark_reviewed')}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
}

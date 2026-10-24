import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { PAYMENT_COLOR } from './ops-status';

import type {
  PaymentStatus,
  IOpsRequestDetail,
  IPaymentLinkParams,
  IPaymentMarkParams,
  IPaymentLinkResponse,
} from '../types';

// ----------------------------------------------------------------------

interface Props {
  request: IOpsRequestDetail;
  isSendingLink: boolean;
  isMarking: boolean;
  onSendLink: (data: IPaymentLinkParams) => Promise<IPaymentLinkResponse | undefined>;
  onMark: (data: IPaymentMarkParams) => Promise<unknown>;
}

export function OpsPaymentPanel({ request, isSendingLink, isMarking, onSendLink, onMark }: Props) {
  const { t } = useTranslate('ops');

  const [method, setMethod] = useState<IPaymentLinkParams['method']>('both');
  const [channel, setChannel] = useState<IPaymentLinkParams['channel']>('link');
  const [chatId, setChatId] = useState('');
  const [links, setLinks] = useState<IPaymentLinkResponse['links'] | null>(null);

  const [markStatus, setMarkStatus] = useState<PaymentStatus>('paid');
  const [markMethod, setMarkMethod] = useState<IPaymentMarkParams['method']>('cash');

  const noPrice = request.amount == null || request.amount <= 0;

  const handleSendLink = async () => {
    const res = await onSendLink({
      method,
      channel,
      ...(channel === 'telegram' && chatId ? { chat_id: chatId } : {}),
    });
    if (res?.links) setLinks(res.links);
  };

  return (
    <Stack spacing={3} sx={{ pt: 1 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {t('payment_state')}:
        </Typography>
        <Chip
          label={t(`payment_${request.payment_status}`)}
          color={PAYMENT_COLOR[request.payment_status] || 'default'}
          size="small"
        />
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="subtitle1">
          {request.amount != null ? `${request.amount.toLocaleString()} UZS` : '—'}
        </Typography>
      </Stack>

      {noPrice && <Alert severity="warning">{t('no_price_warning')}</Alert>}

      <Divider />

      {/* Online pay link */}
      <Typography variant="subtitle2">{t('send_pay_link')}</Typography>
      <Box
        sx={{
          rowGap: 2,
          columnGap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        <TextField
          select
          label={t('method')}
          value={method}
          onChange={(e) => setMethod(e.target.value as IPaymentLinkParams['method'])}
          size="small"
        >
          <MenuItem value="both">{t('method_both')}</MenuItem>
          <MenuItem value="payme">{t('method_payme')}</MenuItem>
          <MenuItem value="click">{t('method_click')}</MenuItem>
        </TextField>
        <TextField
          select
          label={t('channel')}
          value={channel}
          onChange={(e) => setChannel(e.target.value as IPaymentLinkParams['channel'])}
          size="small"
        >
          <MenuItem value="link">{t('channel_link')}</MenuItem>
          <MenuItem value="telegram">{t('channel_telegram')}</MenuItem>
        </TextField>
        {channel === 'telegram' && (
          <TextField
            label={t('chat_id')}
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            size="small"
            sx={{ gridColumn: { sm: '1 / -1' } }}
          />
        )}
      </Box>
      <LoadingButton
        variant="contained"
        loading={isSendingLink}
        disabled={noPrice}
        onClick={handleSendLink}
        startIcon={<Iconify icon={'solar:link-bold' as any} />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('generate_link')}
      </LoadingButton>

      {links && (
        <Stack spacing={1}>
          {links.payme && (
            <Link href={links.payme} target="_blank" rel="noopener" variant="body2">
              Payme: {links.payme}
            </Link>
          )}
          {links.click && (
            <Link href={links.click} target="_blank" rel="noopener" variant="body2">
              Click: {links.click}
            </Link>
          )}
        </Stack>
      )}

      <Divider />

      {/* Manual mark */}
      <Typography variant="subtitle2">{t('mark_payment')}</Typography>
      <Box
        sx={{
          rowGap: 2,
          columnGap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        <TextField
          select
          label={t('payment_state')}
          value={markStatus}
          onChange={(e) => setMarkStatus(e.target.value as PaymentStatus)}
          size="small"
        >
          <MenuItem value="paid">{t('payment_paid')}</MenuItem>
          <MenuItem value="awaiting">{t('payment_awaiting')}</MenuItem>
          <MenuItem value="unpaid">{t('payment_unpaid')}</MenuItem>
        </TextField>
        <TextField
          select
          label={t('method')}
          value={markMethod}
          onChange={(e) => setMarkMethod(e.target.value as IPaymentMarkParams['method'])}
          size="small"
        >
          <MenuItem value="cash">{t('method_cash')}</MenuItem>
          <MenuItem value="card">{t('method_card')}</MenuItem>
          <MenuItem value="click">{t('method_click')}</MenuItem>
          <MenuItem value="payme">{t('method_payme')}</MenuItem>
        </TextField>
      </Box>
      <LoadingButton
        variant="outlined"
        loading={isMarking}
        onClick={() => onMark({ payment_status: markStatus, method: markMethod })}
        startIcon={<Iconify icon="solar:check-circle-bold" />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('apply')}
      </LoadingButton>
    </Stack>
  );
}

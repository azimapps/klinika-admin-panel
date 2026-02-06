import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCountdownSeconds } from 'minimal-shared/hooks';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useTranslate } from 'src/locales';

import { Form } from 'src/components/hook-form';
import { AnimateLogoRotate } from 'src/components/animate';

import { FormHead } from '../components/form-head';
import { FormResendCode } from '../components/form-resend-code';
import { FormReturnLink } from '../components/form-return-link';
import { useSignInVerify, useSignInRequest } from '../context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  phone_number: zod.string().min(1, { message: 'Phone number is required!' }),
  code: zod.string().optional(),
});

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

// ----------------------------------------------------------------------

export function CenteredSignInViewPhone() {
  const { t } = useTranslate('auth');
  const [isVerifyStep, setIsVerifyStep] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const { isPending: isRequestPending, mutateAsync: requestSignIn } = useSignInRequest();
  const { isPending: isVerifyPending, mutateAsync: verifySignIn } = useSignInVerify();

  const countdown = useCountdownSeconds(60);

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { phone_number: '+998', code: '123456' },
  });

  const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;

  const phoneValue = watch('phone_number');

  const handleSendCode = useCallback(async (phone: string) => {
    try {
      if (executeRecaptcha) {
        await executeRecaptcha('login_request');
      }
      await requestSignIn({ phone_number: phone });
      setIsVerifyStep(true);
      countdown.start();
    } catch (error) {
      console.error(error);
    }
  }, [executeRecaptcha, requestSignIn, countdown]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!isVerifyStep) {
        await handleSendCode(data.phone_number);
      } else {
        await verifySignIn({
          phone_number: data.phone_number,
          code: data.code || '',
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleBack = () => {
    setIsVerifyStep(false);
    setValue('code', '123456');
    countdown.reset();
  };

  const handleResendCode = useCallback(async () => {
    await handleSendCode(phoneValue);
  }, [handleSendCode, phoneValue]);

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <TextField
        {...register('phone_number')}
        fullWidth
        label={t('phoneLabel')}
        placeholder={t('phonePlaceholder')}
        disabled={isVerifyStep}
        error={!!errors.phone_number}
        helperText={errors.phone_number?.message ? t('invalidPhone') : ''}
        slotProps={{ inputLabel: { shrink: true } }}
        onChange={(e) => {
          let { value } = e.target;
          if (!value.startsWith('+998')) {
            value = '+998';
          }
          const prefix = '+998';
          const rest = value.substring(prefix.length).replace(/[^\d]/g, '');
          value = prefix + rest;
          if (value.length > 13) {
            value = value.slice(0, 13);
          }
          setValue('phone_number', value, { shouldValidate: true });
        }}
      />

      {isVerifyStep && (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <TextField
            {...register('code')}
            fullWidth
            label={t('codeLabel')}
            placeholder={t('codePlaceholder')}
            autoFocus
            error={!!errors.code}
            helperText={errors.code?.message ? t('invalidCode') : ''}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <FormResendCode
            disabled={countdown.isCounting}
            value={countdown.value}
            onResendCode={handleResendCode}
          />
        </Box>
      )}

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isRequestPending || isVerifyPending}
        sx={{ mt: 1 }}
      >
        {isVerifyStep ? t('verifyCode') : t('sendCode')}
      </Button>

      {isVerifyStep && (
        <FormReturnLink
          onClick={handleBack}
          href="#"
          label={t('backToPhone')}
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title={isVerifyStep ? t('codeLabel') : t('signInTitle')}
        description={isVerifyStep ? t('codeSent') : t('signInDescription')}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}

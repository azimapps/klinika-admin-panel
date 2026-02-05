import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';

import { Form, Field } from 'src/components/hook-form';
import { AnimateLogoRotate } from 'src/components/animate';

import { FormHead } from '../components/form-head';
import { useSignInVerify, useSignInRequest } from '../context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  phone_number: zod
    .string()
    .min(9, { message: 'Telefon raqami 9 ta raqamdan iborat bo\'lishi kerak!' })
    .max(9, { message: 'Telefon raqami 9 ta raqamdan oshmasligi kerak!' }),
  code: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const [isSent, setIsSent] = useState(false);
  const { isPending: isRequestPending, mutateAsync: signInRequest } = useSignInRequest();
  const { isPending: isVerifyPending, mutateAsync: signInVerify } = useSignInVerify();

  const defaultValues: SignInSchemaType = {
    phone_number: '',
    code: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;

  const phone_number = watch('phone_number');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const fullPhoneNumber = `+998${data.phone_number.replace(/\D/g, '')}`;
      if (!isSent) {
        await signInRequest(fullPhoneNumber);
        setIsSent(true);
      } else {
        await signInVerify({ phone_number: fullPhoneNumber, code: data.code || '' });
      }
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="phone_number"
        label="Phone number"
        placeholder="90 123 45 67"
        disabled={isSent}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 9);
          setValue('phone_number', value);
        }}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: {
            maxLength: 9,
            inputMode: 'numeric',
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                +998
              </InputAdornment>
            ),
          },
        }}
      />

      {isSent && (
        <Field.Text
          name="code"
          label="Verification Code"
          placeholder="Enter code"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setValue('code', value);
          }}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: {
              maxLength: 6,
              inputMode: 'numeric',
            }
          }}
        />
      )}

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isRequestPending || isVerifyPending}
        loadingIndicator={isSent ? 'Verifying...' : 'Sending code...'}
      >
        {isSent ? 'Verify' : 'Send code'}
      </Button>

      {isSent && (
        <Button
          fullWidth
          size="small"
          onClick={() => setIsSent(false)}
          sx={{ mt: -1 }}
        >
          Change phone number
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title={isSent ? 'Verify your account' : 'Sign in to your account'}
        description={isSent ? `Code sent to +998 ${phone_number}` : 'Enter your phone number to receive a verification code'}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}

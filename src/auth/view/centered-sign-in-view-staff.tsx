import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { AnimateLogoRotate } from 'src/components/animate';

import { useStaffSignIn } from '../context/jwt';
import { FormHead } from '../components/form-head';

// ----------------------------------------------------------------------

export const StaffSignInSchema = zod.object({
  username: zod.string().min(1, { message: 'Login majburiy!' }),
  password: zod.string().min(1, { message: 'Parol majburiy!' }),
});

export type StaffSignInSchemaType = zod.infer<typeof StaffSignInSchema>;

// ----------------------------------------------------------------------

export function CenteredSignInViewStaff() {
  const { t } = useTranslate('auth');

  const [showPassword, setShowPassword] = useState(false);

  const { isPending, mutateAsync: staffSignIn } = useStaffSignIn();

  const methods = useForm<StaffSignInSchemaType>({
    resolver: zodResolver(StaffSignInSchema),
    defaultValues: { username: '', password: '' },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await staffSignIn(data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="username"
        label={t('usernameLabel')}
        placeholder={t('usernamePlaceholder')}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Text
        name="password"
        label={t('passwordLabel')}
        placeholder={t('passwordPlaceholder')}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isPending}
        sx={{ mt: 1 }}
      >
        {t('signInButton')}
      </Button>

      <Link
        component={RouterLink}
        href={paths.auth.signInPhone}
        variant="body2"
        sx={{ alignSelf: 'center' }}
      >
        {t('signInWithPhone')}
      </Link>
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead title={t('staffSignInTitle')} description={t('staffSignInDescription')} />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}

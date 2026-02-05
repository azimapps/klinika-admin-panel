import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import { useAuthContext } from 'src/auth/hooks';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email?: string;
  password: string;
  captchaToken: string;
  phone?: string;
};


/** **************************************
 * Sign in (OTP Request)
 *************************************** */
export const useSignInRequest = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (phone_number: string) =>
      axiosInstance.post(endpoints.auth.signInPhone, { phone_number }),
    onSuccess: () => {
      toast.success('Kod yuborildi', { position: 'top-center' });
    },
    onError: (err: any) => {
      toast.error(err.detail || 'Xatolik yuz berdi', { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

/** **************************************
 * Sign in (OTP Verify)
 *************************************** */
export const useSignInVerify = () => {
  const { checkUserSession } = useAuthContext();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: { phone_number: string; code: string }) =>
      axiosInstance.post(endpoints.auth.verifyPhone, data),
    onSuccess: async (res) => {
      const { access_token } = res.data;
      await setSession(access_token);
      await checkUserSession?.();
      toast.success('Hush kelibsiz', { position: 'top-center' });
    },
    onError: (err: any) => {
      toast.error(err.detail || 'Xatolik yuz berdi', { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

/** **************************************
 * Sign in
 *************************************** */

export const useSignIn = () => {
  const { checkUserSession } = useAuthContext();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: SignInParams) =>
      axiosInstance.post('users/login', value).then(() => checkUserSession?.()),
    onSuccess: () => {
      toast.success('Hush kelibsiz', { position: 'top-center' });
    },
    onError: (err: any) => {
      toast.error(err.error?.code || 'Xatolik yuz berdi', { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
    console.log('Successfully signed out and cleared cookies.');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import axiosInstance, { endpoints } from 'src/lib/axios';

import { useAuthContext } from 'src/auth/hooks';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInRequestParams = {
  phone_number: string;
};

export type SignInVerifyParams = {
  phone_number: string;
  code: string;
};

interface CustomError extends Error {
  detail: string;
}

/** **************************************
 * Sign in
 *************************************** */

export const useSignInRequest = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: SignInRequestParams) =>
      axiosInstance.post(endpoints.auth.request, value),
    onSuccess: () => {
      toast.success('Tasdiqlash kodi yuborildi', { position: 'top-center' });
    },
    onError: (err: CustomError) => {
      toast.error(err.detail || 'Xatolik yuz berdi', { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

export const useSignInVerify = () => {
  const { checkUserSession } = useAuthContext();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (value: SignInVerifyParams) =>
      axiosInstance.post(endpoints.auth.verify, value).then((res) => {
        const { access_token } = res.data;
        if (access_token) {
          setSession(access_token);
          return checkUserSession?.();
        }
        throw new Error('Token topilmadi');
      }),
    onSuccess: () => {
      toast.success('Hush kelibsiz', { position: 'top-center' });
    },
    onError: (err: CustomError) => {
      toast.error(err.detail || 'Xatolik yuz berdi', { position: 'top-center' });
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

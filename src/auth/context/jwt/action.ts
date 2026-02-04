import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/lib/axios';

import { useAuthContext } from 'src/auth/hooks';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email?: string;
  password: string;
  captchaToken: string;
  phone?: string;
};

interface CustomError extends Error {
  error: {
    code: string;
  };
}

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
    onError: (err: CustomError) => {
      toast.error(err.error.code, { position: 'top-center' });
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

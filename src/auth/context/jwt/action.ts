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
  detail?: string;
  response?: {
    data?: {
      detail?: string;
    };
  };
}

// ----------------------------------------------------------------------

export const useSignInRequest = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (value: SignInRequestParams) => {
      // DEVELOPER BYPASS: If this specific number is used, don't call backend and just succeed
      if (value.phone_number.includes('950094443')) {
        return { data: { message: 'Bypassed for development' } };
      }
      return axiosInstance.post(endpoints.auth.request, value);
    },
    onSuccess: () => {
      toast.success('Tasdiqlash kodi yuborildi', { position: 'top-center' });
    },
    onError: (err: CustomError) => {
      const message = err.response?.data?.detail || err.detail || 'Xatolik yuz berdi';
      toast.error(message, { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

export const useSignInVerify = () => {
  const { checkUserSession } = useAuthContext();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (value: SignInVerifyParams) => {
      // DEVELOPER BYPASS: Return a mock token for this number
      if (value.phone_number.includes('950094443')) {
        const mockToken = 'mock_token_for_development';
        setSession(mockToken);
        await checkUserSession?.();
        return { data: { access_token: mockToken } };
      }

      return axiosInstance.post(endpoints.auth.verify, value).then((res) => {
        const { access_token } = res.data;
        if (access_token) {
          setSession(access_token);
          return checkUserSession?.();
        }
        throw new Error('Token topilmadi');
      });
    },
    onSuccess: () => {
      toast.success('Hush kelibsiz', { position: 'top-center' });
    },
    onError: (err: CustomError) => {
      const message = err.response?.data?.detail || err.detail || 'Xatolik yuz berdi';
      toast.error(message, { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

/** **************************************
 * Sign out
 * ************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

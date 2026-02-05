import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard/guest-guard';

const CenteredLayout = {
  SignInPhonePage: lazy(() => import('src/pages/auth/sign-in-phone')),
};

const authCentered = {
  path: 'auth',
  element: (
    <AuthCenteredLayout>
      <Outlet />
    </AuthCenteredLayout>
  ),
  children: [
    { index: true, element: <CenteredLayout.SignInPhonePage /> },
    { path: 'sign-in-phone', element: <CenteredLayout.SignInPhonePage /> },
  ],
};

// ----------------------------------------------------------------------

export const authDemoRoutes: RouteObject[] = [
  {
    path: '',
    element: (
      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.VITE_RECAPTCHA_KEY}
        scriptProps={{ async: true, defer: true, appendTo: 'head' }}
      >
        <GuestGuard>
          <Suspense fallback={<SplashScreen />}>
            <Outlet />
          </Suspense>
        </GuestGuard>
      </GoogleReCaptchaProvider>
    ),
    children: [authCentered],
  },
];

import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { mainRoutes } from './main';
import { usePathname } from '../hooks';
import { authDemoRoutes } from './auth';

// ----------------------------------------------------------------------

// Overview
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}



// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

const CategoryListPage = lazy(() => import('src/pages/dashboard/category/list'));
const DoctorListPage = lazy(() => import('src/pages/dashboard/doctor/list'));
const AdvantageListPage = lazy(() => import('src/pages/dashboard/advantage/list'));
const FounderListPage = lazy(() => import('src/pages/dashboard/founder/list'));
const ServiceListPage = lazy(() => import('src/pages/dashboard/service/list'));
const ClinicListPage = lazy(() => import('src/pages/dashboard/clinic/list'));
const FAQListPage = lazy(() => import('src/pages/dashboard/faq/list'));
const TipListPage = lazy(() => import('src/pages/dashboard/tip/list'));
const NotificationListPage = lazy(() => import('src/pages/dashboard/notification/list'));
const ClientListPage = lazy(() => import('src/pages/dashboard/client/list'));

// ----------------------------------------------------------------------

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <SuspenseOutlet />
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <OverviewAnalyticsPage /> },
      {
        path: 'category',
        children: [
          { element: <CategoryListPage />, index: true },
          { path: 'list', element: <CategoryListPage /> },
        ],
      },
      {
        path: 'doctor',
        children: [
          { element: <DoctorListPage />, index: true },
          { path: 'list', element: <DoctorListPage /> },
        ],
      },
      {
        path: 'advantage',
        children: [
          { element: <AdvantageListPage />, index: true },
          { path: 'list', element: <AdvantageListPage /> },
        ],
      },
      {
        path: 'founder',
        children: [
          { element: <FounderListPage />, index: true },
          { path: 'list', element: <FounderListPage /> },
        ],
      },
      {
        path: 'service',
        children: [
          { element: <ServiceListPage />, index: true },
          { path: 'list', element: <ServiceListPage /> },
        ],
      },
      {
        path: 'clinic',
        children: [
          { element: <ClinicListPage />, index: true },
          { path: 'list', element: <ClinicListPage /> },
        ],
      },
      {
        path: 'faq',
        children: [
          { element: <FAQListPage />, index: true },
          { path: 'list', element: <FAQListPage /> },
        ],
      },
      {
        path: 'tip',
        children: [
          { element: <TipListPage />, index: true },
          { path: 'list', element: <TipListPage /> },
        ],
      },
      {
        path: 'notification',
        children: [
          { element: <NotificationListPage />, index: true },
          { path: 'list', element: <NotificationListPage /> },
        ],
      },
      {
        path: 'client',
        children: [
          { element: <ClientListPage />, index: true },
          { path: 'list', element: <ClientListPage /> },
        ],
      },
    ],
  },

  // Auth
  ...authDemoRoutes,

  // Main
  ...mainRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];

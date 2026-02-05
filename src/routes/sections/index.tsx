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

// Category
const CategoryListPage = lazy(() => import('src/pages/dashboard/category/list'));

// User
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));

// Doctor
const DoctorListPage = lazy(() => import('src/pages/dashboard/doctor/list'));

// Advantage
const AdvantageListPage = lazy(() => import('src/pages/dashboard/advantage/list'));

// Founder
const FounderListPage = lazy(() => import('src/pages/dashboard/founder/list'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <OverviewAnalyticsPage /> },
      {
        path: 'category',
        children: [
          { index: true, element: <CategoryListPage /> },
          { path: 'list', element: <CategoryListPage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { index: true, element: <UserListPage /> },
          { path: 'list', element: <UserListPage /> },
        ],
      },
      {
        path: 'doctor',
        children: [
          { index: true, element: <DoctorListPage /> },
          { path: 'list', element: <DoctorListPage /> },
        ],
      },
      {
        path: 'advantage',
        children: [
          { index: true, element: <AdvantageListPage /> },
          { path: 'list', element: <AdvantageListPage /> },
        ],
      },
      {
        path: 'founder',
        children: [
          { index: true, element: <FounderListPage /> },
          { path: 'list', element: <FounderListPage /> },
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

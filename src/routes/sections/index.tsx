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
    ],
  },

  // Auth
  ...authDemoRoutes,

  // Main
  ...mainRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];

/*
// Previously used pages (commented out for future reference)
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const WordBattle = lazy(() => import('src/pages/dashboard/word-battle/list'));
const CreateCategory = lazy(() => import('src/pages/dashboard/word-battle/create'));
const FlashCardList = lazy(() => import('src/pages/dashboard/flash-card/topicList'));
const CategoryListPage = lazy(() => import('src/pages/dashboard/category/list'));
const DoctorListPage = lazy(() => import('src/pages/dashboard/doctor/list'));
const AdvantageListPage = lazy(() => import('src/pages/dashboard/advantage/list'));
const FounderListPage = lazy(() => import('src/pages/dashboard/founder/list'));
*/

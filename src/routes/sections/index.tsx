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

/*
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const WordBattle = lazy(() => import('src/pages/dashboard/word-battle/list'));
const CreateCategory = lazy(() => import('src/pages/dashboard/word-battle/create'));
const FlashCardList = lazy(() => import('src/pages/dashboard/flash-card/topicList'));
*/

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
      /*
      {
        path: 'user',
        children: [{ path: 'list', element: <UserListPage /> }],
      },
      {
        path: 'word-battle',
        children: [
          { path: 'list', element: <WordBattle /> },
          { path: 'create', element: <CreateCategory /> },
        ],
      },
      */
    ],
  },

  // Auth
  ...authDemoRoutes,

  // Main
  ...mainRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];

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
// User
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
// Games  - Word Battle
const WordBattle = lazy(() => import('src/pages/dashboard/word-battle/list'));
const CreateCategory = lazy(() => import('src/pages/dashboard/word-battle/create'));
const WordBattleUserList = lazy(() => import('src/pages/dashboard/word-battle/users'));
const CategoryView = lazy(() => import('src/pages/dashboard/word-battle/categoryView'));
const Settings = lazy(() => import('src/pages/dashboard/word-battle/settingsGame'));
// Games - Flash Card
const FlashCardList = lazy(() => import('src/pages/dashboard/flash-card/topicList'));
const CreateTopic = lazy(() => import('src/pages/dashboard/flash-card/create'));
const EditTopic = lazy(() => import('src/pages/dashboard/flash-card/edit'));
const FlashCardTopicView = lazy(() => import('src/pages/dashboard/flash-card/view'));
const FlashCardCategoryList = lazy(() => import('src/pages/dashboard/flash-card/categoryList'));
// Games - 4Pics 1Word
const QuestionList = lazy(() => import('src/pages/dashboard/4pics-1word/list'));
const CreateQuestions = lazy(() => import('src/pages/dashboard/4pics-1word/create'));
const UpdateQuestion = lazy(() => import('src/pages/dashboard/4pics-1word/update'));
const SettingsPicsWord = lazy(() => import('src/pages/dashboard/4pics-1word/setting'));
// Games - Odd One Out
const OddOneOutQuestionsList = lazy(() => import('src/pages/dashboard/odd-one-out/list'));
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
        path: 'user',
        children: [{ path: 'list', element: <UserListPage /> }],
      },
      {
        path: 'word-battle',
        children: [
          { path: 'list', element: <WordBattle /> },
          { path: 'create', element: <CreateCategory /> },
          { path: 'players', element: <WordBattleUserList /> },
          { path: ':id/view', element: <CategoryView /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
      {
        path: 'flash-card',
        children: [
          {
            path: 'list',
            element: <FlashCardList />,
          },
          {
            path: 'create',
            element: <CreateTopic />,
          },
          {
            path: ':id/edit',
            element: <EditTopic />,
          },
          {
            path: ':id/view',
            element: <FlashCardTopicView />,
          },
          {
            path: 'category-list',
            element: <FlashCardCategoryList />,
          },
        ],
      },
      {
        path: 'pics-word',
        children: [
          {
            path: 'list',
            element: <QuestionList />,
          },
          {
            path: 'create',
            element: <CreateQuestions />,
          },
          {
            path: ':id/update',
            element: <UpdateQuestion />,
          },
          {
            path: 'settings',
            element: <SettingsPicsWord />,
          },
        ],
      },
      {
        path: 'odd-one-out',
        children: [
          {
            path: 'list',
            element: <OddOneOutQuestionsList />,
          },
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

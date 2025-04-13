import { createBrowserRouter, Navigate } from 'react-router-dom';
import PageLayout from '@/layouts/page.layout';
import LoginPage from '@/modules/Auth/login/login.page';
import Dashboard from '@/modules/Admin/Dashboard/dashboard';
import ProtectedRoute from '@/modules/Guard/protected-route';
import ResetPage from '@/modules/Auth/reset-password/rest.page';
import ForgotPasswordPage from '@/modules/Auth/forgot-password/forgot-password-page';
import UserLayout from '@/layouts/user.layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    Component: PageLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
    ],
  },
  {
    path: '/reset-password',
    Component: PageLayout,
    children: [
      {
        index: true,
        Component: ResetPage,
      },
    ],
  },

  {
    path: 'forgot-password',
    Component: PageLayout,
    children: [
      {
        index: true,
        Component: ForgotPasswordPage,
      },
    ],
  },

  {
    element: <UserLayout />,
    children: [
      {
        path: '/dashboard',
        Component: Dashboard,
      },
      {
        path: '/pos',
        Component: '',
      },
      {
        path: '/sales',
        Component: '',
      },
      {
        path: '/purchase',
        Component: '',
      },
      {
        path: '/customers',
        Component: '',
      },
      {
        path: '/employees',
        Component: '',
      },
      {
        path: '/payroll',
        Component: '',
      },
      {
        path: '/reports',
        Component: '',
      },
    ],
  },
]);

export default router;

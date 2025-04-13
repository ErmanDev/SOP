import { createBrowserRouter, Navigate } from 'react-router-dom';
import PageLayout from '@/layouts/page.layout';
import LoginPage from '@/modules/Auth/login/login.page';
import AdminLayout from '@/layouts/admin.layout';
import Dashboard from '@/modules/Admin/Dashboard/dashboard';
import UserPage from '@/modules/Admin/Employee/users/users.page';
import UsersList from '@/modules/Admin/Employee/users/user-list';
import ProtectedRoute from '@/modules/Guard/protected-route';
import DeductionPage from '@/modules/Admin/Employee/Deductions/deduction-page';
import DeductionList from '@/modules/Admin/Employee/Deductions/deduction.lists';
import ResetPage from '@/modules/Auth/reset-password/rest.page';
import ForgotPasswordPage from '@/modules/Auth/forgot-password/forgot-password-page';

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
    element: <AdminLayout />,
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

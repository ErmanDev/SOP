import { createBrowserRouter, Navigate } from 'react-router-dom';
import PageLayout from '@/layouts/page.layout';
import LoginPage from '@/modules/Auth/login/login.page';
import Dashboard from '@/modules/Admin/Dashboard/dashboard';
import ProtectedRoute from '@/modules/Guard/protected-route';
import ResetPage from '@/modules/Auth/reset-password/rest.page';
import ForgotPasswordPage from '@/modules/Auth/forgot-password/forgot-password-page';
import UserLayout from '@/layouts/user.layout';
import Customers from '@/modules/Admin/Customers/customers';
import Employees from '@/modules/Admin/Employees/employees';
import Purchase from '@/modules/Admin/Purchase/purchase';
import Sales from '@/modules/Admin/Sales/sales';
import Pos from '@/modules/Admin/Pos/pos';
import Payroll from '@/modules/Admin/Payroll/payroll';
import Reports from '@/modules/Admin/Reports/reports';

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
    element: <ProtectedRoute />,
    children: [
      {
        element: <UserLayout />,
        children: [
          {
            path: '/dashboard',
            Component: Dashboard,
          },
          {
            path: '/pos',
            Component: Pos,
          },
          {
            path: '/sales',
            Component: Sales,
          },
          {
            path: '/purchase',
            Component: Purchase,
          },
          {
            path: '/customers',
            Component: Customers,
          },
          {
            path: '/employees',
            Component: Employees,
          },
          {
            path: '/payroll',
            Component: Payroll,
          },
          {
            path: '/reports',
            Component: Reports,
          },
        ],
      },
    ],
  },
]);

export default router;

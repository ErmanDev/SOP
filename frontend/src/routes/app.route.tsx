import { createBrowserRouter, Navigate } from 'react-router-dom';
import PageLayout from '@/layouts/page.layout';
import LoginPage from '@/modules/Auth/login/login.page';
import AdminLayout from '@/layouts/admin.layout';
import DashboardPage from '@/modules/Admin/Dashboard/dashboard.page';
import OverviewDashboard from '@/modules/Admin/Dashboard/overviewDashboard.page';
import UserPage from '@/modules/Admin/Employee/users/users.page';
import UsersList from '@/modules/Admin/Employee/users/user-list';
import PayrollPage from '@/modules/Admin/Payroll/payroll.page';
import PayrollList from '@/modules/Admin/Payroll/payroll.list';
import TechinicianList from '@/modules/Admin/Payroll/fts.payroll';
// import ManagerList from '@/modules/Admin/Payroll/asm.payrol';
import ProtectedRoute from '@/modules/Guard/protected-route';
import AttendancePage from '@/modules/Admin/Attendance/attendance';
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
    path: '/dashboard',
    // element: <ProtectedRoute />,
    children: [
      {
        path: '',
        Component: AdminLayout,
        children: [
          {
            index: true,
            Component: OverviewDashboard,
          },

          {
            path: 'users',
            Component: UserPage,
            children: [
              {
                index: true,
                Component: UsersList,
              },
              {
                path: 'users-list',
                Component: UsersList,
              },
            ],
          },
          {
            path: 'attendance',
            Component: AttendancePage,
            children: [
              {
                index: true,
                Component: UsersList,
              },
              {
                path: 'users-list',
                Component: UsersList,
              },
            ],
          },
          {
            path: 'deductions',
            Component: DeductionPage,
            children: [
              {
                index: true,
                Component: DeductionList,
              },
              {
                path: 'deduction-list',
                Component: DeductionList,
              },
            ],
          },

          {
            path: 'payroll',
            Component: PayrollPage,
            children: [
              {
                index: true,
                Component: PayrollList,
              },
              {
                path: 'payroll-list',
                Component: PayrollList,
              },

              {
                path: 'technician-list',
                Component: TechinicianList,
              },
              //
              //               {
              //                 path: 'manager-list',
              //                 Component: ManagerList,
              //               },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;

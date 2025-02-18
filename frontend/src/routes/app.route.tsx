import { createBrowserRouter } from 'react-router-dom';
import PageLayout from '@/layouts/page.layout';
import LoginPage from '@/modules/Auth/login.page';
import AdminLayout from '@/layouts/admin.layout';
import DashboardPage from '@/modules/Admin/Dashboard/dashboard.page';
import OverviewDashboard from '@/modules/Admin/Dashboard/overviewDashboard.page';
import UserPage from '@/modules/Admin/Employee/users/users.page';
import UsersList from '@/modules/Admin/Employee/users/user-list';


export const router = createBrowserRouter([
  {
    path: '',
    Component: PageLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
    ],
  },

  {
    path: '/dashboard-app',
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "",
        Component: DashboardPage,
        children: [
          {
            index: true,
            Component: OverviewDashboard,
          },
          {
            path: "overview",
            Component: OverviewDashboard,
          },
        ],
        
      },
      {
        path: "users",
        Component: UserPage,
        children: [
          {
            index: true,
            Component: UsersList,
          },
          {
            path: "users-list",
            Component: UsersList,
          },
        ],
      }
    ],
  },

  
]);

export default router;

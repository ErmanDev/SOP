import { createBrowserRouter } from 'react-router-dom';
import PageLayout from '@/layouts/page.layout';
import LoginPage from '@/modules/Auth/login.page';
import AdminLayout from '@/layouts/admin.layout';
import DashboardPage from '@/modules/Admin/Dashboard/dashboard.page';
import OverviewDashboard from '@/modules/Admin/Dashboard/overviewDashboard.page';


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
      },{
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
          {
          },
        ],
      },
    ],
  },
]);

export default router;

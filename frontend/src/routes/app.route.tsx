import { createBrowserRouter } from "react-router-dom";
import PageLayout from "@/layouts/page.layout";
import LoginPage from "@/modules/Auth/login.page";
import AdminLayout from "@/layouts/admin.layout";
import DashboardPage from "@/modules/Admin/Dashboard/dashboard.page";



export const router = createBrowserRouter([ 

    {
        path: "",
        Component: PageLayout,
        children: [
          {
            index: true,
            Component: LoginPage,
          },
        ],
      },

      {
        path:"/dashboard-app",
        Component: AdminLayout,
        children: [
          {
            index: true,
            Component: DashboardPage,
          },
        ],
        
      },

]);

export default router;
import { createBrowserRouter } from "react-router-dom";

import PageLayout from "@/layouts/page.layout";
import LoginPage from "@/modules/Auth/login.page";



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

]);

export default router;
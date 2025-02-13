
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import LayoutPage from "@/modules/Admin/layout.page";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
  
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <LayoutPage>
            <Outlet />
          </LayoutPage>
        </SidebarInset>
      </SidebarProvider>
    )
  }
  
  export default AdminLayout
  
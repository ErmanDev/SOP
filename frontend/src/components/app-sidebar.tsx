import "@/assets/agro.jpg"
import * as React from "react"
import {

  BookOpen,

  Calendar,

  GalleryVerticalEnd,
  LayoutDashboardIcon,

  PersonStanding,

  Settings2,

} from "lucide-react"

import { NavMain } from "@/components/nav-main"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


const data = {
  user: {
    name: "HR Admin",
    email: "m@example.com",
    avatar: "/assets/agro.jpg",
  },
  teams: [
    {
      name: "AGROPRO",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
 
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard-app",
      icon: LayoutDashboardIcon,
      
    },
    {
      title: "Employees",
      url: "users",
      icon: PersonStanding,
      items: [
        {
          title: "Users",
          url: "users",
        },
        

        {
          title: "Cash Advance",
          url: "Cash-Advance",
        },
        
        {
          title: "Schedule",
          url: "#",
        },
        
      ],
    },

    {
      title: "Attendance",
      url: "#",
      icon: Calendar,

   
    },
    {
      title: "Payroll",
      url: "#",
      icon: BookOpen,

      items: [
        {
          title: "Employee Payroll",
          url: "payroll",
        },
        

        {
          title: "Employee Funds",
          url: "funds",
        },],

    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,

    
    },
  ],
 

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
    
      </SidebarContent>
      <SidebarFooter> 
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

import * as React from 'react';
import {
  BookOpen,
  Calendar,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  PersonStanding,
  Settings2,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';

import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const firstName = capitalizeWords(localStorage.getItem('first_name') || 'User');
const email = localStorage.getItem('email') || 'example@gmail.com';

const data = {
  user: {
    name: firstName,
    email: email,
    avatar: '../assets/logos.png',
  },
  teams: [
    {
      name: 'AGROPRO',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard-app',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Employees',
      url: 'users',
      icon: PersonStanding,
      items: [
        {
          title: 'Users',
          url: 'users',
        },

        {
          title: 'Cash Advance',
          url: 'Cash-Advance',
        },

        {
          title: 'Schedule',
          url: '#',
        },
      ],
    },

    {
      title: 'Attendance',
      url: '#',
      icon: Calendar,
    },
    {
      title: 'Payroll',
      url: '#',
      icon: BookOpen,

      items: [
        {
          title: 'Employee Payroll',
          url: 'payroll',
        },

        {
          title: 'Employee Funds',
          url: 'funds',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
  ],
};

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
  );
}

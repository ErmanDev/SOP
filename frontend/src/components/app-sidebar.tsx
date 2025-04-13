import * as React from 'react';
import {
  ClipboardMinus,
  Monitor,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  ShoppingBasket,
  Settings2,
  Percent,
  HandCoins,
  User2,
  Users,
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
import Cookies from 'js-cookie';

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: 'User',
    email: 'example@gmail.com',
    avatar: '../assets/logos.png',
  });

  React.useEffect(() => {
    const firstName = capitalizeWords(
      localStorage.getItem('first_name') || 'User'
    );
    const email = localStorage.getItem('email') || 'example@gmail.com';
    const avatar = Cookies.get('profile_url') || '../assets/logos.png';

    setUser({ name: firstName, email, avatar });
  }, []);

  const data = {
    user,
    teams: [
      {
        name: 'ABENSON',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
    ],
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboardIcon,
        roles: ['admin', 'employee'], // accessible by both
      },
      {
        title: 'POS',
        url: '/dashboard/users',
        icon: Monitor,
        roles: ['admin'], // only admin
      },
      {
        title: 'Sales',
        url: '/dashboard/attendance',
        icon: Percent,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Purchase',
        url: '#',
        icon: ShoppingBasket,
        roles: ['admin'],
      },
      {
        title: 'Customers',
        url: '#',
        icon: Users,
        roles: ['admin'],
      },
      {
        title: 'Employees',
        url: '#',
        icon: Settings2,
        roles: ['admin'],
      },
      {
        title: 'Payroll',
        url: '#',
        icon: HandCoins,
        roles: ['admin'],
      },
      {
        title: 'Reports',
        url: '#',
        icon: ClipboardMinus,
        roles: ['admin'],
      },
    ],
  };

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

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
import { get } from 'http';

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: '',
    email: '',
    avatar: '',
    role: '',
  });

  React.useEffect(() => {
    const firstName = capitalizeWords(
      localStorage.getItem('first_name') || 'User'
    );
    const email = localStorage.getItem('email') || 'example@gmail.com';
    const avatar = Cookies.get('profile_url') || '../assets/logos.png';
    const role = localStorage.getItem('user_role') || 'employee';

    setUser({ name: firstName, email, avatar, role });
  }, []);

  const getBasePath = (role) => {
    return role === 'admin' ? '/admin' : '/employee';
  };

  const basePath = getBasePath(user.role);

  const data = {
    user,
    teams: [
      {
        name: 'ABENSON',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
    ],
    // Apply the dynamic basePath to all navigation items
    navMain: [
      {
        title: 'Dashboard',
        url: `${basePath}/dashboard`,
        icon: LayoutDashboardIcon,
        roles: ['admin', 'employee'],
      },
      {
        title: 'POS',
        url: `${basePath}/users`,
        icon: Monitor,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Sales',
        url: `${basePath}/attendance`,
        icon: Percent,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Purchase',
        url: `${basePath}/purchase`,
        icon: ShoppingBasket,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Customers',
        url: `${basePath}/customers`,
        icon: Users,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Employees',
        url: `${basePath}/employees`,
        icon: Settings2,
        roles: ['admin'],
      },
      {
        title: 'Payroll',
        url: `${basePath}/payroll`,
        icon: HandCoins,
        roles: ['admin'],
      },
      {
        title: 'Reports',
        url: `${basePath}/reports`,
        icon: ClipboardMinus,
        roles: ['admin'],
      },
    ],
  };
  const filteredNavItems = data.navMain.filter((item) =>
    item.roles.includes(user.role)
  );
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

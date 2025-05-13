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
    name: '',
    email: '',
    avatar: '',
    role: '',
  });

  React.useEffect(() => {
    const firstName = capitalizeWords(Cookies.get('firstName') ?? 'User');
    const email = Cookies.get('email') ?? 'example@gmail.com';
    const avatar = Cookies.get('profile_url') ?? '../assets/logos.png';
    const role = Cookies.get('role_name') ?? 'employee';

    setUser({ name: firstName, email, avatar, role });
  }, []);

  const data = {
    user,
    teams: [
      {
        name: 'QuickMart',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
    ],

    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboardIcon,
        roles: ['admin', 'employee'],
      },
      {
        title: 'POS',
        url: '/pos',
        icon: Monitor,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Sales',
        url: '/sales',
        icon: Percent,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Purchase',
        url: '/purchase',
        icon: ShoppingBasket,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Customers',
        url: '/customers',
        icon: Users,
        roles: ['admin', 'employee'],
      },
      {
        title: 'Employees',
        url: '/employees',
        icon: Settings2,
        roles: ['admin'],
      },
      {
        title: 'Payroll',
        url: '/payroll',
        icon: HandCoins,
        roles: ['admin'],
      },
      {
        title: 'Reports',
        url: '/reports',
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

'use client';

import {
  Building2Icon, LayoutDashboardIcon, MapPinIcon, RouteIcon, SettingsIcon, TagIcon, UsersIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navMain = [
  {
    title: 'Обзор',
    url: '/admin',
    icon: <LayoutDashboardIcon />,
  },
  {
    title: 'Города',
    url: '/admin/cities',
    icon: <Building2Icon />,
  },
  {
    title: 'Категории',
    url: '/admin/categories',
    icon: <TagIcon />,
  },
  {
    title: 'Места',
    url: '/admin/places',
    icon: <MapPinIcon />,
  },
  {
    title: 'Маршруты',
    url: '/admin/routes',
    icon: <RouteIcon />,
  },
  {
    title: 'Настройки',
    url: '/admin/settings',
    icon: <SettingsIcon />,
  },
];

const navSuperadmin = {
  title: 'Админы',
  url: '/admin/admins',
  icon: <UsersIcon />,
};

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  user: { name: string; email: string };
  isSuperadmin: boolean;
  onSignOut: () => Promise<void>;
}

export function AppSidebar(props: AppSidebarProps) {
  const {
    user, isSuperadmin, onSignOut, ...sidebarProps
  } = props;
  const items = isSuperadmin ? [...navMain, navSuperadmin] : navMain;

  return (
    <Sidebar collapsible="offcanvas" {...sidebarProps}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-2 py-1.5 text-base font-semibold">VK Знакомства</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onSignOut={onSignOut} />
      </SidebarFooter>
    </Sidebar>
  );
}

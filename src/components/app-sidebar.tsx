'use client';

import {
  Building2Icon, LayoutDashboardIcon, MapPinIcon, RouteIcon, SettingsIcon, TagIcon,
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

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  user: { name: string; email: string };
  onSignOut: () => Promise<void>;
}

export function AppSidebar(props: AppSidebarProps) {
  const { user, onSignOut, ...sidebarProps } = props;

  return (
    <Sidebar collapsible="offcanvas" {...sidebarProps}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-2 py-1.5 text-base font-semibold">VK Знакомства</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onSignOut={onSignOut} />
      </SidebarFooter>
    </Sidebar>
  );
}

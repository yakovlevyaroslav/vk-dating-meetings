import type { CSSProperties, ReactNode } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth, signOut } from '@/core/auth/auth';

interface AdminShellLayoutProps {
  children: ReactNode;
}

export default async function AdminShellLayout(props: AdminShellLayoutProps) {
  const { children } = props;
  const session = await auth();

  async function handleSignOut() {
    'use server';
    await signOut({
      redirectTo: '/admin/login',
    });
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: session?.user.name ?? 'Админ',
          email: session?.user.email ?? '',
        }}
        onSignOut={handleSignOut}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

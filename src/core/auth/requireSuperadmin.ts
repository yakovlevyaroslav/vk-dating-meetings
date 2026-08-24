import { redirect } from 'next/navigation';

import { auth } from './auth';

export async function requireSuperadminSession() {
  const session = await auth();

  if (session?.user.role !== 'SUPERADMIN') {
    redirect('/admin');
  }

  return session;
}

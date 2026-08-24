'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireSuperadminSession } from '@/core/auth/requireSuperadmin';
import { prisma } from '@/core/db/prisma';

const PASSWORD_MIN_LENGTH = 8;

function readRole(formData: FormData): 'ADMIN' | 'SUPERADMIN' {
  return formData.get('role') === 'SUPERADMIN' ? 'SUPERADMIN' : 'ADMIN';
}

async function isLastSuperadmin(adminId: string): Promise<boolean> {
  const target = await prisma.adminUser.findUnique({
    where: {
      id: adminId,
    },
  });

  if (target?.role !== 'SUPERADMIN') {
    return false;
  }

  const superadminCount = await prisma.adminUser.count({
    where: {
      role: 'SUPERADMIN',
    },
  });

  return superadminCount <= 1;
}

export async function createAdminUser(_prevState: string | undefined, formData: FormData) {
  await requireSuperadminSession();

  const email = String(formData.get('email') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const role = readRole(formData);

  if (!email || !password) {
    return 'Заполните email и пароль';
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Пароль должен быть не короче ${PASSWORD_MIN_LENGTH} символов`;
  }

  const existing = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    return 'Админ с таким email уже существует';
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.create({
    data: {
      email, name: name || null, role, passwordHash,
    },
  });

  revalidatePath('/admin/admins');
  redirect('/admin/admins');
}

export async function updateAdminUser(adminId: string, _prevState: string | undefined, formData: FormData) {
  await requireSuperadminSession();

  const name = String(formData.get('name') ?? '').trim();
  const role = readRole(formData);
  const password = String(formData.get('password') ?? '');

  if (password && password.length < PASSWORD_MIN_LENGTH) {
    return `Пароль должен быть не короче ${PASSWORD_MIN_LENGTH} символов`;
  }

  if (role !== 'SUPERADMIN' && (await isLastSuperadmin(adminId))) {
    return 'Нельзя понизить последнего суперадмина';
  }

  await prisma.adminUser.update({
    where: {
      id: adminId,
    },
    data: {
      name: name || null,
      role,
      ...(password ? {
        passwordHash: await bcrypt.hash(password, 10),
      } : {
      }),
    },
  });

  revalidatePath('/admin/admins');
  redirect('/admin/admins');
}

export async function deleteAdminUser(adminId: string) {
  const session = await requireSuperadminSession();

  if (session.user.id === adminId) {
    throw new Error('Нельзя удалить свою учётку');
  }
  if (await isLastSuperadmin(adminId)) {
    throw new Error('Нельзя удалить последнего суперадмина');
  }

  await prisma.adminUser.delete({
    where: {
      id: adminId,
    },
  });

  revalidatePath('/admin/admins');
  redirect('/admin/admins');
}

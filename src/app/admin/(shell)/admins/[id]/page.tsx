import { notFound } from 'next/navigation';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { requireSuperadminSession } from '@/core/auth/requireSuperadmin';
import { prisma } from '@/core/db/prisma';

import { AdminUserForm } from '../AdminUserForm';
import { deleteAdminUser, updateAdminUser } from '../actions';

interface EditAdminPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAdminPage(props: EditAdminPageProps) {
  const { id } = await props.params;
  const session = await requireSuperadminSession();

  const [admin, superadminCount] = await Promise.all([
    prisma.adminUser.findUnique({
      where: {
        id,
      },
    }),
    prisma.adminUser.count({
      where: {
        role: 'SUPERADMIN',
      },
    }),
  ]);

  if (!admin) {
    notFound();
  }

  const currentAdmin = admin;
  const isSelf = session.user.id === currentAdmin.id;
  const isLastSuperadmin = currentAdmin.role === 'SUPERADMIN' && superadminCount <= 1;
  const canDelete = !isSelf && !isLastSuperadmin;

  const updateAdminUserWithId = updateAdminUser.bind(null, currentAdmin.id);

  async function handleDelete() {
    'use server';
    await deleteAdminUser(currentAdmin.id);
  }

  return (
    <>
      <SiteHeader title={currentAdmin.email} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <AdminUserForm
          action={updateAdminUserWithId}
          submitLabel="Сохранить"
          isNew={false}
          defaultValues={{
            email: currentAdmin.email,
            name: currentAdmin.name ?? '',
            role: currentAdmin.role,
          }}
        />
        {canDelete ? (
          <form action={handleDelete}>
            <Button type="submit" variant="destructive">
              Удалить админа
            </Button>
          </form>
        ) : (
          <p className="max-w-md text-sm text-muted-foreground">
            {isSelf
              ? 'Нельзя удалить свою учётку.'
              : 'Нельзя удалить последнего суперадмина — сначала назначьте другого.'}
          </p>
        )}
      </div>
    </>
  );
}

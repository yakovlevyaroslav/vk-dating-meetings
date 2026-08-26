import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { requireSuperadminSession } from '@/core/auth/requireSuperadmin';
import { prisma } from '@/core/db/prisma';

const ROLE_LABEL: Record<string, string> = {
  SUPERADMIN: 'Суперадмин',
  ADMIN: 'Админ',
};

export default async function AdminAdminsPage() {
  await requireSuperadminSession();

  const admins = await prisma.adminUser.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  return (
    <>
      <SiteHeader title="Админы" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Button render={<Link href="/admin/admins/new" />} nativeButton={false} className="w-fit">
          Добавить админа
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Логин</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Создан</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <Link href={`/admin/admins/${admin.id}`} className="underline-offset-4 hover:underline">
                    {admin.email}
                  </Link>
                </TableCell>
                <TableCell>{admin.name ?? '—'}</TableCell>
                <TableCell>{ROLE_LABEL[admin.role]}</TableCell>
                <TableCell className="text-muted-foreground">
                  {admin.createdAt.toLocaleDateString('ru-RU')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

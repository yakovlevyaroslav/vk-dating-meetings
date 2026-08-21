import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { prisma } from '@/core/db/prisma';

export default async function AdminRoutesPage() {
  const routes = await prisma.route.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      city: true,
      _count: {
        select: {
          stops: true,
        },
      },
    },
  });

  return (
    <>
      <SiteHeader title="Маршруты" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Button render={<Link href="/admin/routes/new" />} nativeButton={false} className="w-fit">
          Добавить маршрут
        </Button>
        {routes.length === 0 ? (
          <p className="text-muted-foreground">Пока нет ни одного маршрута.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Остановок</TableHead>
                <TableHead>Опубликовано</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <Link href={`/admin/routes/${route.id}`} className="underline-offset-4 hover:underline">
                      {route.name}
                    </Link>
                  </TableCell>
                  <TableCell>{route.city.name}</TableCell>
                  <TableCell>{route._count.stops}</TableCell>
                  <TableCell>{route.isPublished ? 'Да' : 'Нет'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

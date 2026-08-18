import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { prisma } from '@/core/db/prisma';

export default async function AdminPlacesPage() {
  const places = await prisma.place.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      city: true,
      category: true,
      _count: {
        select: {
          venues: true,
        },
      },
    },
  });

  return (
    <>
      <SiteHeader title="Места" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Button render={<Link href="/admin/places/new" />} nativeButton={false} className="w-fit">
          Добавить место
        </Button>
        {places.length === 0 ? (
          <p className="text-muted-foreground">Пока нет ни одного места.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Точек</TableHead>
                <TableHead>Приоритет</TableHead>
                <TableHead>Опубликовано</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {places.map((place) => (
                <TableRow key={place.id}>
                  <TableCell>
                    <Link href={`/admin/places/${place.id}`} className="underline-offset-4 hover:underline">
                      {place.name}
                    </Link>
                  </TableCell>
                  <TableCell>{place.city.name}</TableCell>
                  <TableCell className="text-muted-foreground">{place.category?.name ?? '—'}</TableCell>
                  <TableCell>{place._count.venues}</TableCell>
                  <TableCell>{place.priority}</TableCell>
                  <TableCell>{place.isPublished ? 'Да' : 'Нет'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

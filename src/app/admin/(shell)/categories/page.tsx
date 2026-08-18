import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { prisma } from '@/core/db/prisma';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          places: true,
        },
      },
    },
  });

  return (
    <>
      <SiteHeader title="Категории" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Button render={<Link href="/admin/categories/new" />} nativeButton={false} className="w-fit">
          Добавить категорию
        </Button>
        {categories.length === 0 ? (
          <p className="text-muted-foreground">Пока нет ни одной категории.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Эмодзи</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Мест</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.emoji ?? '—'}</TableCell>
                  <TableCell>
                    <Link href={`/admin/categories/${category.id}`} className="underline-offset-4 hover:underline">
                      {category.name}
                    </Link>
                  </TableCell>
                  <TableCell>{category._count.places}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

import { SiteHeader } from '@/components/site-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { prisma } from '@/core/db/prisma';

export default async function AdminCitiesPage() {
  const cities = await prisma.city.findMany({
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
      <SiteHeader title="Города" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Мест</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell>{city.name}</TableCell>
                <TableCell className="text-muted-foreground">/{city.slug}</TableCell>
                <TableCell>{city._count.places}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

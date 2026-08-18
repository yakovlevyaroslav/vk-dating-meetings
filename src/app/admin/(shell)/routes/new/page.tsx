import { SiteHeader } from '@/components/site-header';
import { prisma } from '@/core/db/prisma';

import { createRoute } from '../actions';
import { RouteForm } from '../RouteForm';

export default async function NewRoutePage() {
  const [cities, places] = await Promise.all([
    prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.place.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        venues: {
          select: {
            id: true, name: true,
          },
        },
      },
    }),
  ]);

  return (
    <>
      <SiteHeader title="Новый маршрут" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <RouteForm action={createRoute} cities={cities} places={places} submitLabel="Создать" />
      </div>
    </>
  );
}

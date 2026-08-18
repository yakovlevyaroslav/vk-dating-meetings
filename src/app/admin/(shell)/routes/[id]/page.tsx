import { notFound } from 'next/navigation';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { prisma } from '@/core/db/prisma';

import { deleteRoute, updateRoute } from '../actions';
import { RouteForm } from '../RouteForm';

interface EditRoutePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRoutePage(props: EditRoutePageProps) {
  const { id } = await props.params;

  const [route, cities, places] = await Promise.all([
    prisma.route.findUnique({
      where: {
        id,
      },
      include: {
        stops: {
          orderBy: {
            order: 'asc',
          },
          include: {
            place: true, placeVenue: true,
          },
        },
      },
    }),
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

  if (!route) {
    notFound();
  }

  const currentRoute = route;
  const updateRouteWithId = updateRoute.bind(null, currentRoute.id);

  async function handleDelete() {
    'use server';
    await deleteRoute(currentRoute.id);
  }

  return (
    <>
      <SiteHeader title={currentRoute.name} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <RouteForm
          action={updateRouteWithId}
          cities={cities}
          places={places}
          submitLabel="Сохранить"
          defaultValues={{
            cityId: currentRoute.cityId,
            name: currentRoute.name,
            description: currentRoute.description,
            image: currentRoute.image,
            typeEmoji: currentRoute.typeEmoji ?? '',
            typeLabel: currentRoute.typeLabel ?? '',
            isPublished: currentRoute.isPublished,
            stops: currentRoute.stops.map((stop) => ({
              placeVenueId: stop.placeVenueId,
              placeName: stop.place.name,
              venueName: stop.placeVenue.name,
            })),
          }}
        />
        <form action={handleDelete}>
          <Button type="submit" variant="destructive">
            Удалить маршрут
          </Button>
        </form>
      </div>
    </>
  );
}

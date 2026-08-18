import { notFound } from 'next/navigation';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { prisma } from '@/core/db/prisma';

import { deletePlace, updatePlace } from '../actions';
import { PlaceForm } from '../PlaceForm';

interface EditPlacePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlacePage(props: EditPlacePageProps) {
  const { id } = await props.params;

  const [place, cities, categories] = await Promise.all([
    prisma.place.findUnique({
      where: {
        id,
      },
      include: {
        venues: true,
      },
    }),
    prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ]);

  if (!place) {
    notFound();
  }

  const currentPlace = place;
  const updatePlaceWithId = updatePlace.bind(null, currentPlace.id);

  async function handleDelete() {
    'use server';
    await deletePlace(currentPlace.id);
  }

  return (
    <>
      <SiteHeader title={place.name} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <PlaceForm
          action={updatePlaceWithId}
          cities={cities}
          categories={categories}
          submitLabel="Сохранить"
          defaultValues={{
            cityId: place.cityId,
            name: place.name,
            description: place.description,
            categoryId: place.categoryId ?? '',
            thumbnailImage: place.thumbnailImage,
            largeImage: place.largeImage,
            linkUrl: place.linkUrl ?? '',
            promoDescription: place.promoDescription ?? '',
            promoCode: place.promoCode ?? '',
            priority: String(place.priority),
            isPublished: place.isPublished,
            venues: place.venues.map((venue) => ({
              id: venue.id,
              name: venue.name,
              address: venue.address ?? '',
              latitude: String(venue.latitude),
              longitude: String(venue.longitude),
              hasBonus: venue.hasBonus,
            })),
          }}
        />
        <form action={handleDelete}>
          <Button type="submit" variant="destructive">
            Удалить место
          </Button>
        </form>
      </div>
    </>
  );
}

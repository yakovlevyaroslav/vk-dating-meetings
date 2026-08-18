import { SiteHeader } from '@/components/site-header';
import { prisma } from '@/core/db/prisma';

import { createPlace } from '../actions';
import { PlaceForm } from '../PlaceForm';

export default async function NewPlacePage() {
  const [cities, categories] = await Promise.all([
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

  return (
    <>
      <SiteHeader title="Новое место" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <PlaceForm action={createPlace} cities={cities} categories={categories} submitLabel="Создать" />
      </div>
    </>
  );
}

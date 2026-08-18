'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/core/db/prisma';

interface VenueInput {
  id?: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  hasBonus: boolean;
}

function parseVenues(raw: FormDataEntryValue | null): VenueInput[] | null {
  if (typeof raw !== 'string') {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VenueInput[]) : null;
  } catch {
    return null;
  }
}

function validateVenues(venues: VenueInput[] | null): string | null {
  if (!venues || venues.length === 0) {
    return 'Нужна хотя бы одна точка на карте';
  }

  for (const venue of venues) {
    if (!venue.name.trim()) {
      return 'У каждой точки должно быть название';
    }
    if (!Number.isFinite(Number(venue.latitude)) || !Number.isFinite(Number(venue.longitude))) {
      return 'Координаты точки должны быть числами';
    }
  }

  return null;
}

function readPlaceFields(formData: FormData) {
  const priorityRaw = Number(formData.get('priority'));

  return {
    cityId: String(formData.get('cityId') ?? ''),
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    categoryId: String(formData.get('categoryId') ?? '').trim() || null,
    thumbnailImage: String(formData.get('thumbnailImage') ?? '').trim() || null,
    largeImage: String(formData.get('largeImage') ?? '').trim() || null,
    linkUrl: String(formData.get('linkUrl') ?? '').trim() || null,
    promoDescription: String(formData.get('promoDescription') ?? '').trim() || null,
    promoCode: String(formData.get('promoCode') ?? '').trim() || null,
    priority: Number.isFinite(priorityRaw) ? priorityRaw : 0,
    isPublished: formData.get('isPublished') === 'on',
  };
}

export async function createPlace(_prevState: string | undefined, formData: FormData) {
  const fields = readPlaceFields(formData);
  const venues = parseVenues(formData.get('venues'));
  const venuesError = validateVenues(venues);

  if (!fields.cityId || !fields.name) {
    return 'Заполните название и город';
  }
  if (venuesError || !venues) {
    return venuesError ?? 'Не удалось прочитать точки';
  }

  await prisma.place.create({
    data: {
      ...fields,
      venues: {
        create: venues.map((venue) => ({
          name: venue.name,
          address: venue.address.trim() || null,
          latitude: Number(venue.latitude),
          longitude: Number(venue.longitude),
          hasBonus: venue.hasBonus,
        })),
      },
    },
  });

  revalidatePath('/admin/places');
  redirect('/admin/places');
}

export async function updatePlace(placeId: string, _prevState: string | undefined, formData: FormData) {
  const fields = readPlaceFields(formData);
  const venues = parseVenues(formData.get('venues'));
  const venuesError = validateVenues(venues);

  if (!fields.cityId || !fields.name) {
    return 'Заполните название и город';
  }
  if (venuesError || !venues) {
    return venuesError ?? 'Не удалось прочитать точки';
  }

  const existingVenues = await prisma.placeVenue.findMany({
    where: {
      placeId,
    },
    select: {
      id: true,
    },
  });
  const existingIds = new Set(existingVenues.map((venue) => venue.id));
  const incomingIds = new Set(venues.filter((venue) => venue.id).map((venue) => venue.id as string));
  const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));

  await prisma.$transaction([
    prisma.place.update({
      where: {
        id: placeId,
      },
      data: fields,
    }),
    ...(idsToDelete.length > 0 ? [prisma.placeVenue.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    })] : []),
    ...venues.map((venue) =>
      venue.id
        ? prisma.placeVenue.update({
            where: {
              id: venue.id,
            },
            data: {
              name: venue.name,
              address: venue.address.trim() || null,
              latitude: Number(venue.latitude),
              longitude: Number(venue.longitude),
              hasBonus: venue.hasBonus,
            },
          })
        : prisma.placeVenue.create({
            data: {
              placeId,
              name: venue.name,
              address: venue.address.trim() || null,
              latitude: Number(venue.latitude),
              longitude: Number(venue.longitude),
              hasBonus: venue.hasBonus,
            },
          }),
    ),
  ]);

  revalidatePath('/admin/places');
  redirect('/admin/places');
}

export async function deletePlace(placeId: string) {
  await prisma.place.delete({
    where: {
      id: placeId,
    },
  });
  revalidatePath('/admin/places');
  redirect('/admin/places');
}

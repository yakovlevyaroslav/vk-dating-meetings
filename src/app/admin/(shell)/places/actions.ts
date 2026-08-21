'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/core/db/prisma';

const DESCRIPTION_MAX_LENGTH = 200;

interface VenueInput {
  id?: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  hasBonus: boolean;
  isPrimary: boolean;
  showInBonuses: boolean;
  description: string;
  promoDescription: string;
  promoCode: string;
}

function venueData(venue: VenueInput) {
  return {
    name: venue.name,
    address: venue.address.trim() || null,
    latitude: Number(venue.latitude),
    longitude: Number(venue.longitude),
    hasBonus: venue.hasBonus,
    isPrimary: venue.isPrimary,
    showInBonuses: venue.showInBonuses,
    description: venue.description.trim() || null,
    promoDescription: venue.promoDescription.trim() || null,
    promoCode: venue.promoCode.trim() || null,
  };
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

function validatePlaceFields(fields: { cityId: string; name: string; description: string }): string | null {
  if (!fields.cityId || !fields.name) {
    return 'Заполните название и город';
  }
  if (fields.description.length > DESCRIPTION_MAX_LENGTH) {
    return `Описание не должно превышать ${DESCRIPTION_MAX_LENGTH} символов`;
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
    hasBonus: formData.get('hasBonus') === 'on',
  };
}

export async function createPlace(_prevState: string | undefined, formData: FormData) {
  const fields = readPlaceFields(formData);
  const venues = parseVenues(formData.get('venues'));
  const venuesError = validateVenues(venues);
  const fieldsError = validatePlaceFields(fields);

  if (fieldsError) {
    return fieldsError;
  }
  if (venuesError || !venues) {
    return venuesError ?? 'Не удалось прочитать точки';
  }

  await prisma.place.create({
    data: {
      ...fields,
      venues: {
        create: venues.map((venue) => venueData(venue)),
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
  const fieldsError = validatePlaceFields(fields);

  if (fieldsError) {
    return fieldsError;
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
            data: venueData(venue),
          })
        : prisma.placeVenue.create({
            data: {
              placeId,
              ...venueData(venue),
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

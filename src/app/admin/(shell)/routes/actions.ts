'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/core/db/prisma';

function readRouteFields(formData: FormData) {
  return {
    cityId: String(formData.get('cityId') ?? ''),
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    image: String(formData.get('image') ?? '').trim() || null,
    typeEmoji: String(formData.get('typeEmoji') ?? '').trim() || null,
    typeLabel: String(formData.get('typeLabel') ?? '').trim() || null,
    isPublished: formData.get('isPublished') === 'on',
  };
}

function parseStopIds(raw: FormDataEntryValue | null): string[] | null {
  if (typeof raw !== 'string') {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? (parsed as string[]) : null;
  } catch {
    return null;
  }
}

async function resolveStopPlaceIds(stopIds: string[]): Promise<Map<string, string> | string> {
  const venues = await prisma.placeVenue.findMany({
    where: {
      id: {
        in: stopIds,
      },
    },
    select: {
      id: true, placeId: true,
    },
  });
  const venueToPlace = new Map(venues.map((venue) => [venue.id, venue.placeId]));

  if (!stopIds.every((id) => venueToPlace.has(id))) {
    return 'Некоторые точки в маршруте больше не существуют — обновите список остановок';
  }

  return venueToPlace;
}

export async function createRoute(_prevState: string | undefined, formData: FormData) {
  const fields = readRouteFields(formData);
  const stopIds = parseStopIds(formData.get('stops'));

  if (!fields.cityId || !fields.name) {
    return 'Заполните название и город';
  }
  if (!stopIds || stopIds.length === 0) {
    return 'Добавьте хотя бы одну остановку';
  }

  const venueToPlace = await resolveStopPlaceIds(stopIds);
  if (typeof venueToPlace === 'string') {
    return venueToPlace;
  }

  await prisma.route.create({
    data: {
      ...fields,
      stops: {
        create: stopIds.map((placeVenueId, index) => ({
          order: index,
          placeVenueId,
          placeId: venueToPlace.get(placeVenueId) as string,
        })),
      },
    },
  });

  revalidatePath('/admin/routes');
  redirect('/admin/routes');
}

export async function updateRoute(routeId: string, _prevState: string | undefined, formData: FormData) {
  const fields = readRouteFields(formData);
  const stopIds = parseStopIds(formData.get('stops'));

  if (!fields.cityId || !fields.name) {
    return 'Заполните название и город';
  }
  if (!stopIds || stopIds.length === 0) {
    return 'Добавьте хотя бы одну остановку';
  }

  const venueToPlace = await resolveStopPlaceIds(stopIds);
  if (typeof venueToPlace === 'string') {
    return venueToPlace;
  }

  await prisma.$transaction([
    prisma.route.update({
      where: {
        id: routeId,
      },
      data: fields,
    }),
    prisma.routeStop.deleteMany({
      where: {
        routeId,
      },
    }),
    prisma.routeStop.createMany({
      data: stopIds.map((placeVenueId, index) => ({
        routeId,
        placeVenueId,
        placeId: venueToPlace.get(placeVenueId) as string,
        order: index,
      })),
    }),
  ]);

  revalidatePath('/admin/routes');
  redirect('/admin/routes');
}

export async function deleteRoute(routeId: string) {
  await prisma.route.delete({
    where: {
      id: routeId,
    },
  });
  revalidatePath('/admin/routes');
  redirect('/admin/routes');
}

interface QuickCreatePlaceInput {
  cityId: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}

export async function quickCreatePlace(input: QuickCreatePlaceInput) {
  const cityId = input.cityId.trim();
  const name = input.name.trim();
  const latitude = Number(input.latitude);
  const longitude = Number(input.longitude);

  if (!cityId || !name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Заполните город, название и координаты');
  }

  const place = await prisma.place.create({
    data: {
      cityId,
      name,
      description: '',
      venues: {
        create: [{
          name, address: input.address.trim() || null, latitude, longitude,
        }],
      },
    },
    include: {
      venues: true,
    },
  });

  revalidatePath('/admin/places');

  return {
    placeId: place.id, placeName: place.name, venue: place.venues[0],
  };
}

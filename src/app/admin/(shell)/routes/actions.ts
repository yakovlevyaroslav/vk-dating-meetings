'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/core/db/prisma';

const DESCRIPTION_MAX_LENGTH = 200;
const STOP_DESCRIPTION_MAX_LENGTH = 120;

interface StopInput {
  placeVenueId: string;
  description: string;
}

function readRouteFields(formData: FormData) {
  return {
    cityId: String(formData.get('cityId') ?? ''),
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    image: String(formData.get('image') ?? '').trim() || null,
    isPublished: formData.get('isPublished') === 'on',
  };
}

function validateRouteFields(fields: { cityId: string; name: string; description: string }): string | null {
  if (!fields.cityId || !fields.name) {
    return 'Заполните название и город';
  }
  if (fields.description.length > DESCRIPTION_MAX_LENGTH) {
    return `Описание не должно превышать ${DESCRIPTION_MAX_LENGTH} символов`;
  }
  return null;
}

function parseStops(raw: FormDataEntryValue | null): StopInput[] | null {
  if (typeof raw !== 'string') {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }
    const isValid = parsed.every(
      (item) =>
        typeof item === 'object' && item !== null
        && typeof (item as StopInput).placeVenueId === 'string'
        && typeof (item as StopInput).description === 'string',
    );
    return isValid ? (parsed as StopInput[]) : null;
  } catch {
    return null;
  }
}

function validateStops(stops: StopInput[] | null): string | null {
  if (!stops || stops.length === 0) {
    return 'Добавьте хотя бы одну остановку';
  }
  for (const stop of stops) {
    if (stop.description.length > STOP_DESCRIPTION_MAX_LENGTH) {
      return `Описание остановки не должно превышать ${STOP_DESCRIPTION_MAX_LENGTH} символов`;
    }
  }
  return null;
}

async function resolveStopPlaceIds(stops: StopInput[]): Promise<Map<string, string> | string> {
  const venues = await prisma.placeVenue.findMany({
    where: {
      id: {
        in: stops.map((stop) => stop.placeVenueId),
      },
    },
    select: {
      id: true, placeId: true,
    },
  });
  const venueToPlace = new Map(venues.map((venue) => [venue.id, venue.placeId]));

  if (!stops.every((stop) => venueToPlace.has(stop.placeVenueId))) {
    return 'Некоторые точки в маршруте больше не существуют — обновите список остановок';
  }

  return venueToPlace;
}

export async function createRoute(_prevState: string | undefined, formData: FormData) {
  const fields = readRouteFields(formData);
  const stops = parseStops(formData.get('stops'));
  const fieldsError = validateRouteFields(fields);
  const stopsError = validateStops(stops);

  if (fieldsError) {
    return fieldsError;
  }
  if (stopsError || !stops) {
    return stopsError ?? 'Не удалось прочитать остановки';
  }

  const venueToPlace = await resolveStopPlaceIds(stops);
  if (typeof venueToPlace === 'string') {
    return venueToPlace;
  }

  await prisma.route.create({
    data: {
      ...fields,
      stops: {
        create: stops.map((stop, index) => ({
          order: index,
          placeVenueId: stop.placeVenueId,
          placeId: venueToPlace.get(stop.placeVenueId) as string,
          description: stop.description.trim() || null,
        })),
      },
    },
  });

  revalidatePath('/admin/routes');
  redirect('/admin/routes');
}

export async function updateRoute(routeId: string, _prevState: string | undefined, formData: FormData) {
  const fields = readRouteFields(formData);
  const stops = parseStops(formData.get('stops'));
  const fieldsError = validateRouteFields(fields);
  const stopsError = validateStops(stops);

  if (fieldsError) {
    return fieldsError;
  }
  if (stopsError || !stops) {
    return stopsError ?? 'Не удалось прочитать остановки';
  }

  const venueToPlace = await resolveStopPlaceIds(stops);
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
      data: stops.map((stop, index) => ({
        routeId,
        placeVenueId: stop.placeVenueId,
        placeId: venueToPlace.get(stop.placeVenueId) as string,
        order: index,
        description: stop.description.trim() || null,
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

import { prisma } from '@/core/db/prisma';

export async function getCityPageData(slug: string) {
  const city = await prisma.city.findUnique({
    where: {
      slug,
    },
    include: {
      places: {
        where: {
          isPublished: true,
        },
        orderBy: [{
          priority: 'desc',
        }, {
          name: 'asc',
        }],
        include: {
          venues: true,
          category: true,
        },
      },
      routes: {
        where: {
          isPublished: true,
        },
        orderBy: {
          name: 'asc',
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
      },
    },
  });

  return city;
}

export type CityPageData = NonNullable<Awaited<ReturnType<typeof getCityPageData>>>;

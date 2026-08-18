import { SiteHeader } from '@/components/site-header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/core/db/prisma';

export default async function AdminOverviewPage() {
  const [citiesCount, placesCount, publishedPlacesCount, routesCount] = await Promise.all([
    prisma.city.count(),
    prisma.place.count(),
    prisma.place.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.route.count(),
  ]);

  return (
    <>
      <SiteHeader title="Обзор" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Города</CardDescription>
              <CardTitle className="text-3xl">{citiesCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Места</CardDescription>
              <CardTitle className="text-3xl">{placesCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Опубликовано</CardDescription>
              <CardTitle className="text-3xl">{publishedPlacesCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Маршруты</CardDescription>
              <CardTitle className="text-3xl">{routesCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}

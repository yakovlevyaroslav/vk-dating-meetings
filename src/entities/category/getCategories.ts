import { prisma } from '@/core/db/prisma';

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: [{
      priority: 'desc',
    }, {
      name: 'asc',
    }],
  });
}

export type Category = Awaited<ReturnType<typeof getCategories>>[number];

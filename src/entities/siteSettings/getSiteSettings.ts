import { prisma } from '@/core/db/prisma';

const DEFAULT_SETTINGS = {
  showRoutesSection: true,
  showBonusesSection: true,
};

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: 'main',
    },
  });

  return settings ?? DEFAULT_SETTINGS;
}

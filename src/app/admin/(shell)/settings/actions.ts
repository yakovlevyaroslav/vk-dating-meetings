'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/core/db/prisma';

export async function updateSiteSettings(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const showRoutesSection = formData.get('showRoutesSection') === 'on';
  const showBonusesSection = formData.get('showBonusesSection') === 'on';

  await prisma.siteSettings.upsert({
    where: {
      id: 'main',
    },
    create: {
      id: 'main',
      showRoutesSection,
      showBonusesSection,
    },
    update: {
      showRoutesSection,
      showBonusesSection,
    },
  });

  revalidatePath('/admin/settings');
  return undefined;
}

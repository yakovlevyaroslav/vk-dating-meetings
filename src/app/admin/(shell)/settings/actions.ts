'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/core/db/prisma';

export async function updateSiteSettings(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const showRoutesSection = formData.get('showRoutesSection') === 'on';
  const showBonusesSection = formData.get('showBonusesSection') === 'on';
  const suggestPlaceUrl = String(formData.get('suggestPlaceUrl') ?? '').trim() || null;

  await prisma.siteSettings.upsert({
    where: {
      id: 'main',
    },
    create: {
      id: 'main',
      showRoutesSection,
      showBonusesSection,
      suggestPlaceUrl,
    },
    update: {
      showRoutesSection,
      showBonusesSection,
      suggestPlaceUrl,
    },
  });

  revalidatePath('/admin/settings');
  return undefined;
}

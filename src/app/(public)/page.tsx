import type { Metadata } from 'next';

import { CityPage } from '@/widgets/CityPage/CityPage';

// Контент города правится из админки в любой момент — страница должна рендериться
// заново на каждый запрос, а не браться из статического снапшота времени сборки
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Москва',
  alternates: {
    canonical: '/moscow',
  },
};

export default function RootPage() {
  return <CityPage citySlug="moscow" />;
}

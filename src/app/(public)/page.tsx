import type { Metadata } from 'next';

import { CityPage } from '@/widgets/CityPage/CityPage';

export const metadata: Metadata = {
  title: 'Москва',
  alternates: {
    canonical: '/moscow',
  },
};

export default function RootPage() {
  return <CityPage citySlug="moscow" />;
}

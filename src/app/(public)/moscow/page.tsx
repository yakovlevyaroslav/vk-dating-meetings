import type { Metadata } from 'next';

import { CityPage } from '@/widgets/CityPage/CityPage';

export const metadata: Metadata = {
  title: 'Москва',
};

export default function MoscowPage() {
  return <CityPage citySlug="moscow" />;
}

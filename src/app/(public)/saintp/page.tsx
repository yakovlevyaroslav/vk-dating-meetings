import type { Metadata } from 'next';

import { CityPage } from '@/widgets/CityPage/CityPage';

export const metadata: Metadata = {
  title: 'Санкт-Петербург',
};

export default function SaintPetersburgPage() {
  return <CityPage citySlug="saintp" />;
}

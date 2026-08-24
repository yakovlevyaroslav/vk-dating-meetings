import { notFound } from 'next/navigation';

import { getCategories } from '@/entities/category/getCategories';
import { getCityPageData } from '@/entities/city/getCityPageData';
import { getSiteSettings } from '@/entities/siteSettings/getSiteSettings';

import { AppsSection } from './AppsSection';
import { BonusesSection } from './BonusesSection';
import styles from './CityPage.module.css';
import { FindPlaces } from './FindPlaces';
import { Hero } from './Hero';
import { MeetingPlacesSection } from './MeetingPlacesSection';
import { RoutesSection } from './RoutesSection';
import { SuggestionsSection } from './SuggestionsSection';

interface CityPageProps {
  citySlug: string;
}

export async function CityPage(props: CityPageProps) {
  const { citySlug } = props;
  const [city, categories, settings] = await Promise.all([
    getCityPageData(citySlug),
    getCategories(),
    getSiteSettings(),
  ]);

  if (!city) {
    notFound();
  }

  return (
    <main className={styles.root}>
      <Hero />

      <FindPlaces />

      <MeetingPlacesSection places={city.places} categories={categories} />

      {settings.showRoutesSection ? <RoutesSection routes={city.routes} /> : null}
      {settings.showBonusesSection ? <BonusesSection places={city.places} /> : null}
      <SuggestionsSection />
      <AppsSection />
    </main>
  );
}

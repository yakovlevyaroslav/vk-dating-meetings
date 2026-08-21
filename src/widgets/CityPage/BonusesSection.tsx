import type { CityPageData } from '@/entities/city/getCityPageData';
import { resolveVenuePromo } from '@/entities/place/resolvePlacePromo';

import { BonusCard } from './BonusCard';
import styles from './BonusesSection.module.css';

interface BonusesSectionProps {
  places: CityPageData['places'];
}

interface BonusEntry {
  place: CityPageData['places'][number];
  venueId: string;
  promoDescription: string | null;
  promoCode: string | null;
}

export function BonusesSection(props: BonusesSectionProps) {
  const { places } = props;

  const entries: BonusEntry[] = [];
  for (const place of places) {
    for (const venue of place.venues) {
      if (!venue.showInBonuses) {
        continue;
      }
      const resolved = resolveVenuePromo(place, venue);
      if (!resolved.promoCode && !resolved.promoDescription) {
        continue;
      }
      entries.push({
        place,
        venueId: venue.id,
        promoDescription: resolved.promoDescription,
        promoCode: resolved.promoCode,
      });
    }
  }

  if (entries.length === 0) {
    return null;
  }

  return (
    <section id="bonuses" className={styles.root}>
      <h2 className={styles.title}>Бонусы</h2>
      <p className={styles.subtitle}>
        Подготовили для вас специальные предложения, которые сделают свидание приятнее
      </p>
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.venueId} className={styles.listItem}>
            <BonusCard place={entry.place} promoDescription={entry.promoDescription} promoCode={entry.promoCode} />
          </li>
        ))}
      </ul>
    </section>
  );
}

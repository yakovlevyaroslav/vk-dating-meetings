import Image from 'next/image';

import linkImage from '@/assets/images/ic-link.svg';
import type { CityPageData } from '@/entities/city/getCityPageData';

import styles from './RouteStopCard.module.css';

interface RouteStopCardProps {
  stop: CityPageData['routes'][number]['stops'][number];
}

export function RouteStopCard(props: RouteStopCardProps) {
  const { stop } = props;
  const { place, placeVenue } = stop;

  return (
    <li className={styles.root}>
      <div className={styles.card}>
        {place.linkUrl ? (
          <a href={place.linkUrl} target="_blank" rel="noreferrer" className={styles.badge}>
            <Image src={linkImage} alt="Открыть ссылку" width={16} height={16} loading="eager" quality={100} />
          </a>
        ) : null}
        <span className={styles.title}>{place.name}</span>
        <p className={styles.description}>{stop.description ?? place.description}</p>
        {placeVenue.address ? <span className={styles.address}>{placeVenue.address}</span> : null}
      </div>
      <div className={styles.dotRow}>
        <span className={styles.pointer} />
        <span className={styles.connector} />
        <span className={styles.dot} />
      </div>
    </li>
  );
}

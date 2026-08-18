import type { CityPageData } from '@/entities/city/getCityPageData';

import { RouteCard } from './RouteCard';
import styles from './RoutesSection.module.css';

interface RoutesSectionProps {
  routes: CityPageData['routes'];
}

export function RoutesSection(props: RoutesSectionProps) {
  const { routes } = props;

  return (
    <section id="routes" className={styles.root}>
      <h2 className={styles.title}>Маршруты</h2>
      {routes.length === 0 ? (
        <p className={styles.empty}>Пока нет ни одного маршрута</p>
      ) : (
        <ul className={styles.list}>
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </ul>
      )}
    </section>
  );
}

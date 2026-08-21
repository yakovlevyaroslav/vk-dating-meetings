'use client';

import { useState } from 'react';

import type { CityPageData } from '@/entities/city/getCityPageData';
import { classNames } from '@/shared/lib/classNames';

import styles from './RouteCard.module.css';
import { RouteStopCard } from './RouteStopCard';

interface RouteCardProps {
  route: CityPageData['routes'][number];
}

export function RouteCard(props: RouteCardProps) {
  const { route } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className={styles.root}>
      <div className={styles.content}>
        <div className={styles.body}>
          <span className={styles.descriptionTitle}>{route.name}</span>
          {route.description ? <p className={styles.descriptionText}>{route.description}</p> : null}
          <button
            type="button"
            className={classNames(styles.btnOpenRoute, isOpen && styles.btnOpenRoute__active)}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Скрыть маршрут' : 'Изучить маршрут'}
          </button>
        </div>
        {route.image ? (
          <div className={styles.image} style={{
            backgroundImage: `url(${route.image})`,
          }}
          />
        ) : null}
      </div>

      <div className={classNames(styles.stopsContainer, isOpen && styles.stopsContainer__active)}>
        <ol className={styles.stopsInner}>
          {route.stops.map((stop) => (
            <RouteStopCard key={stop.id} stop={stop} />
          ))}
        </ol>
      </div>
    </li>
  );
}

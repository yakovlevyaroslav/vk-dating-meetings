'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import pinActiveImage from '@/assets/images/ic-map-pin--pink.svg';
import pinBonusImage from '@/assets/images/ic-map-pin--with-badge.svg';
import pinDefaultImage from '@/assets/images/ic-map-pin.svg';

import styles from './YandexMap.module.css';

const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

export interface YandexMapPoint {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  hasBonus?: boolean;
}

interface YandexMapProps {
  points: YandexMapPoint[];
  className?: string;
  activePointIds?: ReadonlySet<string>;
  onPointClick?: (pointId: string) => void;
}

interface YMapInstance {
  setLocation: (location: { center?: [number, number]; duration?: number }) => void;
}

function getMarkerIconSrc(point: YandexMapPoint, isActive: boolean): string {
  if (isActive) {
    return pinActiveImage.src;
  }
  if (point.hasBonus) {
    return pinBonusImage.src;
  }
  return pinDefaultImage.src;
}

export function YandexMap(props: YandexMapProps) {
  const {
    points, className, activePointIds, onPointClick,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const onPointClickRef = useRef(onPointClick);
  const markerImagesRef = useRef(new Map<string, HTMLImageElement>());
  const mapInstanceRef = useRef<YMapInstance | null>(null);

  useEffect(() => {
    onPointClickRef.current = onPointClick;
  });

  useEffect(() => {
    for (const [pointId, image] of markerImagesRef.current) {
      const point = points.find((candidate) => candidate.id === pointId);
      if (point) {
        image.src = getMarkerIconSrc(point, activePointIds?.has(pointId) ?? false);
      }
    }

    if (activePointIds?.size === 1) {
      const [activeId] = activePointIds;
      const activePoint = points.find((candidate) => candidate.id === activeId);
      if (activePoint) {
        mapInstanceRef.current?.setLocation({
          center: [activePoint.longitude, activePoint.latitude],
          duration: 300,
        });
      }
    }
  }, [activePointIds, points]);

  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || points.length === 0) {
      return;
    }

    let isCancelled = false;
    let map: { destroy: () => void } | undefined;
    const markerImages = markerImagesRef.current;

    async function initMap() {
      const ymaps3 = window.ymaps3;

      if (!ymaps3) {
        console.error('Yandex Maps: window.ymaps3 не определён после загрузки скрипта — проверьте настройки API-ключа');
        return;
      }

      await ymaps3.ready;

      if (isCancelled || !containerRef.current) {
        return;
      }

      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;
      const center: [number, number] = [points[0].longitude, points[0].latitude];

      const createdMap = new YMap(containerRef.current, {
        location: {
          center, zoom: 12,
        },
      });
      map = createdMap;
      mapInstanceRef.current = createdMap;
      createdMap.addChild(new YMapDefaultSchemeLayer());
      createdMap.addChild(new YMapDefaultFeaturesLayer());

      markerImages.clear();

      for (const point of points) {
        const markerElement = document.createElement('img');
        markerElement.className = styles.marker;
        markerElement.alt = point.label;
        markerElement.title = point.label;
        markerElement.src = getMarkerIconSrc(point, activePointIds?.has(point.id) ?? false);
        markerElement.addEventListener('click', () => onPointClickRef.current?.(point.id));
        markerImages.set(point.id, markerElement);
        createdMap.addChild(new YMapMarker({
          coordinates: [point.longitude, point.latitude],
        }, markerElement));
      }
    }

    void initMap();

    return () => {
      isCancelled = true;
      markerImages.clear();
      mapInstanceRef.current = null;
      map?.destroy();
    };
    // activePointIds сознательно не в списке зависимостей — за обновление иконки активного маркера
    // без пересоздания карты отвечает отдельный эффект выше
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded, points]);

  if (!YANDEX_MAPS_API_KEY) {
    return (
      <div className={`${styles.root} ${styles.map} ${className ?? ''}`}>
        <p className={styles.placeholder}>Не задан NEXT_PUBLIC_YANDEX_MAPS_API_KEY</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://api-maps.yandex.ru/v3/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`}
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div ref={containerRef} className={`${styles.root} ${styles.map} ${className ?? ''}`} />
    </>
  );
}

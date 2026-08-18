'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import type { Category } from '@/entities/category/getCategories';
import type { CityPageData } from '@/entities/city/getCityPageData';
import { classNames } from '@/shared/lib/classNames';
import { YandexMap } from '@/shared/ui/YandexMap';

import styles from './MeetingPlacesSection.module.css';

interface MeetingPlacesSectionProps {
  places: CityPageData['places'];
  categories: Category[];
}

interface VenueEntry {
  place: CityPageData['places'][number];
  venue: CityPageData['places'][number]['venues'][number];
}

export function MeetingPlacesSection(props: MeetingPlacesSectionProps) {
  const { places, categories } = props;
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [networkFilterPlaceId, setNetworkFilterPlaceId] = useState<string | null>(null);
  const [copiedPromoCode, setCopiedPromoCode] = useState(false);

  const filteredPlaces = useMemo(() => {
    let result = selectedCategoryId ? places.filter((place) => place.categoryId === selectedCategoryId) : places;
    if (networkFilterPlaceId) {
      result = result.filter((place) => place.id === networkFilterPlaceId);
    }
    return result;
  }, [places, selectedCategoryId, networkFilterPlaceId]);

  const networkFilterPlace = networkFilterPlaceId
    ? (places.find((place) => place.id === networkFilterPlaceId) ?? null)
    : null;

  const venueEntries = useMemo<VenueEntry[]>(
    () => filteredPlaces.flatMap((place) => place.venues.map((venue) => ({
      place, venue,
    }))),
    [filteredPlaces],
  );

  const points = useMemo(
    () =>
      venueEntries.map(({ place, venue }) => ({
        id: venue.id,
        label: `${place.name} — ${venue.name}`,
        latitude: venue.latitude,
        longitude: venue.longitude,
        hasBonus: venue.hasBonus,
      })),
    [venueEntries],
  );

  const selectedEntry = venueEntries.find((entry) => entry.venue.id === selectedVenueId) ?? null;

  const activePointIds = useMemo(
    () => new Set(selectedVenueId ? [selectedVenueId] : []),
    [selectedVenueId],
  );

  function handleCategoryClick(categoryId: string) {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
    setSelectedVenueId(null);
    setNetworkFilterPlaceId(null);
  }

  function handleCopyPromoCode(code: string) {
    void navigator.clipboard.writeText(code);
    setCopiedPromoCode(true);
    setTimeout(() => setCopiedPromoCode(false), 1500);
  }

  return (
    <section id="places" className={styles.root}>
      <h2 className={styles.title}>Места встреч</h2>
      <div className={styles.interactive}>
        <div className={styles.filters}>
          <ul className={styles.categoryList} aria-label="Категории">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  className={styles.categoryButton}
                  onClick={() => handleCategoryClick(category.id)}
                  aria-pressed={selectedCategoryId === category.id}
                >
                  <div
                    className={classNames(
                      styles.categoryButtonInner,
                      selectedCategoryId === category.id && styles.categoryButtonInner__active,
                    )}
                  >
                    <span
                      className={classNames(
                        styles.categoryEmoji,
                        selectedCategoryId === category.id && styles.categoryEmoji__active,
                      )}
                    >
                      {category.emoji ?? '📍'}
                    </span>
                  </div>
                  <span className={styles.categoryLabel}>{category.name}</span>

                </button>
              </li>
            ))}
          </ul>

          <hr className={styles.divider} />

          {networkFilterPlace ? (
            <div className={styles.networkFilter}>
              <span className={styles.networkFilterName}>{networkFilterPlace.name}</span>
              <button
                type="button"
                className={styles.networkFilterClose}
                onClick={() => setNetworkFilterPlaceId(null)}
                aria-label="Сбросить фильтр по сети"
              >
                <Image src="/images/ic-close.svg" alt="" width={11} height={11} />
              </button>
            </div>
          ) : null}

          {venueEntries.length === 0 ? (
            <p className={styles.empty}>Пока нет мест в этой категории</p>
          ) : (
            <ul className={styles.placeList}>
              {venueEntries.map(({ place, venue }) => {
                const isSelected = venue.id === selectedVenueId;

                return (
                  <li key={venue.id}>
                    <button
                      type="button"
                      className={classNames(styles.placeItem, isSelected && styles.placeItem__active)}
                      onClick={() => setSelectedVenueId(venue.id)}
                    >
                      {place.thumbnailImage ? (
                        <span className={styles.placeImageWrapper}>
                          {/* eslint-disable-next-line @next/next/no-img-element -- контент загружается через админку, размеры заранее неизвестны */}
                          <img src={place.thumbnailImage} alt={place.name} className={styles.placeImage} />
                          {venue.hasBonus ? (
                            <Image
                              src="/images/ic-card-badge.svg"
                              alt="Есть бонус"
                              width={32}
                              height={32}
                              className={styles.placeBonusBadge}
                            />
                          ) : null}
                        </span>
                      ) : null}
                      <span className={styles.placeBody}>
                        <span className={styles.placeName}>
                          {place.name} — {venue.name}
                        </span>
                        {venue.address ? <span className={styles.placeAddress}>{venue.address}</span> : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={styles.mapArea}>
          {points.length > 0 ? (
            <YandexMap
              points={points}
              className={styles.map}
              activePointIds={activePointIds}
              onPointClick={setSelectedVenueId}
            />
          ) : (
            <div className={styles.mapEmpty}>Нет точек для отображения</div>
          )}

          {selectedEntry ? (
            <div className={styles.detailCard}>
              <button
                type="button"
                className={styles.detailClose}
                onClick={() => setSelectedVenueId(null)}
                aria-label="Закрыть"
              >
                <Image src="/images/btn-close.svg" alt="" width={32} height={32} />
              </button>
              {selectedEntry.place.largeImage ?? selectedEntry.place.thumbnailImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- контент загружается через админку, размеры заранее неизвестны
                <img
                  src={selectedEntry.place.largeImage ?? selectedEntry.place.thumbnailImage ?? ''}
                  alt={selectedEntry.place.name}
                  className={styles.detailImage}
                />
              ) : null}
              <div className={styles.detailBody}>
                <span className={styles.detailName}>
                  {selectedEntry.place.name} — {selectedEntry.venue.name}
                </span>
                {selectedEntry.place.description ? (
                  <p className={styles.detailDescription}>{selectedEntry.place.description}</p>
                ) : null}
                {/* {selectedEntry.venue.address ? (
                  <span className={styles.detailAddress}>{selectedEntry.venue.address}</span>
                ) : null} */}
                {selectedEntry.place.linkUrl ? (
                  <a
                    href={selectedEntry.place.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.detailLink}
                  >
                    Подробнее
                    <Image src="/images/ic-link.svg" alt="" width={16} height={16} />
                  </a>
                ) : null}
                {selectedEntry.place.venues.length > 1 ? (
                  <button
                    type="button"
                    className={styles.detailNetworkButton}
                    onClick={() => setNetworkFilterPlaceId(selectedEntry.place.id)}
                  >
                    Все заведения сети <span className={styles.detailNetworkButtonCount}>{selectedEntry.place.venues.length}</span>
                  </button>
                ) : null}
                {selectedEntry.place.promoCode ? (
                  <div className={styles.detailPromo}>
                    <div className={styles.detailPromoHeader}>
                      <Image src="/images/ic-card-badge.svg" alt="Есть бонус" width={32} height={32} className={styles.detailPromoBadge} />
                      <span className={styles.detailPromoDescription}>{selectedEntry.place.promoDescription}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.detailPromoCodeRow}
                      onClick={() => handleCopyPromoCode(selectedEntry.place.promoCode ?? '')}
                      aria-label="Скопировать промокод"
                    >
                      <span className={styles.detailPromoCode}>{selectedEntry.place.promoCode}</span>
                      <Image src="/images/ic-copy.svg" alt="" width={16} height={16} className={styles.detailPromoCopyIcon} />
                    </button>
                    {copiedPromoCode ? <span className={styles.detailPromoCopied}>Скопировано</span> : null}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

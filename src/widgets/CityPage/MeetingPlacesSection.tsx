'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import type { Category } from '@/entities/category/getCategories';
import type { CityPageData } from '@/entities/city/getCityPageData';
import { resolveVenuePromo } from '@/entities/place/resolvePlacePromo';
import { classNames } from '@/shared/lib/classNames';
import { PromoBlock } from '@/shared/ui/PromoBlock/PromoBlock';
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const availableCategories = useMemo(() => {
    const usedCategoryIds = new Set(
      places.map((place) => place.categoryId).filter((id): id is string => id !== null),
    );
    return categories.filter((category) => usedCategoryIds.has(category.id));
  }, [places, categories]);

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

  const venueEntries = useMemo<VenueEntry[]>(() => {
    if (networkFilterPlaceId) {
      return filteredPlaces.flatMap((place) => place.venues.map((venue) => ({
        place, venue,
      })));
    }

    return filteredPlaces.flatMap((place) => {
      const primaryVenue = place.venues.find((venue) => venue.isPrimary) ?? place.venues[0];
      return primaryVenue ? [{
        place, venue: primaryVenue,
      }] : [];
    });
  }, [filteredPlaces, networkFilterPlaceId]);

  const points = useMemo(
    () =>
      venueEntries.map(({ place, venue }) => ({
        id: venue.id,
        label: `${place.name} — ${venue.name}`,
        latitude: venue.latitude,
        longitude: venue.longitude,
        hasBonus: venue.hasBonus || place.hasBonus,
      })),
    [venueEntries],
  );

  const selectedEntry = venueEntries.find((entry) => entry.venue.id === selectedVenueId) ?? null;
  const resolvedPromo = selectedEntry ? resolveVenuePromo(selectedEntry.place, selectedEntry.venue) : null;
  const hasPromo = Boolean(resolvedPromo?.promoDescription || resolvedPromo?.promoCode);

  const activePointIds = useMemo(
    () => new Set(selectedVenueId ? [selectedVenueId] : []),
    [selectedVenueId],
  );

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }
    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isMobileOpen]);

  function handleCategoryClick(categoryId: string) {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
    setSelectedVenueId(null);
    setNetworkFilterPlaceId(null);
  }

  function selectVenue(venueId: string) {
    setSelectedVenueId(venueId);
    setIsFiltersExpanded(false);
  }

  function showNetworkVenues(placeId: string) {
    setNetworkFilterPlaceId(placeId);
    setSelectedVenueId(null);
    setIsFiltersExpanded(true);
  }

  function openMobile() {
    setIsMobileOpen(true);
  }

  function closeMobile() {
    setIsMobileOpen(false);
    setIsFiltersExpanded(false);
    setSelectedVenueId(null);
  }

  function toggleFiltersExpanded() {
    setIsFiltersExpanded((prev) => !prev);
  }

  return (
    <section id="places" className={styles.root}>
      <h2 className={styles.title}>Места на карте</h2>
      {isMobileOpen ? (
        <button type="button" className={styles.mobileBackdrop} onClick={closeMobile} aria-label="Закрыть" />
      ) : null}

      {isMobileOpen ? (
        <button type="button" className={styles.mobileCloseButton} onClick={closeMobile} aria-label="Закрыть">
          <Image src="/images/btn-close.svg" alt="" width={32} height={32} loading="eager" />
        </button>
      ) : null}

      <div
        className={classNames(
          styles.interactive,
          isMobileOpen && styles.interactive__mobileOpen,
          isMobileOpen && selectedEntry && styles.interactive__placeSelected,
          isMobileOpen && isFiltersExpanded && !selectedEntry && styles.interactive__filtersExpanded,
        )}
      >
        {!isMobileOpen ? (
          <button
            type="button"
            className={styles.mobileOpenOverlay}
            onClick={openMobile}
            aria-label="Открыть карту мест"
          />
        ) : null}

        <div className={styles.filters}>
          <button
            type="button"
            className={styles.filtersHandle}
            onClick={toggleFiltersExpanded}
            aria-expanded={isFiltersExpanded}
            aria-label={isFiltersExpanded ? 'Свернуть список мест' : 'Развернуть список мест'}
          >
            <span className={styles.filtersHandleBar} />
          </button>

          <ul className={styles.categoryList} aria-label="Категории">
            {availableCategories.map((category) => (
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
                <Image src="/images/ic-close.svg" alt="" width={11} height={11} loading="eager" />
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
                      onClick={() => selectVenue(venue.id)}
                    >
                      {place.thumbnailImage ? (
                        <span className={styles.placeImageWrapper}>
                          {/* eslint-disable-next-line @next/next/no-img-element -- контент загружается через админку, размеры заранее неизвестны */}
                          <img src={place.thumbnailImage} alt={place.name} className={styles.placeImage} />
                          {venue.hasBonus || place.hasBonus ? (
                            <Image
                              src="/images/ic-card-badge.svg"
                              alt="Есть бонус"
                              width={32}
                              height={32}
                              className={styles.placeBonusBadge}
                              loading="eager"
                            />
                          ) : null}
                        </span>
                      ) : null}
                      <span className={styles.placeBody}>
                        <span className={styles.placeName}>
                          {place.name}
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
              onPointClick={selectVenue}
            />
          ) : (
            <div className={styles.mapEmpty}>Нет точек для отображения</div>
          )}

          {selectedEntry ? (
            <div className={classNames(styles.detailCard, !hasPromo && styles.detailCard__noPromo)}>
              <button
                type="button"
                className={styles.detailClose}
                onClick={() => setSelectedVenueId(null)}
                aria-label="Закрыть"
              >
                <Image src="/images/btn-close.svg" alt="" width={32} height={32} loading="eager" />
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
                {resolvedPromo?.description ? (
                  <p className={styles.detailDescription}>{resolvedPromo.description}</p>
                ) : null}
                {selectedEntry.place.linkUrl ? (
                  <a
                    href={selectedEntry.place.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.detailLink}
                  >
                    Подробнее
                    <Image src="/images/ic-link.svg" alt="" width={16} height={16} loading="eager" />
                  </a>
                ) : null}
                {selectedEntry.place.venues.length > 1 ? (
                  <button
                    type="button"
                    className={styles.detailNetworkButton}
                    onClick={() => showNetworkVenues(selectedEntry.place.id)}
                  >
                    Все заведения сети <span className={styles.detailNetworkButtonCount}>{selectedEntry.place.venues.length}</span>
                  </button>
                ) : null}
                <PromoBlock
                  promoDescription={resolvedPromo?.promoDescription ?? null}
                  promoCode={resolvedPromo?.promoCode ?? null}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { classNames } from '@/shared/lib/classNames';

import styles from './Header.module.css';

interface City {
  slug: string;
  label: string;
  href: string;
}

const CITIES: City[] = [
  {
    slug: 'moscow', label: 'Москва', href: '/moscow',
  },
  {
    slug: 'saintp', label: 'Санкт-Петербург', href: '/saintp',
  },
];

function getActiveCity(pathname: string): City {
  return CITIES.find((city) => city.href === pathname) ?? CITIES[0];
}

export function CitySwitcher() {
  const pathname = usePathname();
  const activeCity = getActiveCity(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.citySwitcher} ref={rootRef}>
      <button
        type="button"
        className={styles.citySwitcherTrigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {activeCity.label}
        <Image
          src="/images/ic-arrow-bottom.svg"
          alt=""
          width={14}
          height={7}
          className={classNames(styles.citySwitcherArrow, isOpen && styles.citySwitcherArrow__open)}
        />
      </button>

      {isOpen ? (
        <div className={styles.dropdownCity}>
          <ul className={styles.dropdownCityList} aria-label="Выбор города">
            {CITIES.map((city) => (
              <li key={city.slug} className={styles.dropdownCityItem}>
                <Link
                  href={city.href}
                  onClick={() => setIsOpen(false)}
                  className={classNames(
                    styles.dropdownCityLink,
                    city.slug === activeCity.slug && styles.dropdownCityLink__active,
                  )}
                >
                  {city.label}
                  {city.slug === activeCity.slug ? (
                    <Image
                      src="/images/ic-check.svg"
                      alt=""
                      width={18}
                      height={13}
                      className={styles.dropdownCityCheck}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

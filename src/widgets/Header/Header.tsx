'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

import productLogoImage from '@/assets/images/ic-product-logo.svg';
import logoImage from '@/assets/images/logo.svg';
import btnMenuImage from '@/assets/images/btn-menu.svg';
import btnCityImage from '@/assets/images/btn-city.svg';
import checkImage from '@/assets/images/ic-check.svg';
import { classNames } from '@/shared/lib/classNames';

import { CITIES, CitySwitcher, getActiveCity } from './CitySwitcher';
import styles from './Header.module.css';

const MENU_ITEMS = [
  {
    href: '#places', label: 'Места на карте',
  },
  {
    href: '#routes', label: 'Маршруты свиданий',
  },
  {
    href: '#suggest', label: 'Предложить место',
  },
];

type MobilePanel = 'menu' | 'city' | null;

export function Header() {
  const pathname = usePathname();
  const activeCity = getActiveCity(pathname);
  const [openPanel, setOpenPanel] = useState<MobilePanel>(null);

  function togglePanel(panel: MobilePanel) {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }

  return (
    <header className={styles.root}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Image
            src={productLogoImage}
            alt="VK Знакомства логотип"
            width={225}
            height={36}
            priority
            quality={100}
            className={styles.logoIcon}
          />
        </div>
        <div className={styles.headerLogoMobile}>
          <Image src={logoImage} alt="VK Знакомства логотип" width={28} height={28} priority quality={100} />
        </div>

        <ul className={styles.menuList} aria-label="Меню">
          {MENU_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={styles.menuItem}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <CitySwitcher />

        <button
          type="button"
          className={styles.mobileIconButton}
          onClick={() => togglePanel('menu')}
          aria-expanded={openPanel === 'menu'}
          aria-label="Меню"
        >
          {openPanel === 'menu' ? (
            <span className={styles.mobileIconCircle}>
              <XIcon size={18} />
            </span>
          ) : (
            <Image src={btnMenuImage} alt="" width={40} height={40} quality={100} />
          )}
        </button>

        <button
          type="button"
          className={styles.mobileIconButton}
          onClick={() => togglePanel('city')}
          aria-expanded={openPanel === 'city'}
          aria-label="Выбор города"
        >
          <Image src={btnCityImage} alt="" width={40} height={40} quality={100} />
        </button>

        <a href="#apps" className={styles.downloadAppButton}>
          Скачать VK Знакомства
        </a>
      </div>

      {openPanel === 'menu' ? (
        <div className={styles.mobilePanel}>
          <ul className={styles.mobileMenuList} aria-label="Меню">
            {MENU_ITEMS.map((item) => (
              <li key={item.href} className={styles.mobileMenuListItem}>
                <a href={item.href} className={styles.mobileMenuItem} onClick={() => setOpenPanel(null)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {openPanel === 'city' ? (
        <div className={styles.mobilePanel}>
          <ul className={styles.dropdownCityList} aria-label="Выбор города">
            {CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  href={city.href}
                  onClick={() => setOpenPanel(null)}
                  className={classNames(
                    styles.dropdownCityLink,
                    city.slug === activeCity.slug && styles.dropdownCityLink__active,
                  )}
                >
                  {city.label}
                  {city.slug === activeCity.slug ? (
                    <Image
                      src={checkImage}
                      alt=""
                      width={18}
                      height={13}
                      className={styles.dropdownCityCheck}
                      quality={100}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}

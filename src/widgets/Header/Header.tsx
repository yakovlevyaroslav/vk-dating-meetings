import Image from 'next/image';

import { CitySwitcher } from './CitySwitcher';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.root}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Image
            src="/images/ic-product-logo.svg"
            alt="VK Знакомства логотип"
            width={225}
            height={36}
            priority
            className={styles.logoIcon}
          />
        </div>
        <ul className={styles.menuList} aria-label="Меню">
          <li>
            <a href="#places" className={styles.menuItem}>
              Места на карте
            </a>
          </li>
          <li>
            <a href="#routes" className={styles.menuItem}>
              Маршруты свиданий
            </a>
          </li>
          <li>
            <a href="#suggest" className={styles.menuItem}>
              Предложить место
            </a>
          </li>
        </ul>
        <CitySwitcher />
        <a href="#" className={styles.downloadAppButton}>
          Скачать VK Знакомства
        </a>
      </div>
    </header>
  );
}

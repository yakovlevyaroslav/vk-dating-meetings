'use client';

import Image, { type StaticImageData } from 'next/image';
import { useState } from 'react';

import btnCloseImage from '@/assets/images/btn-close.svg';
import btnQrCodeImage from '@/assets/images/btn-qr-code.svg';
import btnLinkImage from '@/assets/images/btn-link.svg';
import qrCodeImageAppStore from '@/assets/images/qr-codes/qr-code-app-store.svg';
import qrCodeImageRuStore from '@/assets/images/qr-codes/qr-code-ru-store.svg';
import qrCodeImageGalaxyStore from '@/assets/images/qr-codes/qr-code-galaxy-store.svg';
import qrCodeImageGetApps from '@/assets/images/qr-codes/qr-code-get-apps.svg';
import qrCodeImageHuaweiAppGallery from '@/assets/images/qr-codes/qr-code-huawei-app-gallery.svg';
import hearthBottomImage from '@/assets/images/3d-hearth-bottom.png';
import starsImage from '@/assets/images/3d-stars-2x.png';
import { classNames } from '@/shared/lib/classNames';

import styles from './AppsSection.module.css';

interface AppStore {
  name: string;
  url: string;
  qrCode: StaticImageData;
}

// TODO: заменить url на реальные ссылки на магазины и qrCode на реальные QR-коды под каждый магазин
const APP_STORES: AppStore[] = [
  {
    name: 'App Store', url: 'https://vkdating-app.ru/install/?utm_source=landing_date_places#utm_source=landing_date_places', qrCode: qrCodeImageAppStore,
  },
  {
    name: 'RuStore', url: 'https://trk.mail.ru/c/n7cje8', qrCode: qrCodeImageRuStore,
  },
  {
    name: 'Galaxy Store', url: 'https://trk.mail.ru/c/iguyl8', qrCode: qrCodeImageGalaxyStore,
  },
  {
    name: 'GetApps', url: 'https://trk.mail.ru/c/qj2i27', qrCode: qrCodeImageGetApps,
  },
  {
    name: 'Huawei AppGallery', url: 'https://trk.mail.ru/c/rlbes7', qrCode: qrCodeImageHuaweiAppGallery,
  },
];

export function AppsSection() {
  const [openStores, setOpenStores] = useState<Record<string, boolean>>({
  });

  function toggleStore(store: string) {
    setOpenStores((prev) => ({
      ...prev, [store]: !prev[store],
    }));
  }

  return (
    <section id="apps" className={styles.root}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Скачивайте <br />
          VK Знакомства
        </h2>
        <span className={styles.subtitle}>Знакомьтесь и найдите, с кем посещать <br /> классные места вашего города</span>
        <ul className={styles.list}>
          {APP_STORES.map((store) => {
            const isOpen = Boolean(openStores[store.name]);

            return (
              <li key={store.name} className={styles.item}>
                <div className={styles.itemHeader}>
                  <button
                    type="button"
                    className={styles.itemTitle}
                    onClick={() => toggleStore(store.name)}
                    aria-expanded={isOpen}
                  >
                    {store.name}
                  </button>
                  <div className={styles.itemActions}>
                    <button
                      type="button"
                      className={styles.iconButton + ' ' + styles.iconButtonQr}
                      onClick={() => toggleStore(store.name)}
                      aria-expanded={isOpen}
                    >
                      <Image
                        src={isOpen ? btnCloseImage : btnQrCodeImage}
                        alt={isOpen ? 'Скрыть QR-код' : 'Показать QR-код'}
                        width={32}
                        height={32}
                        loading="eager"
                        quality={100}
                      />
                    </button>
                    <a href={store.url} target="_blank" rel="noreferrer" className={styles.iconButton}>
                      <Image
                        src={btnLinkImage}
                        alt={`Скачать в ${store.name}`}
                        width={32}
                        height={32}
                        loading="eager"
                        quality={100}
                      />
                    </a>
                  </div>
                </div>
                <div className={classNames(styles.qrContainer, isOpen && styles.qrContainer__active)}>
                  <div className={styles.qrInner}>
                    <Image
                      src={store.qrCode}
                      alt={`QR-код для скачивания в ${store.name}`}
                      width={140}
                      height={140}
                      loading="eager"
                      quality={100}
                    />
                    <p className={styles.qrDescription}>
                      Отсканируйте QR-код камерой своего смартфона, чтобы установить приложение
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <img loading="eager" src={hearthBottomImage.src} alt="Image Heart" className={styles.imageHearth + ' ' + styles.image} />
        <img loading="eager" src={starsImage.src} alt="Image Stars" className={styles.imageStars + ' ' + styles.image} />
      </div>
    </section>
  );
}

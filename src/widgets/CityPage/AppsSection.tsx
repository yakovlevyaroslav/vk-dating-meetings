'use client';

import Image from 'next/image';
import { useState } from 'react';

import btnCloseImage from '@/assets/images/btn-close.svg';
import btnQrCodeImage from '@/assets/images/btn-qr-code.svg';
import btnLinkImage from '@/assets/images/btn-link.svg';
import qrCodeImage from '@/assets/images/qr-code.svg';
import hearthBottomImage from '@/assets/images/3d-hearth-bottom.png';
import starsImage from '@/assets/images/3d-stars-2x.png';
import { classNames } from '@/shared/lib/classNames';

import styles from './AppsSection.module.css';

const APP_STORES = ['Приложение для Iphone', 'RuStore', 'Galaxy Store', 'GetApps', 'Huawei AppGallery'];

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
            const isOpen = Boolean(openStores[store]);

            return (
              <li key={store} className={styles.item}>
                <div className={styles.itemHeader}>
                  <button
                    type="button"
                    className={styles.itemTitle}
                    onClick={() => toggleStore(store)}
                    aria-expanded={isOpen}
                  >
                    {store}
                  </button>
                  <div className={styles.itemActions}>
                    <button
                      type="button"
                      className={styles.iconButton + ' ' + styles.iconButtonQr}
                      onClick={() => toggleStore(store)}
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
                    <a href="#" target="_blank" rel="noreferrer" className={styles.iconButton}>
                      <Image
                        src={btnLinkImage}
                        alt={`Скачать в ${store}`}
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
                      src={qrCodeImage}
                      alt="QR-код для скачивания приложения"
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

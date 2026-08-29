'use client';

import Image from 'next/image';
import { useState } from 'react';

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
                        src={isOpen ? '/images/btn-close.svg' : '/images/btn-qr-code.svg'}
                        alt={isOpen ? 'Скрыть QR-код' : 'Показать QR-код'}
                        width={32}
                        height={32}
                        loading="eager"
                        quality={100}
                      />
                    </button>
                    <a href="#" target="_blank" rel="noreferrer" className={styles.iconButton}>
                      <Image
                        src="/images/btn-link.svg"
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
                      src="/images/qr-code.svg"
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

        <img loading="eager" src="/images/3d-hearth-bottom.png" alt="Image Heart" className={styles.imageHearth + ' ' + styles.image} />
        <img loading="eager" src="/images/3d-stars-2x.png" alt="Image Stars" className={styles.imageStars + ' ' + styles.image} />
      </div>
    </section>
  );
}

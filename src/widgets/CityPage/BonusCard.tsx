import Image from 'next/image';

import linkImage from '@/assets/images/ic-link.svg';
import type { CityPageData } from '@/entities/city/getCityPageData';
import { PromoBlock } from '@/shared/ui/PromoBlock/PromoBlock';

import styles from './BonusCard.module.css';

interface BonusCardProps {
  place: CityPageData['places'][number];
  promoDescription: string | null;
  promoCode: string | null;
}

export function BonusCard(props: BonusCardProps) {
  const { place, promoDescription, promoCode } = props;
  const image = place.largeImage ?? place.thumbnailImage;

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.body}>
          <div className={styles.header}>
            {place.category ? (
              <span className={styles.category}>
                <span className={styles.categoryIcon}>{place.category.emoji ?? '📍'}</span>
                {place.category.name}
              </span>
            ) : <span />}
            {place.linkUrl ? (
              <a
                href={place.linkUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
                aria-label="Открыть ссылку"
              >
                <Image src={linkImage} alt="" width={16} height={16} loading="eager" quality={100} />
              </a>
            ) : null}
          </div>
          <span className={styles.title}>{place.name}

            {place.linkUrl ? (
                <a
                  href={place.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.titleLink}
                  aria-label="Открыть ссылку"
                >
                  <Image src={linkImage} alt="" width={16} height={16} loading="eager" quality={100} />
                </a>
              ) : null}
          </span>
          <p className={styles.description}>{place.description}</p>
          <PromoBlock
            promoDescription={promoDescription}
            promoCode={promoCode}
            codeRowClassName={styles.promoCodeRow}
            copyIconClassName={styles.promoCopyIcon}
          />
        </div>
        {image ? (
          <div className={styles.image} style={{
            backgroundImage: `url(${image})`,
          }}
          />
        ) : null}
      </div>
    </div>
  );
}

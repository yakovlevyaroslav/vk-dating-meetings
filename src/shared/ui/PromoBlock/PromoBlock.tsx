'use client';

import Image from 'next/image';
import { useState } from 'react';

import cardBadgeImage from '@/assets/images/ic-card-badge.svg';
import copyImage from '@/assets/images/ic-copy.svg';
import { classNames } from '@/shared/lib/classNames';

import styles from './PromoBlock.module.css';

interface PromoBlockProps {
  promoDescription: string | null;
  promoCode: string | null;
  codeRowClassName?: string;
  copyIconClassName?: string;
}

export function PromoBlock(props: PromoBlockProps) {
  const { promoDescription, promoCode, codeRowClassName, copyIconClassName } = props;
  const [copied, setCopied] = useState(false);

  if (!promoDescription && !promoCode) {
    return null;
  }

  function handleCopy(code: string) {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Image
          src={cardBadgeImage}
          alt="Есть бонус"
          width={32}
          height={32}
          className={styles.badge}
          loading="eager"
          quality={100}
        />
        {promoDescription ? <span className={styles.description}>{promoDescription}</span> : null}
      </div>
      {promoCode ? (
        <button
          type="button"
          className={classNames(styles.codeRow, codeRowClassName)}
          onClick={() => handleCopy(promoCode)}
          aria-label="Скопировать промокод"
        >
          <span className={styles.code}>{promoCode}</span>
          <Image
            src={copyImage}
            alt=""
            width={16}
            height={16}
            className={classNames(styles.copyIcon, copyIconClassName)}
            loading="eager"
            quality={100}
          />
        </button>
      ) : null}
      {copied ? <span className={styles.copied}>Скопировано</span> : null}
    </div>
  );
}

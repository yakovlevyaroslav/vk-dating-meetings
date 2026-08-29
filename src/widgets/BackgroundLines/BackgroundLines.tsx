import Image from 'next/image';

import bgLinesImage from '@/assets/images/bg-lines.svg';
import bgLinesMobileImage from '@/assets/images/bg-lines--mobile.svg';

import styles from './BackgroundLines.module.css';

export function BackgroundLines() {
  return (
    <picture className={styles.root}>
      <source media="(max-width: 799px)" srcSet={bgLinesMobileImage.src} />
      <Image src={bgLinesImage} alt="" width={2966} height={3989} priority quality={100} className={styles.image} />
    </picture>
  );
}

import Image from 'next/image';

import styles from './BackgroundLines.module.css';

export function BackgroundLines() {
  return (
    <picture className={styles.root}>
      <source media="(max-width: 799px)" srcSet="/images/bg-lines--mobile.svg" />
      <Image src="/images/bg-lines.svg" alt="" width={2966} height={3989} priority quality={100} className={styles.image} />
    </picture>
  );
}

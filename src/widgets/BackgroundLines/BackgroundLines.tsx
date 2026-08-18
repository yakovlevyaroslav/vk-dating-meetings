import Image from 'next/image';

import styles from './BackgroundLines.module.css';

export function BackgroundLines() {
  return <Image src="/images/bg-lines.svg" alt="" width={2966} height={3989} priority className={styles.root} />;
}

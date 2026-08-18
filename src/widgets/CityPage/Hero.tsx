import styles from './Hero.module.css';
import Image from 'next/image';
import { FeatureCards } from './FeatureCards';

export function Hero() {
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>
        <span className={styles.titlePart1}>Места</span>
        <span className={styles.titlePart2}>неслучайных</span>
        <span className={styles.titlePart3}>встреч</span>
      </h1>
      <p className={styles.subtitle}>
        Топ локаций для свиданий от наших пользователей — выбирайте, что вам ближе
      </p>
      <Image
        src="/images/3d-stars.png"
        alt="3D stars"
        width={368}
        height={461}
        className={styles.imageStars}
      />
      <Image
        src="/images/3d-pin-main.png"
        alt="3D pin"
        width={267}
        height={267}
        className={styles.imagePin}
      />
      <div className={styles.lighterBackground} />

      <FeatureCards />
    </section>
  );
}

import styles from './Hero.module.css';
import Image from 'next/image';
import starsImage from '@/assets/images/3d-stars-2x.png';
import pinImage from '@/assets/images/3d-pin-main.png';
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
        Топ локаций от наших пользователей — <br />
        выбирайте, что вам ближе
      </p>
      <Image
        src={starsImage}
        alt="3D stars"
        width={368}
        height={461}
        className={styles.imageStars}
        priority
        quality={100}
      />
      <Image
        src={pinImage}
        alt="3D pin"
        width={267}
        height={267}
        className={styles.imagePin}
        priority
        quality={100}
      />
      <div className={styles.lighterBackground} />

      <FeatureCards />
    </section>
  );
}

import Image from 'next/image';

import maxImage from '@/assets/images/ic-sm-max.png';
import vkImage from '@/assets/images/ic-sm-vk.svg';
import tgImage from '@/assets/images/ic-sm-tg.svg';

import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <ul className={styles.socials} aria-label="Мы в соцсетях">
          <li>
            <a href="#" className={styles.socialLink}>
              <Image src={maxImage} alt="MAX" width={32} height={32} loading="eager" quality={100} />
            </a>
          </li>
          <li>
            <a href="#" className={styles.socialLink}>
              <Image src={vkImage} alt="VK" width={32} height={32} loading="eager" quality={100} />
            </a>
          </li>
          <li>
            <a href="#" className={styles.socialLink}>
              <Image src={tgImage} alt="Telegram" width={32} height={32} loading="eager" quality={100} />
            </a>
          </li>
        </ul>
        <ul className={styles.links} aria-label="Документы">
          <li>
            <a href="#" className={styles.link}>
              Лицензионное соглашение
            </a>
          </li>
          <li>
            <a href="#" className={styles.link}>
              Правила использования
            </a>
          </li>
          <li>
            <a href="#" className={styles.link}>
              Политика конфиденциальности
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.lighterBackground} />
    </footer>
  );
}

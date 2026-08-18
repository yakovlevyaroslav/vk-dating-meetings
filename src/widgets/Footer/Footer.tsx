import Image from 'next/image';

import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <ul className={styles.socials} aria-label="Мы в соцсетях">
          <li>
            <a href="#" className={styles.socialLink}>
              <Image src="/images/ic-sm-max.svg" alt="MAX" width={32} height={32} />
            </a>
          </li>
          <li>
            <a href="#" className={styles.socialLink}>
              <Image src="/images/ic-sm-vk.svg" alt="VK" width={32} height={32} />
            </a>
          </li>
          <li>
            <a href="#" className={styles.socialLink}>
              <Image src="/images/ic-sm-tg.svg" alt="Telegram" width={32} height={32} />
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

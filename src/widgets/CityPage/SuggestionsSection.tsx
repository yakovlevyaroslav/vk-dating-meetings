import pinImage from '@/assets/images/3d-pin-know.png';
import flashImage from '@/assets/images/3d-flash-know.png';

import styles from './SuggestionsSection.module.css';

export function SuggestionsSection() {
  return (
    <section id="suggest" className={styles.root}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Знаете классные <br />
          места, о которых <br />
          мы не упомянули?

          <img className={styles.image + ' ' + styles.imagePin} src={pinImage.src} alt="Image Pin" />
          <img className={styles.image + ' ' + styles.imageFlash} src={flashImage.src} alt="Image Flash" />
        </h2>
        {/* TODO: заменить на реальную ссылку для предложения места */}
        <a href="https://app.pthwy.ru/hUvS0" target="_blank" rel="noreferrer" className={styles.button}>
          Предложить место
        </a>
        <div className={styles.lighterBackground} />
      </div>
    </section>
  );
}

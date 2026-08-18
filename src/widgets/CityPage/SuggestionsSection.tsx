import styles from './SuggestionsSection.module.css';

export function SuggestionsSection() {
  return (
    <section id="suggest" className={styles.root}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Знаете классные <br />
          места, о которых <br />
          мы не упомянули?

          <img className={styles.image + ' ' + styles.imagePin} src="/images/3d-pin-know.png" alt="Image Pin" />
          <img className={styles.image + ' ' + styles.imageFlash} src="/images/3d-flash-know.png" alt="Image Flash" />
        </h2>
        <button className={styles.button}>
          Предложить место
        </button>
        <div className={styles.lighterBackground} />
      </div>
    </section>
  );
}

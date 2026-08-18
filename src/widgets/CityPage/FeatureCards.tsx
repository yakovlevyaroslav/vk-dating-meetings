import styles from './FeatureCards.module.css';

export function FeatureCards() {
  return (
    <section className={styles.root}>
      <ul className={styles.list}>
        <li className={styles.card}>
          <p className={styles.cardDescription}>
            Наши пользователи <br /> поделились своими <br /> любимыми местами
          </p>
        </li>
        <li className={styles.card}>
          <p className={styles.cardDescription}>
            Мы проверили все <br /> локации и выбрали <br /> лучшие
          </p>
        </li>
        <li className={styles.card}>
          <p className={styles.cardDescription}>
            В некоторых местах <br />
            есть бонусы от нас — <br /> ищите отметки на карте
          </p>
        </li>
      </ul>
    </section>
  );
}

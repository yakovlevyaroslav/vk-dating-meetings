import styles from './FindPlaces.module.css';

export function FindPlaces() {
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Где найти эти места</h2>
      <ul className={styles.grid}>
        <li className={styles.card}>
          <h3 className={styles.cardTitle}>На карте</h3>
          <p className={styles.cardSubtitle}>Выбирайте по расположению или используйте фильтры по типу мест</p>
        </li>
        <li className={styles.card}>
          <h3 className={styles.cardTitle}>В городе</h3>
          <p className={styles.cardSubtitle}>
            Ищите яркие наклейки с наградой — обычно их&nbsp;размещают на двери или витрине
          </p>
        </li>
      </ul>
    </section>
  );
}

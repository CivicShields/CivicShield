import styles from "./Card.module.css";

function Card(props) {
  return (
    <div className={styles.featureCard}>
      <img src={props.imageUrl} alt="" className={styles.cardIcon} />
      <div className={styles.cardTitle}>{props.name}</div>
      <div className={styles.cardContent}>{props.content}</div>
    </div>
  );
}

export default Card;

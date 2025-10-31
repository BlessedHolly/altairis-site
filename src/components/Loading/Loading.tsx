import styles from "./Loading.module.scss";

function Loading() {
  return (
    <div className={styles["loading-container"]}>
      <p className={styles["loading"]}>Loading...</p>
      <p className={styles["loading"]}>
        Из-за хостинга может долго грузиться (около минуты). Пожалуйста,
        подождите, это того стоит😈
      </p>
    </div>
  );
}

export default Loading;

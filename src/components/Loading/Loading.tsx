import styles from "./Loading.module.scss";

function Loading() {
  return (
    <div className={styles["loading-container"]}>
      <p className={styles["loading"]}>Loading...</p>
    </div>
  );
}

export default Loading;

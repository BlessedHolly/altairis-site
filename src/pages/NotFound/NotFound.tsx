import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

function NotFound() {
  return (
    <div className={styles["not-found-container"]}>
      <p className={styles["not-found-paragraph"]}>Not found</p>
      <div>
        <Link className={styles["link"]} to="/">
          Main page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

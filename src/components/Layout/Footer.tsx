import { useLocation } from "react-router-dom";
import styles from "./Footer.module.scss";
import global from "/images/global.svg";

function Footer() {
  const { pathname } = useLocation();
  if (pathname === "/messenger") {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles["global-container"]}>
        <img src={global} alt="" />
        <p>
          Based in US <br /> Active worldwide
        </p>
      </div>
      <div className={styles["contact-container"]}>
        <div className={styles["contact"]}>
          <p>CONTACT</p>
        </div>
        <div className={styles["contact"]}>
          <p>CONTACT</p>
        </div>
      </div>
      <div className={styles["altairis-email"]}>
        <p>altairis@gmail.com</p>
      </div>
    </footer>
  );
}

export default Footer;

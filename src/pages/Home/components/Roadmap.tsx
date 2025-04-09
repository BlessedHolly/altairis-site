import { useEffect } from "react";
import styles from "./Roadmap.module.scss";
import light1 from "/images/light1.svg";
import light2 from "/images/light2.svg";
import light3 from "/images/light3.svg";
import light4 from "/images/light4.svg";

function Roadmap() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = [...document.querySelectorAll(`.${styles["q-block"]}`)];

      const windowHeight = window.innerHeight;

      elements.forEach((element) => {
        if (element.getBoundingClientRect().top < windowHeight * 0.87) {
          element.classList.add(styles.visible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={styles["roadmap-container"]}>
        <ul className={styles["q-block"]}>
          <li>
            <div className={styles["ambient-light-container-1"]}>
              <img src={light1} alt="" />
            </div>
            <h2 className={styles["q-title"]}>
              Q1 <br /> Gallery Launch
            </h2>
          </li>
          <li>
            <p>Opening the first collection of digital images</p>
          </li>
          <li>
            <p>Support for a responsive interface for convenient viewing</p>
          </li>
          <li>
            <p>Integration with a tagging system for quick navigation</p>
          </li>
          <li>
            <p>Ability to save favorite images</p>
          </li>
          <li>
            <p>Improved page loading speed</p>
          </li>
        </ul>
        <ul className={styles["q-block"]}>
          <li>
            <div className={styles["ambient-light-container-2"]}>
              <img src={light2} alt="" />
            </div>
            <h2 className={styles["q-title"]}>
              Q2 <br /> Feature Expansion
            </h2>
          </li>
          <li>
            <p>Adding search by colors and styles</p>
          </li>
          <li>
            <p>Launching personalized recommendations</p>
          </li>
          <li>
            <p>Optimizing the mobile version of the site</p>
          </li>
          <li>
            <p>Enhancing image preview quality</p>
          </li>
          <li>
            <p>Implementing a light theme for a better user experience</p>
          </li>
        </ul>
        <ul className={styles["q-block"]}>
          <li>
            <div className={styles["ambient-light-container-3"]}>
              <img src={light3} alt="" />
            </div>
            <h2 className={styles["q-title"]}>
              Q3 <br /> Community Development
            </h2>
          </li>
          <li>
            <p>Launching a section for discussions and inspiration</p>
          </li>
          <li>
            <p>Connecting an API for integration with other services</p>
          </li>
          <li>
            <p>Adding the ability to leave reviews on images</p>
          </li>
          <li>
            <p>Improving content personalization algorithms</p>
          </li>
          <li>
            <p>Enhancing the content filtering system</p>
          </li>
        </ul>
        <ul className={styles["q-block"]}>
          <li>
            <div className={styles["ambient-light-container-4"]}>
              <img src={light4} alt="" />
            </div>
            <h2 className={styles["q-title"]}>
              Q4 <br /> Creative Features
            </h2>
          </li>
          <li>
            <p>Interactive image collections based on interests</p>
          </li>
          <li>
            <p>Launching a series of thematic collections from authors</p>
          </li>
          <li>
            <p>Improving website performance</p>
          </li>
          <li>
            <p>Optimizing image loading for different devices</p>
          </li>
          <li>
            <p>Working on new experimental features</p>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Roadmap;

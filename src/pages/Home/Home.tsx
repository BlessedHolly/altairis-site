import { useEffect } from "react";
import styles from "./Home.module.scss";
import Roadmap from "./components/Roadmap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const elements = [
        ...document.querySelectorAll(`.${styles["viewport-content"]}`),
        ...document.querySelectorAll(`.${styles["paragraph-2"]}`),
      ];

      const windowHeight = window.innerHeight;

      elements.forEach((element) => {
        if (element.getBoundingClientRect().top < windowHeight * 0.85) {
          element.classList.add(styles.visible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <section className={`${styles.viewport} ${styles["viewport-1"]}`}>
        <div className={styles["viewport-content"]}>
          <h1 className={styles["title-1"]}>ALTAIRIS</h1>
          <div className={styles["paragraph-1"]}>
            <div className={styles["stick-paragraph-1"]}>
              <svg
                width="40"
                height="490"
                viewBox="0 0 40 509"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_1_682)">
                  <rect
                    x="23"
                    y="17"
                    width="475"
                    height="5.99998"
                    rx="2.99999"
                    transform="rotate(90 23 17)"
                    fill="#56FFEB"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_1_682"
                    x="0"
                    y="0"
                    width="40"
                    height="519"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="8.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.74902 0 0 0 0 0.227451 0 0 0 0 1 0 0 0 0.4 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_1_682"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_1_682"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <p>SHARE YOUR IMAGES, DOWNLOAD OTHERS' IMAGES</p>
            <div className={styles["star-paragraph-1"]}>
              <svg
                width="46"
                height="47"
                viewBox="0 0 46 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 0.65918L26.2527 20.4065L46 23.6592L26.2527 26.9119L23 46.6592L19.7473 26.9119L0 23.6592L19.7473 20.4065L23 0.65918Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={() => navigate("profile")}
            className={`normal-button ${styles["start-now-button"]}`}
          >
            START NOW
          </button>
        </div>
      </section>
      <section className={`${styles.viewport} ${styles["viewport-2"]}`}>
        <div className={styles["viewport-content"]}>
          <h1 className={styles["title-2"]}>ABOUT US</h1>
          <div className={styles["paragraph-2"]}>
            <div className={styles["stick-paragraph-2"]}>
              <svg
                width="40"
                height="426"
                viewBox="0 0 40 509"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_1_682)">
                  <rect
                    x="23"
                    y="17"
                    width="475"
                    height="5.99998"
                    rx="2.99999"
                    transform="rotate(90 23 17)"
                    fill="#56FFEB"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_1_682"
                    x="0"
                    y="0"
                    width="40"
                    height="509"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="8.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.74902 0 0 0 0 0.227451 0 0 0 0 1 0 0 0 0.4 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_1_682"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_1_682"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <p>
              ALTAIRIS gives users the opportunity to share their images and
              <br /> find people with similar interests. Discover a vibrant
              community where creativity knows no bounds. Connect with
              like-minded individuals and showcase your unique perspective
              through stunning visuals. Express yourself freely and explore a
              diverse collection of images from users around the world. Whether
              you're an artist, photographer, or enthusiast, there's a place for
              you here. Engage with inspiring content, exchange ideas, and build
              meaningful connections. ALTAIRIS is more than just a platform—it's
              a space where creativity thrives. Join us and be part of a growing
              network of passionate creators, sharing moments, memories, and
              artistic visions.
            </p>
          </div>
        </div>
      </section>
      <section className={styles["viewport-3"]}>
        <h1 className={styles["roadmap-title"]}>
          OUR WAY <br /> <span className={styles.roadmapWord}>ROADMAP</span>
        </h1>

        <Roadmap />

        <div className={styles["ribbon-altairis"]}>
          <p>ALTAIRIS</p>
          <div className={styles[""]}>
            <svg
              width="46"
              height="47"
              viewBox="0 0 46 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 0.65918L26.2527 20.4065L46 23.6592L26.2527 26.9119L23 46.6592L19.7473 26.9119L0 23.6592L19.7473 20.4065L23 0.65918Z"
                fill="white"
              />
            </svg>
          </div>
          <p>ALTAIRIS</p>
          <div className={styles[""]}>
            <svg
              width="46"
              height="47"
              viewBox="0 0 46 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 0.65918L26.2527 20.4065L46 23.6592L26.2527 26.9119L23 46.6592L19.7473 26.9119L0 23.6592L19.7473 20.4065L23 0.65918Z"
                fill="white"
              />
            </svg>
          </div>
          <p>ALTAIRIS</p>
          <div className={styles[""]}>
            <svg
              width="46"
              height="47"
              viewBox="0 0 46 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 0.65918L26.2527 20.4065L46 23.6592L26.2527 26.9119L23 46.6592L19.7473 26.9119L0 23.6592L19.7473 20.4065L23 0.65918Z"
                fill="white"
              />
            </svg>
          </div>
          <p>ALTAIRIS</p>
          <div className={styles[""]}>
            <svg
              width="46"
              height="47"
              viewBox="0 0 46 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 0.65918L26.2527 20.4065L46 23.6592L26.2527 26.9119L23 46.6592L19.7473 26.9119L0 23.6592L19.7473 20.4065L23 0.65918Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

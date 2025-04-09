import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  if (location.pathname === "/not-found") return <></>;

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <div
          className={`${styles.burger} ${isMenuOpen ? styles.open : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`${styles.menu} ${isMenuOpen ? styles.show : ""}`}>
          <NavLink
            className={({ isActive }) =>
              `${styles["nav-link"]} ${
                isActive ? styles["active-navigation"] : ""
              }`
            }
            to=""
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `${styles["nav-link"]} ${
                isActive ? styles["active-navigation"] : ""
              }`
            }
            to="gallery"
            onClick={() => setIsMenuOpen(false)}
          >
            Gallery
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `${styles["nav-link"]} ${styles["profile-link"]} ${
                isActive ? styles["active-navigation"] : ""
              }`
            }
            to="messenger"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.0"
              width="512.000000pt"
              height="512.000000pt"
              viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet"
              className={styles["profile-icon"]}
            >
              <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path d="M2325 4949 c-211 -20 -499 -94 -702 -181 -1083 -465 -1674 -1644 -1392 -2778 79 -319 224 -620 430 -896 l31 -41 -27 -379 c-31 -426 -31 -426 39 -479 66 -50 78 -48 479 75 l365 112 113 -45 c284 -112 513 -161 809 -173 656 -28 1305 225 1772 689 202 200 340 391 468 649 590 1186 98 2624 -1100 3214 -390 193 -841 274 -1285 233z m436 -319 c717 -73 1345 -508 1664 -1155 463 -938 154 -2066 -725 -2653 -347 -231 -798 -357 -1220 -339 -283 12 -510 66 -775 184 -65 29 -114 44 -140 44 -22 0 -161 -38 -310 -83 l-270 -84 -3 26 c-1 14 6 143 17 288 13 174 16 273 10 295 -5 17 -35 64 -66 102 -338 418 -506 976 -453 1506 73 722 516 1356 1169 1671 340 164 732 235 1102 198z" />
                <path d="M1525 2871 c-92 -24 -173 -90 -215 -176 -19 -41 -24 -66 -24 -135 -1 -78 2 -90 33 -148 38 -70 70 -100 145 -140 43 -22 64 -26 136 -26 72 0 93 4 136 26 75 40 107 70 145 140 31 58 34 70 33 148 0 72 -4 93 -26 136 -39 75 -70 107 -137 143 -65 34 -164 49 -226 32z" />
                <path d="M2485 2871 c-92 -24 -173 -90 -215 -176 -19 -41 -24 -66 -24 -135 -1 -78 2 -90 33 -148 38 -70 70 -100 145 -140 43 -22 64 -26 136 -26 72 0 93 4 136 26 75 40 107 70 145 140 31 58 34 70 33 148 0 72 -4 93 -26 136 -39 75 -70 107 -137 143 -65 34 -164 49 -226 32z" />
                <path d="M3444 2871 c-52 -13 -135 -64 -165 -100 -55 -68 -73 -118 -73 -211 -1 -78 2 -90 33 -148 38 -70 70 -100 145 -140 43 -22 64 -26 136 -26 72 0 93 4 136 26 75 40 107 70 145 140 31 58 34 70 33 148 0 72 -4 93 -26 136 -39 75 -70 107 -137 143 -65 34 -164 49 -227 32z" />
              </g>
            </svg>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `${styles["nav-link"]} ${styles["profile-link"]} ${
                isActive ? styles["active-navigation"] : ""
              }`
            }
            to="profile"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              version="1.0"
              width="512.000000pt"
              height="512.000000pt"
              viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet"
              className={styles["profile-icon"]}
            >
              <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill="ffffff"
                stroke="none"
              >
                <path d="M2370 5114 c-19 -2 -78 -9 -130 -15 -791 -90 -1522 -586 -1924 -1305 -146 -262 -252 -588 -297 -914 -18 -125 -18 -515 0 -640 105 -762 511 -1409 1146 -1826 609 -400 1377 -517 2090 -317 929 260 1646 1043 1819 1987 156 845 -103 1682 -705 2285 -399 398 -879 639 -1449 726 -100 15 -472 28 -550 19z m395 -304 c785 -72 1480 -554 1825 -1264 38 -78 83 -181 100 -231 251 -720 129 -1508 -326 -2110 -46 -60 -105 -134 -132 -164 l-48 -54 -38 78 c-328 693 -1082 1095 -1841 984 -574 -84 -1083 -460 -1331 -984 l-38 -78 -48 54 c-327 364 -534 834 -578 1314 -67 727 233 1459 790 1928 464 390 1069 582 1665 527z m50 -3066 c315 -55 627 -230 838 -470 84 -97 189 -259 235 -367 61 -141 62 -128 -15 -184 -278 -202 -627 -344 -983 -399 -144 -22 -491 -25 -625 -5 -254 38 -472 104 -691 211 -123 60 -373 214 -389 240 -8 12 46 146 92 230 237 436 659 711 1168 764 71 7 278 -4 370 -20z" />
                <path d="M2449 4310 c-382 -47 -694 -314 -805 -687 -32 -108 -43 -293 -24 -409 36 -224 158 -439 332 -583 89 -74 260 -162 378 -193 119 -32 346 -32 465 0 113 31 286 119 373 192 174 146 296 360 332 584 19 116 8 301 -24 409 -81 271 -273 495 -523 609 -143 64 -352 97 -504 78z m197 -301 c215 -30 401 -163 494 -353 52 -106 70 -181 70 -291 0 -187 -56 -321 -190 -456 -69 -70 -101 -94 -170 -128 -193 -94 -387 -94 -580 0 -68 34 -102 59 -171 128 -133 134 -189 268 -189 456 0 110 18 185 69 290 104 211 320 350 568 364 12 0 56 -4 99 -10z" />
              </g>
            </svg>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;

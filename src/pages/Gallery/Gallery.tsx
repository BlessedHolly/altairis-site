import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useGetPostsQuery } from "../../store/apiSlice";
import { formatDate, handleDownload } from "../../utils/utils";
import styles from "./Gallery.module.scss";
import { useEffect, useState } from "react";

interface IPost {
  date: string;
  description: string;
  image: string;
  userId: string;
  userName: string;
  _id: string;
}

function Gallery() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPostsQuery({ page, limit: 10 });
  const navigate = useNavigate();
  const [showFullText, setShowFullText] = useState(false);

  const toggleShow = () => {
    setShowFullText((prev) => !prev);
  };

  function description(post: IPost) {
    const shouldTruncate = post.description.length > 160;
    const displayedText = showFullText
      ? post.description
      : post.description.slice(0, 160) + (shouldTruncate ? "..." : "");
    return displayedText;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);
  if (isLoading) return <Loading />;
  const { posts, total } = data ? data : { posts: [] };
  const totalPages = Math.ceil(total / 10);

  return (
    <div className={styles["gallery-container"]}>
      <div className={styles["posts"]}>
        {posts.map((post: IPost) => (
          <div className={styles["post"]} key={post._id}>
            <div className={styles["post-image-container"]}>
              <img src={post.image} alt="" />
            </div>
            <div className={styles["post-info"]}>
              <div className={styles["text-date-container"]}>
                <p className={styles["post-text"]}>{description(post)}</p>
                {post.description.length > 160 ? (
                  <button
                    className={styles["more-description-button"]}
                    onClick={toggleShow}
                  >
                    {showFullText ? "Hide" : "More"}
                  </button>
                ) : null}
                <div className={styles["date-intersection-container"]}>
                  <p className={styles["post-date"]}>{formatDate(post.date)}</p>
                  <div className={styles["interaction-post-container"]}>
                    <div className={styles["icon-wrapper"]}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.0"
                        width="512.000000pt"
                        height="512.000000pt"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#000000"
                          stroke="none"
                        >
                          <path d="M525 3190 c-132 -28 -241 -87 -335 -180 -75 -76 -121 -149 -157 -252 -23 -64 -27 -89 -27 -198 0 -109 4 -134 27 -198 36 -103 82 -176 157 -252 76 -75 149 -121 252 -157 64 -23 89 -27 198 -27 109 0 134 4 198 27 103 36 176 82 252 157 75 76 121 149 157 252 23 64 27 89 27 198 0 109 -4 134 -27 198 -36 103 -82 176 -157 252 -121 120 -256 179 -425 185 -55 2 -118 0 -140 -5z" />
                          <path d="M2445 3190 c-132 -28 -241 -87 -335 -180 -75 -76 -121 -149 -157 -252 -23 -64 -27 -89 -27 -198 0 -109 4 -134 27 -198 36 -103 82 -176 157 -252 76 -75 149 -121 252 -157 64 -23 89 -27 198 -27 109 0 134 4 198 27 103 36 176 82 252 157 75 76 121 149 157 252 23 64 27 89 27 198 0 109 -4 134 -27 198 -36 103 -82 176 -157 252 -121 120 -256 179 -425 185 -55 2 -118 0 -140 -5z" />
                          <path d="M4365 3190 c-132 -28 -241 -87 -335 -180 -75 -76 -121 -149 -157 -252 -23 -64 -27 -89 -27 -198 0 -109 4 -134 27 -198 36 -103 82 -176 157 -252 76 -75 149 -121 252 -157 64 -23 89 -27 198 -27 109 0 134 4 198 27 103 36 176 82 252 157 75 76 121 149 157 252 23 64 27 89 27 198 0 109 -4 134 -27 198 -36 103 -82 176 -157 252 -121 120 -256 179 -425 185 -55 2 -118 0 -140 -5z" />
                        </g>
                      </svg>
                      <div className={styles["post-management-container"]}>
                        <button
                          onClick={() => navigate(`/user/${post.userId}`)}
                          className={styles["post-button"]}
                        >
                          {post.userName}
                          <svg
                            version="1.0"
                            width="512.000000pt"
                            height="512.000000pt"
                            viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                              fill="ffffff"
                              stroke="none"
                            >
                              <path d="M2370 5114 c-19 -2 -78 -9 -130 -15 -791 -90 -1522 -586 -1924 -1305 -146 -262 -252 -588 -297 -914 -18 -125 -18 -515 0 -640 105 -762 511 -1409 1146 -1826 609 -400 1377 -517 2090 -317 929 260 1646 1043 1819 1987 156 845 -103 1682 -705 2285 -399 398 -879 639 -1449 726 -100 15 -472 28 -550 19z m395 -304 c785 -72 1480 -554 1825 -1264 38 -78 83 -181 100 -231 251 -720 129 -1508 -326 -2110 -46 -60 -105 -134 -132 -164 l-48 -54 -38 78 c-328 693 -1082 1095 -1841 984 -574 -84 -1083 -460 -1331 -984 l-38 -78 -48 54 c-327 364 -534 834 -578 1314 -67 727 233 1459 790 1928 464 390 1069 582 1665 527z m50 -3066 c315 -55 627 -230 838 -470 84 -97 189 -259 235 -367 61 -141 62 -128 -15 -184 -278 -202 -627 -344 -983 -399 -144 -22 -491 -25 -625 -5 -254 38 -472 104 -691 211 -123 60 -373 214 -389 240 -8 12 46 146 92 230 237 436 659 711 1168 764 71 7 278 -4 370 -20z"></path>
                              <path d="M2449 4310 c-382 -47 -694 -314 -805 -687 -32 -108 -43 -293 -24 -409 36 -224 158 -439 332 -583 89 -74 260 -162 378 -193 119 -32 346 -32 465 0 113 31 286 119 373 192 174 146 296 360 332 584 19 116 8 301 -24 409 -81 271 -273 495 -523 609 -143 64 -352 97 -504 78z m197 -301 c215 -30 401 -163 494 -353 52 -106 70 -181 70 -291 0 -187 -56 -321 -190 -456 -69 -70 -101 -94 -170 -128 -193 -94 -387 -94 -580 0 -68 34 -102 59 -171 128 -133 134 -189 268 -189 456 0 110 18 185 69 290 104 211 320 350 568 364 12 0 56 -4 99 -10z"></path>
                            </g>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDownload(post, post._id)}
                          className={styles["post-button"]}
                        >
                          Download
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.0"
                            width="512.000000pt"
                            height="512.000000pt"
                            viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                              fill="#000000"
                              stroke="none"
                            >
                              <path d="M2490 4897 c-48 -16 -116 -86 -129 -133 -8 -27 -11 -495 -11 -1504 l0 -1465 -468 467 c-352 352 -478 472 -512 487 -136 62 -288 -24 -298 -169 -8 -112 -39 -75 687 -804 707 -709 714 -716 807 -716 88 0 102 12 801 712 508 509 667 673 682 708 81 180 -99 360 -279 279 -34 -15 -160 -135 -517 -492 l-473 -471 -2 1479 -3 1480 -28 47 c-50 85 -162 127 -257 95z" />
                              <path d="M330 1463 c-41 -21 -62 -40 -85 -77 l-30 -49 -3 -456 c-2 -306 0 -473 8 -507 13 -60 56 -116 113 -147 l42 -22 2190 0 2190 0 40 22 c50 27 80 58 100 105 13 32 15 107 15 516 l0 479 -23 44 c-13 24 -43 58 -66 74 -39 27 -50 30 -120 30 -69 0 -82 -3 -118 -28 -22 -15 -52 -50 -67 -76 l-26 -49 0 -346 0 -346 -1925 0 -1924 0 -3 358 -3 359 -28 41 c-39 60 -94 93 -164 99 -50 4 -66 1 -113 -24z" />
                            </g>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles["pagination"]}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={styles["page-button"]}
            onClick={() => setPage(index + 1)}
            disabled={page === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Gallery;

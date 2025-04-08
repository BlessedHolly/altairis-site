import { Navigate, useParams } from "react-router-dom";
import { useGetForeignUserProfileQuery } from "../../store/apiAccountSlice";
import styles from "./OtherProfile.module.scss";
import noAvatar from "/images/noavatar.jpg";
import { useState } from "react";
import { formatDate, handleDownload } from "../../utils/utils";
import Loading from "../../components/Loading/Loading";
import MoreInfo from "./components/MoreInfo/MoreInfo";

interface IPost {
  date: string;
  description: string;
  image: string;
  _id: string;
}

interface IUser {
  avatar: string;
  name: string;
  status: string;
  posts: IPost[];
}

function OtherProfile() {
  const { userId } = useParams();
  if (!userId) {
    throw new Error("empty id");
  }
  const { isError, data, isLoading } = useGetForeignUserProfileQuery(userId);
  const user: IUser = data?.user;
  const [showMoreInfo, setShowMoreInfo] = useState(false);
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

  if (isError) return <Navigate to={"/not-found"} />;
  if (data?.message === "same user") return <Navigate to={"/profile"} />;
  if (isLoading) return <Loading />;

  return (
    <div className={styles["profile-container"]}>
      <div className={styles["profile-content"]}>
        <div className={styles["profile-info"]}>
          <div className={styles["avatar-container"]}>
            <img
              className={styles["avatar"]}
              src={user.avatar || noAvatar}
              alt=""
              onError={(e) => (e.currentTarget.src = noAvatar)}
            />
          </div>

          <div className={styles["user-data-container"]}>
            <h2 className={styles["username"]}>{user.name}</h2>
            <p className={styles["status"]}>{user.status.slice(0, 20)}...</p>
            <button
              onClick={() => setShowMoreInfo(true)}
              className={`normal-button ${styles["more-button"]}`}
            >
              More
            </button>
          </div>
        </div>

        <div className={styles["posts"]}>
          {user.posts
            .map((post: IPost) => (
              <div key={post._id} className={styles["post"]}>
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
                      <p className={styles["post-date"]}>
                        {formatDate(post.date)}
                      </p>
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
            ))
            .reverse()}

          {user.posts.length === 0 ? (
            <div className={styles["no-post"]}>
              <p>It's empty here for now.</p>
            </div>
          ) : null}
        </div>

        <MoreInfo
          closeMoreInfo={() => setShowMoreInfo(false)}
          showMoreInfo={showMoreInfo}
          user={user}
        />
      </div>
    </div>
  );
}

export default OtherProfile;

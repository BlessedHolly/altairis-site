import styles from "./Profile.module.scss";
import noAvatar from "/images/noavatar.jpg";
import changeAvatar from "/images/change_avatar.png";
import {
  useDeletePostMutation,
  useGetProfileQuery,
  useUploadAvatarMutation,
} from "../../store/apiAccountSlice";
import { useEffect, useState } from "react";
import MoreInfo from "./components/MoreInfo/MoreInfo";
import CreatingPost from "./components/CreatingPost/CreatingPost";
import { throttle } from "lodash";
import { formatDate, handleDownload, resizeImage } from "../../utils/utils";

interface IPost {
  image: string;
  description: string;
  date: string;
  _id: string;
}

function Profile() {
  const { data, refetch } = useGetProfileQuery(undefined);
  const user = data?.user || {};
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();
  const [deletePostQuery, { isSuccess }] = useDeletePostMutation();
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showCreating, setShowCreating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedFile = await resizeImage(file, 300, 300);
        await uploadAvatar(resizedFile).unwrap();
        refetch();
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(window.innerWidth);
    }, 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel();
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

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
            <label htmlFor="fileUpload" className={styles["upload-button"]}>
              <img
                className={styles["change-avatar-image"]}
                src={changeAvatar}
                alt=""
              />
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
              disabled={isLoading}
            />
          </div>

          <div className={styles["user-data-container"]}>
            <h2 className={styles["username"]}>{user.name}</h2>
            <p className={styles["email"]}>{user.email.slice(0, 20)}</p>
            <p className={styles["status"]}>{user.status.slice(0, 20)}...</p>
            <button
              onClick={() => setShowMoreInfo(true)}
              className={`normal-button ${styles["more-button"]}`}
            >
              More
            </button>
            {windowWidth >= 769 ? (
              <button
                onClick={() => {
                  if (!isLoadingPost) setShowCreating(true);
                }}
                className={`normal-button ${styles["create-button"]}`}
                disabled={isLoadingPost}
              >
                Create a post
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  width="13.000000pt"
                  height="15.000000pt"
                  viewBox="0 0 512.000000 512.000000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill="#000000"
                    stroke="none"
                  >
                    <path d="M2429 5107 c-56 -16 -130 -69 -163 -116 -58 -84 -56 -35 -56 -1122 l0 -999 -948 0 c-634 0 -968 -4 -1008 -11 -152 -27 -249 -143 -249 -299 0 -156 97 -272 249 -299 40 -7 374 -11 1008 -11 l948 0 2 -1007 3 -1008 23 -50 c53 -114 154 -179 282 -180 129 0 221 61 279 185 l26 55 3 1003 3 1002 988 0 c662 0 1007 4 1047 11 273 49 344 399 112 555 -31 21 -69 36 -111 43 -47 8 -341 9 -1056 4 l-991 -6 0 1006 c0 985 0 1007 -20 1060 -24 64 -87 132 -153 165 -56 28 -155 37 -218 19z" />
                  </g>
                </svg>
              </button>
            ) : null}
          </div>
        </div>
        {windowWidth < 769 && (
          <button
            onClick={() => setShowCreating(true)}
            className={`normal-button ${styles["create-button"]}`}
            disabled={isLoadingPost}
          >
            Create a post
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.0"
              width="13.000000pt"
              height="15.000000pt"
              viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path d="M2429 5107 c-56 -16 -130 -69 -163 -116 -58 -84 -56 -35 -56 -1122 l0 -999 -948 0 c-634 0 -968 -4 -1008 -11 -152 -27 -249 -143 -249 -299 0 -156 97 -272 249 -299 40 -7 374 -11 1008 -11 l948 0 2 -1007 3 -1008 23 -50 c53 -114 154 -179 282 -180 129 0 221 61 279 185 l26 55 3 1003 3 1002 988 0 c662 0 1007 4 1047 11 273 49 344 399 112 555 -31 21 -69 36 -111 43 -47 8 -341 9 -1056 4 l-991 -6 0 1006 c0 985 0 1007 -20 1060 -24 64 -87 132 -153 165 -56 28 -155 37 -218 19z" />
              </g>
            </svg>
          </button>
        )}

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
                              className={styles["post-button"]}
                              onClick={() => {
                                const sure = confirm(
                                  "Are you sure you want to delete this post?"
                                );
                                if (sure) {
                                  deletePostQuery(post._id);
                                }
                              }}
                            >
                              <span>Delete post</span>
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
                                  <path d="M1992 4836 c-95 -24 -197 -82 -270 -155 -106 -106 -159 -223 -170 -376 l-7 -90 -290 -5 -290 -5 -57 -28 c-111 -55 -185 -154 -209 -283 -16 -83 -6 -226 21 -296 24 -66 93 -147 154 -183 l41 -24 88 -1288 c48 -708 94 -1322 102 -1363 42 -217 214 -398 431 -454 54 -14 181 -16 1026 -16 829 0 972 2 1023 15 192 49 357 206 416 395 22 73 24 92 136 1718 l68 993 41 24 c61 36 130 117 154 183 27 70 37 213 21 296 -24 129 -98 228 -209 283 l-57 28 -290 5 -290 5 -7 90 c-3 50 -14 113 -23 140 -66 194 -227 345 -416 390 -86 20 -1053 21 -1137 1z m1109 -329 c48 -24 103 -79 125 -126 10 -20 20 -66 22 -103 l4 -68 -691 0 -691 0 0 54 c0 116 66 212 174 253 23 9 164 11 526 10 456 -2 498 -3 531 -20z m993 -639 c21 -30 21 -136 0 -166 l-15 -22 -1519 0 -1519 0 -15 22 c-10 14 -16 44 -16 83 0 39 6 69 16 83 l15 22 1519 0 1519 0 15 -22z m-214 -515 c0 -5 -38 -575 -86 -1268 -53 -775 -91 -1279 -99 -1310 -18 -65 -71 -126 -137 -159 l-52 -26 -946 0 -946 0 -52 26 c-66 33 -119 94 -137 159 -8 31 -46 535 -99 1310 -48 693 -86 1263 -86 1268 0 4 594 7 1320 7 726 0 1320 -3 1320 -7z" />
                                  <path d="M1730 2908 c-19 -12 -45 -43 -57 -68 l-22 -45 55 -825 c60 -909 56 -881 127 -928 79 -52 181 -26 226 58 l23 45 -55 833 c-61 901 -58 880 -120 924 -47 34 -132 36 -177 6z" />
                                  <path d="M2480 2908 c-18 -13 -43 -36 -54 -51 -21 -28 -21 -34 -24 -873 -2 -825 -2 -845 18 -883 57 -113 223 -113 280 0 20 38 20 58 18 883 -3 839 -3 845 -24 873 -35 48 -82 73 -134 73 -32 0 -57 -7 -80 -22z" />
                                  <path d="M3232 2913 c-49 -24 -72 -64 -83 -141 -5 -37 -32 -419 -60 -849 l-51 -782 23 -42 c46 -83 148 -109 226 -57 71 47 67 19 127 928 l55 825 -22 45 c-40 82 -133 114 -215 73z" />
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
          refetchProfile={() => refetch()}
        />
        <CreatingPost
          closeCreating={() => setShowCreating(false)}
          showCreating={showCreating}
          setIsLoadingPost={(loading: boolean) => setIsLoadingPost(loading)}
          refetchMoreInfo={() => refetch()}
        />
      </div>
    </div>
  );
}

export default Profile;

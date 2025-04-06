import styles from "./Profile.module.scss";
import noAvatar from "/images/noavatar.jpg";
import changeAvatar from "/images/change_avatar.png";
import {
  useGetProfileQuery,
  useUploadAvatarMutation,
} from "../../store/apiAccountSlice";
import { useEffect, useState } from "react";
import MoreInfo from "./components/MoreIfo/MoreInfo/MoreInfo";
import CreatingPost from "./components/CreatingPost/CreatingPost";
import { throttle } from "lodash";

function Profile() {
  const { data, refetch } = useGetProfileQuery(undefined);
  const user = data?.user || {};
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();

  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate} at ${formattedTime}`;
  }

  const resizeImage = (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const originalWidth = img.width;
          const originalHeight = img.height;

          const ratio = Math.min(
            maxWidth / originalWidth,
            maxHeight / originalHeight
          );

          const newWidth = originalWidth * ratio;
          const newHeight = originalHeight * ratio;

          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context is not available"));
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: "image/png",
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to resize image"));
            }
          }, "image/png");
        };
      };

      reader.onerror = (error) => reject(error);
    });
  };

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

  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showCreating, setShowCreating] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  const [isLoadingPost, setIsLoadingPost] = useState(false);

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
            <label htmlFor="fileUpload" className={styles.uploadButton}>
              <img
                className={styles.changeAvatarImage}
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
          </button>
        )}

        <div className={styles["posts"]}>
          {user.posts
            .map(
              (post: {
                image: string;
                description: string;
                date: string;
                _id: string;
              }) => (
                <div key={post._id} className={styles["post"]}>
                  <div className={styles["post-image-container"]}>
                    <img src={post.image} alt="" />
                  </div>
                  <p className={styles["post-text"]}>{post.description}</p>
                  <p className={styles["post-date"]}>{formatDate(post.date)}</p>
                </div>
              )
            )
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

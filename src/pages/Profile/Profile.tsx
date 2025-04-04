import styles from "./Profile.module.scss";
import noAvatar from "/images/noavatar.jpg";
import changeAvatar from "/images/change_avatar.png";
import {
  useGetProfileQuery,
  useUploadAvatarMutation,
} from "../../store/apiAccountSlice";
import { useState } from "react";
import some from "/images/some.png";
import MoreInfo from "./components/MoreIfo/MoreInfo";

function Profile() {
  const { data, refetch } = useGetProfileQuery(undefined);
  const user = data?.user || {};
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();

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
            <p className={styles["email"]}>{user.email}</p>
            <p className={styles["status"]}>Crafting the Metaverse.......</p>
            <button
              onClick={() => setShowMoreInfo(true)}
              className={`normal-button ${styles["more-button"]}`}
            >
              More
            </button>
          </div>
        </div>

        {/* Посты */}
        <div className={styles["posts"]}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles["post"]}>
              <div className={styles["post-image"]}>
                <img src={some} alt="" />
              </div>
              <p className={styles["post-text"]}>
                This is the description of the user's post. There may be some
                text here.
              </p>
            </div>
          ))}
        </div>

        <MoreInfo
          changeMoreInfo={() => setShowMoreInfo(false)}
          showMoreInfo={showMoreInfo}
          refetchMoreInfo={() => refetch()}
        />
      </div>
    </div>
  );
}

export default Profile;

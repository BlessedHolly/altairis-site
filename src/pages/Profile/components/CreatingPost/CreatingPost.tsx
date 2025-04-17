// src/components/CreatingPost/CreatingPost.tsx
import React, { useEffect, useState } from "react";
import styles from "./CreatingPost.module.scss";
import { useCreatePostMutation } from "../../../../store/apiSlice";

interface ICreatingPostProps {
  showCreating: boolean;
  closeCreating: () => void;
  refetchMoreInfo: () => void;
  setIsLoadingPost: (loading: boolean) => void;
}

function CreatingPost({
  showCreating,
  closeCreating,
  refetchMoreInfo,
  setIsLoadingPost,
}: ICreatingPostProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const [createPost, { isSuccess, isLoading, reset }] = useCreatePostMutation();

  useEffect(() => {
    if (isSuccess) {
      refetchMoreInfo();
      setIsLoadingPost(false);
      reset();
    }
  }, [isSuccess, refetchMoreInfo, setIsLoadingPost, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMediaFile(file);
    if (!file) {
      setMediaPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);

    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;
      video.muted = true;
      video.playsInline = true;

      video.addEventListener("loadeddata", () => {
        video.currentTime = 0.5;
      });
      video.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setMediaPreview(canvas.toDataURL("image/png"));
        }
        URL.revokeObjectURL(url);
      });
    } else {
      setMediaPreview(url);
    }
  };

  const nextSlide = () => {
    setSlideDirection("right");
    setCurrentSlide((prev) => Math.min(prev + 1, 1));
  };

  const prevSlide = () => {
    setSlideDirection("left");
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const createPostSend = () => {
    createPost({ image: mediaFile, description, date: new Date() });
    closeCreating();
    setIsLoadingPost(true);
  };

  const slideClass =
    currentSlide === 0
      ? slideDirection === "right"
        ? styles["slide-enter-from-left"]
        : styles["slide-enter-from-right"]
      : slideDirection === "right"
      ? styles["slide-enter-from-left"]
      : styles["slide-enter-from-right"];

  return (
    <>
      <div
        className={`${styles["loading-post"]} ${
          isLoading ? styles["show"] : styles["hide"]
        }`}
      >
        Post is loading
      </div>

      {showCreating && !isLoading && (
        <div
          onClick={closeCreating}
          className={styles["creating-post-container"]}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles["creating-post"]}
          >
            <div className={`${styles["slide-wrapper"]} ${slideClass}`}>
              {currentSlide === 0 ? (
                <div className={styles.slide}>
                  <div className={styles["image-upload"]}>
                    {mediaPreview ? (
                      <div className={styles["preview-wrapper"]}>
                        {mediaFile?.type.startsWith("video/") ? (
                          <video
                            src={URL.createObjectURL(mediaFile)}
                            className={styles["preview-image"]}
                            controls
                          />
                        ) : (
                          <img
                            src={mediaPreview!}
                            alt="Preview"
                            className={styles["preview-image"]}
                          />
                        )}

                        <label className={styles["change-image-label"]}>
                          Change Image
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className={styles["hidden-file-input"]}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className={styles["select-image-label"]}>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          className={styles["hidden-file-input"]}
                        />
                        Click to select an image or video
                      </label>
                    )}
                  </div>
                  <div className={styles["navigation-buttons"]}>
                    <button
                      className={styles["nav-button"]}
                      onClick={nextSlide}
                      disabled={!mediaFile}
                    >
                      ➡
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.slide}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a description..."
                    className={styles["description-input"]}
                  />
                  <div className={styles["navigation-buttons"]}>
                    <button
                      className={styles["nav-button"]}
                      onClick={prevSlide}
                    >
                      ⬅
                    </button>
                    <button
                      onClick={createPostSend}
                      className={styles["nav-button"]}
                      disabled={isLoading}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreatingPost;

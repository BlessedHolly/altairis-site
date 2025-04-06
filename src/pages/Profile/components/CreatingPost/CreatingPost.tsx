import { useEffect, useState } from "react";
import styles from "./CreatingPost.module.scss";
import { useCreatePostMutation } from "../../../../store/apiAccountSlice";

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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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

  const [createPost, { isSuccess, isLoading, reset }] = useCreatePostMutation();

  useEffect(() => {
    if (isSuccess) {
      refetchMoreInfo();
      setIsLoadingPost(false);
      reset();
    }
  }, [isSuccess, refetchMoreInfo, setIsLoadingPost, reset]);

  function createPostSend() {
    const date = new Date();
    createPost({ image, description, date });
    closeCreating();
    setIsLoadingPost(true);
  }

  const slideClass =
    currentSlide === 0
      ? slideDirection === "right"
        ? styles.slideEnterFromLeft
        : styles.slideEnterFromRight
      : slideDirection === "right"
      ? styles.slideEnterFromLeft
      : styles.slideEnterFromRight;

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
            <div className={`${styles.slideWrapper} ${slideClass}`}>
              {currentSlide === 0 ? (
                <div className={styles.slide}>
                  <div className={styles.imageUpload}>
                    {imagePreview ? (
                      <div className={styles.previewWrapper}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className={styles.previewImage}
                        />
                        <label className={styles.changeImageLabel}>
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles.hiddenFileInput}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className={styles.selectImageLabel}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className={styles.hiddenFileInput}
                        />
                        Click to select an image
                      </label>
                    )}
                  </div>
                  <div className={styles.navigationButtons}>
                    <button
                      className={styles.navButton}
                      onClick={nextSlide}
                      disabled={!image}
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
                    className={styles.descriptionInput}
                  />
                  <div className={styles.navigationButtons}>
                    <button className={styles.navButton} onClick={prevSlide}>
                      ⬅
                    </button>
                    <button
                      onClick={createPostSend}
                      className={styles.navButton}
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

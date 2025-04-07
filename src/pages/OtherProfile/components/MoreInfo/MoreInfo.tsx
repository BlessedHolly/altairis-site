import styles from "./MoreInfo.module.scss";

interface IUser {
  avatar: string;
  name: string;
  status: string;
}

interface IMoreInfoProps {
  showMoreInfo: boolean;
  closeMoreInfo: () => void;
  user: IUser;
}

function MoreInfo({ showMoreInfo, closeMoreInfo, user }: IMoreInfoProps) {
  return (
    <>
      {showMoreInfo ? (
        <div onClick={closeMoreInfo} className={styles["more-info-container"]}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles["more-info"]}
          >
            <div className={styles["user-data-container"]}>
              <div className={styles["user-name-buttons-container"]}>
                <h2 className={styles["username"]}>{user.name}</h2>
              </div>
              <div className={styles["data-container"]}>
                <form className={styles["change-form"]}>
                  <div
                    className={styles["submit-close-changing-container"]}
                  ></div>
                </form>
              </div>
              <div className={styles["data-container"]}>
                <form className={styles["change-form"]}>
                  <textarea
                    className={styles["status"]}
                    name="status"
                    disabled={true}
                    value={user.status}
                    placeholder="No status"
                  ></textarea>
                  <div
                    className={styles["submit-close-changing-container"]}
                  ></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MoreInfo;

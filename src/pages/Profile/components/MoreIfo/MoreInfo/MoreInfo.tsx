import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./MoreInfo.module.scss";
import { changeEmailSchema } from "../../../../../../validationSchema";
import {
  useDeleteAccountMutation,
  useGetProfileQuery,
  useUpdateEmailMutation,
  useUpdateStatusMutation,
} from "../../../../../store/apiAccountSlice";
import * as Yup from "yup";

interface IMoreInfoProps {
  showMoreInfo: boolean;
  closeMoreInfo: () => void;
  refetchProfile: () => void;
}

function MoreInfo({
  showMoreInfo,
  closeMoreInfo,
  refetchProfile,
}: IMoreInfoProps) {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ message: string } | null>(
    null
  );
  const inputEmail = useRef<null | HTMLInputElement>(null);
  const inputStatus = useRef<null | HTMLTextAreaElement>(null);
  const { data, refetch } = useGetProfileQuery(undefined);
  const user = data?.user || {};
  const [email, setEmail] = useState<string>(user.email);
  const [status, setStatus] = useState<string>(user.status);
  const [deleteAccount, { isSuccess }] = useDeleteAccountMutation();

  useEffect(() => {
    if (user.email) {
      setEmail(user.email);
    }
  }, [user.email]);

  const [updateEmail, { error: serverErrorEmail }] = useUpdateEmailMutation();

  const [updateStatus, { error: serverErrorStatus }] =
    useUpdateStatusMutation();

  async function handleSubmitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = e.currentTarget.email.value;

    if (email === user.email) {
      setErrorMessage({
        message: "Email must be different from the current one",
      });
      return;
    }

    try {
      await changeEmailSchema.validate({ email });
      await updateEmail({ email }).unwrap();
      refetch();
      refetchProfile();
      setIsEditingEmail(false);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrorMessage({ message: error.message });
      } else if (serverErrorEmail) {
        if ("status" in serverErrorEmail) {
          setErrorMessage({
            message: `Server error: ${serverErrorEmail.status}`,
          });
        } else if ("message" in serverErrorEmail) {
          setErrorMessage({ message: `Error: ${serverErrorEmail.message}` });
        } else {
          setErrorMessage({ message: "Unknown server error" });
        }
      }
    }
  }

  async function handleSubmitStatus(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const status = e.currentTarget.status.value;

    if (status === user.status) {
      setErrorMessage({
        message: "Status must be different from the current one",
      });
      return;
    }

    try {
      await updateStatus(status).unwrap();
      refetch();
      refetchProfile();
      setIsEditingStatus(false);
    } catch {
      if (serverErrorStatus) {
        if ("status" in serverErrorStatus) {
          setErrorMessage({
            message: `Server error: ${serverErrorStatus.status}`,
          });
        } else if ("message" in serverErrorStatus) {
          setErrorMessage({ message: `Error: ${serverErrorStatus.message}` });
        } else {
          setErrorMessage({ message: "Unknown server error" });
        }
      }
    }
  }

  useEffect(() => {
    if (isEditingEmail && inputEmail.current) {
      inputEmail.current.focus();
    }
  }, [isEditingEmail]);

  useEffect(() => {
    if (isEditingStatus && inputStatus.current) {
      inputStatus.current.focus();
    }
  }, [isEditingStatus]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (isSuccess) location.reload();
  }, [isSuccess]);

  return (
    <>
      <div
        className={`${styles.errorModal} ${
          visible ? styles.show : styles.hide
        }`}
      >
        {errorMessage?.message}
      </div>
      {showMoreInfo ? (
        <div onClick={closeMoreInfo} className={styles["more-info-container"]}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles["more-info"]}
          >
            <div className={styles["user-data-container"]}>
              <div className={styles["user-name-buttons-container"]}>
                <h2 className={styles["username"]}>{user.name}</h2>
                <div className={styles["delete-logout-container"]}>
                  <button
                    className={styles["logout-delete-button"]}
                    onClick={() => {
                      const sure = confirm(
                        "Are you sure you want to log out of your account?"
                      );
                      if (sure) {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        location.reload();
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" x2="9" y1="12" y2="12"></line>
                    </svg>
                    <span>LogOut</span>
                  </button>
                  <button
                    className={styles["logout-delete-button"]}
                    onClick={() => {
                      const sure = confirm(
                        "Are you sure you want to delete your account?"
                      );
                      if (sure) {
                        deleteAccount(undefined);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="12pt"
                      height="18pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path d="M3117 4465 c-82 -28 -126 -100 -127 -201 0 -82 30 -139 95 -179 l48 -30 707 0 707 0 48 30 c65 40 95 97 95 179 -1 104 -53 182 -138 206 -24 6 -279 10 -717 10 -550 -1 -687 -4 -718 -15z" />
                        <path d="M1880 4044 c-85 -17 -193 -50 -256 -78 -257 -119 -450 -349 -526 -627 -20 -72 -23 -107 -23 -249 0 -142 4 -176 23 -245 52 -178 136 -319 268 -445 189 -180 401 -264 669 -262 106 0 148 5 229 26 342 89 603 350 692 691 33 126 37 314 10 439 -62 284 -253 530 -513 660 -132 66 -228 88 -398 91 -82 2 -161 1 -175 -1z m316 -445 c129 -40 247 -144 309 -273 189 -397 -146 -834 -581 -755 -183 33 -348 179 -405 358 -25 77 -29 230 -10 301 71 252 298 413 556 393 39 -3 97 -14 131 -24z" />
                        <path d="M1668 1910 c-567 -42 -888 -187 -1083 -489 -82 -126 -151 -317 -138 -383 19 -102 108 -188 193 -188 97 1 190 78 224 186 87 280 300 400 786 444 147 13 601 13 745 0 450 -41 649 -139 760 -373 25 -52 45 -99 45 -104 0 -20 83 -104 122 -124 140 -71 333 51 315 200 -8 65 -74 223 -131 316 -182 290 -470 441 -956 500 -158 19 -701 28 -882 15z" />
                      </g>
                    </svg>
                    <span>Delete account</span>
                  </button>
                </div>
              </div>
              <div className={styles["data-container"]}>
                <form
                  className={styles["change-form"]}
                  onSubmit={handleSubmitEmail}
                  noValidate
                >
                  <input
                    ref={inputEmail}
                    className={styles["email"]}
                    type="email"
                    name="email"
                    disabled={!isEditingEmail}
                    size={email?.length}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <div className={styles["submit-close-changing-container"]}>
                    {isEditingEmail ? (
                      <>
                        <button
                          className={styles["submit-change-button"]}
                          type="submit"
                        >
                          <svg
                            version="1.0"
                            width="20pt"
                            height="20pt"
                            viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                              fill="#000000"
                              stroke="none"
                            >
                              <path d="M4753 4915 c-61 -19 -99 -43 -220 -141 -849 -689 -1739 -1730 -2640 -3087 -113 -170 -206 -307 -208 -305 -1 2 -206 347 -454 768 -249 421 -466 780 -484 797 -98 103 -270 74 -424 -70 -119 -112 -193 -251 -193 -367 0 -67 -56 39 655 -1234 297 -532 554 -981 570 -998 17 -17 55 -42 85 -57 49 -23 67 -26 160 -26 78 1 126 7 185 23 90 26 293 123 373 180 53 37 54 39 141 237 739 1688 1506 2896 2517 3962 153 160 174 189 174 239 0 76 -119 116 -237 79z" />
                            </g>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingEmail((prev) => !prev);
                            setEmail(user.email);
                          }}
                          type="button"
                          className={styles["close-changing-button"]}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.0"
                            width="20pt"
                            height="20pt"
                            viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                              fill="#000000"
                              stroke="none"
                            >
                              <path d="M835 4381 c-48 -22 -79 -54 -100 -103 -19 -47 -19 -79 0 -126 11 -26 248 -269 793 -814 l777 -778 -782 -782 c-842 -844 -815 -814 -799 -901 13 -71 82 -140 153 -153 87 -16 57 -43 901 799 l782 782 783 -782 c843 -842 813 -815 900 -799 71 13 140 82 153 153 16 87 43 57 -799 901 l-782 782 782 783 c842 843 815 813 799 900 -13 71 -82 140 -153 153 -87 16 -57 43 -901 -799 l-782 -782 -778 777 c-545 545 -788 782 -814 793 -49 20 -84 19 -133 -4z" />
                            </g>
                          </svg>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (!isEditingEmail) {
                            setTimeout(() => {
                              setIsEditingEmail(true);
                            }, 0);
                          }
                        }}
                        className={styles["change-button"]}
                        type="button"
                      >
                        <svg
                          version="1.0"
                          width="20pt"
                          height="20pt"
                          viewBox="0 0 512.000000 512.000000"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <g
                            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                            fill="#000000"
                            stroke="none"
                          >
                            <path d="M4330 5105 c-85 -19 -214 -83 -275 -137 -36 -32 -1660 -1803 -2316 -2526 l-58 -63 -145 -438 c-132 -395 -146 -443 -146 -506 0 -191 175 -335 356 -295 67 15 829 348 881 385 33 23 2067 2240 2326 2535 135 154 189 395 131 590 -58 199 -223 370 -421 436 -98 33 -237 41 -333 19z m215 -444 c108 -49 157 -192 97 -283 -27 -40 -1953 -2148 -1964 -2148 -5 0 -74 59 -154 132 l-144 132 38 40 c22 23 465 507 985 1077 741 812 954 1040 984 1052 51 21 109 21 158 -2z m-2225 -2708 l65 -60 -31 -16 c-72 -37 -426 -188 -431 -183 -5 5 131 424 149 459 10 19 9 20 248 -200z" />
                            <path d="M907 4639 c-232 -24 -451 -132 -614 -302 -128 -133 -208 -280 -256 -467 l-22 -85 0 -1465 0 -1465 28 -100 c92 -337 331 -593 654 -704 151 -51 142 -51 1654 -51 1209 0 1419 2 1493 15 435 76 767 421 825 858 7 50 11 426 11 1051 0 1082 3 1026 -67 1098 -85 87 -221 88 -307 2 -65 -66 -60 14 -66 -1109 l-5 -1020 -22 -66 c-57 -166 -196 -305 -362 -362 l-66 -22 -1410 -3 c-1558 -3 -1484 -6 -1617 60 -86 43 -204 162 -246 248 -64 130 -62 68 -62 1575 0 1511 -2 1441 64 1573 66 132 187 234 336 285 65 22 65 22 1115 27 1157 6 1074 1 1137 67 58 61 74 161 39 239 -26 57 -92 110 -153 123 -59 13 -1960 13 -2081 0z" />
                          </g>
                        </svg>
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div className={styles["data-container"]}>
                <form
                  className={styles["change-form"]}
                  onSubmit={handleSubmitStatus}
                  noValidate
                >
                  <textarea
                    ref={inputStatus}
                    className={styles["status"]}
                    name="status"
                    disabled={!isEditingStatus}
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                    placeholder="About me"
                  ></textarea>
                  <div className={styles["submit-close-changing-container"]}>
                    {isEditingStatus ? (
                      <>
                        <button
                          className={styles["submit-change-button"]}
                          type="submit"
                        >
                          <svg
                            version="1.0"
                            width="20pt"
                            height="20pt"
                            viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                              fill="#000000"
                              stroke="none"
                            >
                              <path d="M4753 4915 c-61 -19 -99 -43 -220 -141 -849 -689 -1739 -1730 -2640 -3087 -113 -170 -206 -307 -208 -305 -1 2 -206 347 -454 768 -249 421 -466 780 -484 797 -98 103 -270 74 -424 -70 -119 -112 -193 -251 -193 -367 0 -67 -56 39 655 -1234 297 -532 554 -981 570 -998 17 -17 55 -42 85 -57 49 -23 67 -26 160 -26 78 1 126 7 185 23 90 26 293 123 373 180 53 37 54 39 141 237 739 1688 1506 2896 2517 3962 153 160 174 189 174 239 0 76 -119 116 -237 79z" />
                            </g>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingStatus((prev) => !prev);
                            setStatus(user.status);
                          }}
                          type="button"
                          className={styles["close-changing-button"]}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.0"
                            width="20pt"
                            height="20pt"
                            viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <g
                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                              fill="#000000"
                              stroke="none"
                            >
                              <path d="M835 4381 c-48 -22 -79 -54 -100 -103 -19 -47 -19 -79 0 -126 11 -26 248 -269 793 -814 l777 -778 -782 -782 c-842 -844 -815 -814 -799 -901 13 -71 82 -140 153 -153 87 -16 57 -43 901 799 l782 782 783 -782 c843 -842 813 -815 900 -799 71 13 140 82 153 153 16 87 43 57 -799 901 l-782 782 782 783 c842 843 815 813 799 900 -13 71 -82 140 -153 153 -87 16 -57 43 -901 -799 l-782 -782 -778 777 c-545 545 -788 782 -814 793 -49 20 -84 19 -133 -4z" />
                            </g>
                          </svg>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (!isEditingStatus) {
                            setTimeout(() => {
                              setIsEditingStatus(true);
                            }, 0);
                          }
                        }}
                        className={styles["change-button"]}
                        type="button"
                      >
                        <svg
                          version="1.0"
                          width="20pt"
                          height="20pt"
                          viewBox="0 0 512.000000 512.000000"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <g
                            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                            fill="#000000"
                            stroke="none"
                          >
                            <path d="M4330 5105 c-85 -19 -214 -83 -275 -137 -36 -32 -1660 -1803 -2316 -2526 l-58 -63 -145 -438 c-132 -395 -146 -443 -146 -506 0 -191 175 -335 356 -295 67 15 829 348 881 385 33 23 2067 2240 2326 2535 135 154 189 395 131 590 -58 199 -223 370 -421 436 -98 33 -237 41 -333 19z m215 -444 c108 -49 157 -192 97 -283 -27 -40 -1953 -2148 -1964 -2148 -5 0 -74 59 -154 132 l-144 132 38 40 c22 23 465 507 985 1077 741 812 954 1040 984 1052 51 21 109 21 158 -2z m-2225 -2708 l65 -60 -31 -16 c-72 -37 -426 -188 -431 -183 -5 5 131 424 149 459 10 19 9 20 248 -200z" />
                            <path d="M907 4639 c-232 -24 -451 -132 -614 -302 -128 -133 -208 -280 -256 -467 l-22 -85 0 -1465 0 -1465 28 -100 c92 -337 331 -593 654 -704 151 -51 142 -51 1654 -51 1209 0 1419 2 1493 15 435 76 767 421 825 858 7 50 11 426 11 1051 0 1082 3 1026 -67 1098 -85 87 -221 88 -307 2 -65 -66 -60 14 -66 -1109 l-5 -1020 -22 -66 c-57 -166 -196 -305 -362 -362 l-66 -22 -1410 -3 c-1558 -3 -1484 -6 -1617 60 -86 43 -204 162 -246 248 -64 130 -62 68 -62 1575 0 1511 -2 1441 64 1573 66 132 187 234 336 285 65 22 65 22 1115 27 1157 6 1074 1 1137 67 58 61 74 161 39 239 -26 57 -92 110 -153 123 -59 13 -1960 13 -2081 0z" />
                          </g>
                        </svg>
                      </button>
                    )}
                  </div>
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

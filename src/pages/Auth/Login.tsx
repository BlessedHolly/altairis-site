import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useLoginProfileMutation } from "../../store/apiSlice";
import { loginSchema } from "../../../validationSchema";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import styles from "./Registration_Login.module.scss";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginProfile, { error, isLoading }] = useLoginProfileMutation();

  const locationData = useLocation();
  const navigate = useNavigate();

  const from = locationData.state?.from || "/";

  async function handleSubmit(values: { email: string; password: string }) {
    try {
      const result = await loginProfile(values).unwrap();

      if (result.accessToken && result.refreshToken) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        navigate(from || "/", { replace: true });
        location.reload();
      } else {
        console.error("Error: userId is missing from response");
      }
    } catch (err) {
      console.error("Login error", err);
    }
  }

  function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === "object" && error !== null && "data" in error;
  }

  return (
    <div className={styles["registration-container"]}>
      <div
        className={`${styles["registration-content"]} ${styles["registration-container-login"]}`}
      >
        <div>
          <h1 className={styles["register-title"]}>Oops😕</h1>
          <h2 className={styles["not-auth-title"]}>
            You are not logged in <br /> to your account
          </h2>
          <p>Login please:</p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, dirty }) => (
              <Form className={styles.form} noValidate>
                <div className={styles["field-container"]}>
                  <label className={styles["text-input"]} htmlFor="email">
                    Email
                  </label>
                  <Field
                    name="email"
                    className={styles["field"]}
                    id="email"
                    type="email"
                    placeholder=""
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className={styles.error}
                  />
                </div>

                <div className={styles["field-container"]}>
                  <label className={styles["text-input"]} htmlFor="password">
                    Password
                  </label>
                  <Field
                    name="password"
                    className={styles["field"]}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className={styles.error}
                  />
                  <div className={styles["hide-show-password"]}>
                    <button
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={styles["hide-show-password-button"]}
                      type="button"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          color="white"
                        >
                          <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-11-8-11-8a18.71 18.71 0 0 1 3.08-4.62M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12" />
                          <path d="M10.73 5.08A10.05 10.05 0 0 1 12 4c7 0 11 8 11 8a18.78 18.78 0 0 1-1.69 2.58M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          color="white"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isValid || !dirty}
                  className={`${styles["registration-btn"]} normal-button`}
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>

          <div className={styles["other-action"]}>
            <p>Don't have an account?</p>
            <Link to={"/registration"} state={{ from }}>
              Registration.
            </Link>
          </div>

          {error &&
            !(
              isFetchBaseQueryError(error) &&
              typeof error.data === "object" &&
              error.data !== null &&
              "message" in error.data
            ) && <p className={styles["error"]}>Failed to login</p>}
          {isFetchBaseQueryError(error) &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data ? (
            <p className={styles["error"]}>
              {(error.data as { message: string }).message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Login;

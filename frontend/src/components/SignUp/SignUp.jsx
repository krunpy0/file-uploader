import styles from "./SignUp.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/sign-up", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        login();
      }
      const result = await res.json();
      setMessage({ message: result.message, ok: res.ok });
    } catch (err) {
      alert(err);
    }
  }
  async function login() {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        navigate("/");
      }
      const result = await res.json();
      setMessage({ message: result.message, ok: res.ok });
    } catch (err) {
      alert(err);
    }
  }
  return (
    <>
      <div className={styles.main}>
        <h1>Create an account</h1>
        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.oneField}>
              <label htmlFor="username">
                <span className={styles.red}>*</span>Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.oneField}>
              <label htmlFor="username">
                <span className={styles.red}>*</span>Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
            </div>
            <div className={styles.login}>
              <p className={styles.prompt}>
                Already have an account? <Link to={"/login"}>Log in</Link>
              </p>
              {message && (
                <p>
                  <span
                    className={message.ok ? styles.errorGreen : styles.errorRed}
                  >
                    {message.ok
                      ? "You succesfully signed in!"
                      : message.message + "."}
                  </span>
                </p>
              )}
            </div>
            <button className={styles.button}>Sign up</button>
          </form>
        </div>
      </div>
    </>
  );
}

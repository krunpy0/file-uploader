import styles from "./Login.module.css";
import { useState } from "react";
export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        alert("res ok");
      }
      console.log("res not ok");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <>
      <div className={styles.main}>
        <h1>Log into your account</h1>
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
            <button>Log in</button>
          </form>
        </div>
      </div>
    </>
  );
}

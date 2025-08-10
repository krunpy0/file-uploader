import styles from "./SignUp.module.css";
import { useState } from "react";
export function SignUp() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/sign-up", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) console.log("res ok");
      console.log("res not ok");
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
            <button>Sign up</button>
          </form>
        </div>
      </div>
    </>
  );
}

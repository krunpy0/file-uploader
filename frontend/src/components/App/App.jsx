import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UploadFile } from "../UploadFile/UploadFile";
import { YourFiles } from "../YourFiles/YourFiles";
import styles from "./App.module.css";
function App() {
  const [user, setUser] = useState(null);
  async function fetchMe() {
    try {
      const res = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });
      if (res.ok) {
        const userData = await res.json();
        console.log(userData);
        setUser(userData);
      } else {
        setUser(null); // if no user
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function logOut() {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        credentials: "include",
      });
      if (res.ok) fetchMe();
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchMe();
    console.log(user);
  }, []);

  if (user) {
    return (
      <>
        <p>Hello, {user.user}</p>
        <button onClick={logOut}>Log out</button>
        <UploadFile fetchMe={fetchMe}></UploadFile>
        <YourFiles user={user}></YourFiles>
      </>
    );
  } else {
    return (
      <>
        <p className={styles.loginPrompt}>
          You need to <Link to={"/login"}>log in</Link> first
        </p>
      </>
    );
  }
}

export default App;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UploadFile } from "../UploadFile/UploadFile";
import { YourFiles } from "../YourFiles/YourFiles.jsx";
import styles from "./App.module.css";
function App() {
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  function refreshFiles() {
    setRefreshTrigger((prev) => prev + 1);
  }
  useEffect(() => {
    fetchMe();
    console.log(user);
  }, []);

  if (user) {
    return (
      <div className={styles.loggedIn}>
        <p>Hello, {user.user}</p>
        <button onClick={logOut}>Log out</button>
        <UploadFile
          onUploadSuccess={refreshFiles}
          fetchMe={fetchMe}
        ></UploadFile>
        <YourFiles user={user} refreshTrigger={refreshTrigger}></YourFiles>
      </div>
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

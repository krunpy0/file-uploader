import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import styles from "./YourFies.module.css";
import { UploadFile } from "../UploadFile/UploadFile";
dayjs.locale("en");
export function YourFiles({ user, refreshTrigger }) {
  const [userInfo, setUserInfo] = useState(null);

  async function fetchUser(id) {
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      credentials: "include",
    });
    const result = await res.json();
    setUserInfo(result);
    console.log(result);
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:3000/delete/file/${id}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (res.ok) {
        fetchUser(user.id);
      } else {
        const result = await res.json();
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  }
  function humanFileSize(bytes, si = true, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + " B";
    }

    const units = si
      ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= thresh &&
      u < units.length - 1
    );

    return bytes.toFixed(dp) + " " + units[u];
  }

  useEffect(() => {
    fetchUser(user.id);
  }, [user.id, refreshTrigger]);

  if (!user) return <div>Loading</div>;
  if (!userInfo) return <p>Loading user info...</p>;

  const filesOutside =
    userInfo.files?.filter((file) => file.folderId === null) || [];
  console.log(filesOutside);
  return (
    <>
      <div className={styles.main}>
        <h1>Your files</h1>
        <div className="folders">
          <h2>Folders</h2>
          <div>
            {userInfo.folders?.map((folder) => (
              <div key={folder.id} className={styles.folder}>
                <h3>{folder.name}</h3>
                <UploadFile folder={folder.id}></UploadFile>
                <p>Files:</p>
                {folder.files.map((file) => (
                  <>
                    <div key={file.id} className={styles.file}>
                      <a
                        className={styles.link}
                        href={`http://localhost:3000/files/${file.id}`}
                        target="__blank"
                      >
                        {file.name}
                      </a>
                      <div className={styles.info}>
                        <p>
                          {dayjs(file.createdAt).format("DD MMMM YYYY, HH:mm")},
                        </p>
                        <p>{humanFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleDelete(file.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Outside of folders</h2>
          <div className={styles.folder}>
            {filesOutside.map((file) => (
              <>
                <div key={file.id} className={styles.file}>
                  <a
                    className={styles.link}
                    href={`http://localhost:3000/files/${file.id}`}
                    target="__blank"
                  >
                    {file.name}
                  </a>
                  <p>{dayjs(file.createdAt).format("DD MMMM YYYY, HH:mm")}</p>
                  {humanFileSize(file.size)}
                  <button
                    onClick={() => {
                      handleDelete(file.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

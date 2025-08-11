import { useState } from "react";
import styles from "../App/App.module.css";
export function UploadFile({ fetchMe, onUploadSuccess, folder }) {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState("");
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) {
      alert("Set file first!");
    }
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    try {
      const res = await fetch("http://localhost:3000/upload", {
        credentials: "include",
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      fetchMe();
      console.log(data);
      setFile(null);
      onUploadSuccess();
    } catch (err) {
      console.log(err);
    }
  }

  async function createFolder() {
    try {
      const res = await fetch("http://localhost:3000/createFolder", {
        credentials: "include",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ currentFolder: null, folderName }),
      });
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  return (
    <>
      <div className={styles.upload}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      {folder ? (
        <div></div>
      ) : (
        <div className={styles.createFolder}>
          <div>
            <label htmlFor="folderName">Folder name</label>
          </div>
          <input
            type="text"
            name="folderName"
            id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <button onClick={createFolder}>Create folder</button>
        </div>
      )}
    </>
  );
}

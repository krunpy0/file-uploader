import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function UploadFile() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) {
      alert("Set file first!");
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        credentials: "include",
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
dayjs.locale("en");
export function YourFiles({ user }) {
  const [userInfo, setUserInfo] = useState(null);

  async function fetchUser(id) {
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      credentials: "include",
    });
    const result = await res.json();
    setUserInfo(result);
    console.log(result);
  }

  useEffect(() => {
    fetchUser(user.id);
  }, [user.id]);

  if (!user) return <div>Loading</div>;
  if (!userInfo) return <p>Loading user info...</p>;

  return (
    <>
      <div>
        <h1>Your files</h1>
        <div>
          {userInfo.files?.map((file) => (
            <div key={file.id}>
              <a
                href={`http://localhost:3000/files/${file.id}`}
                target="__blank"
              >
                {file.name}
              </a>
              <p>{dayjs(file.createdAt).format("DD MMMM YYYY, HH:mm")}</p>
              <p>{file.size} bytes</p>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

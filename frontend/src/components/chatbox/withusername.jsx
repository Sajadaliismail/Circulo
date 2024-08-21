import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";

const AvatarWithUsername = ({ username, profilePicture }) => {
  const [title, setTitle] = useState("");
  const [secondaryTitle, setSecondaryTitle] = useState("");

  useEffect(() => {
    setTitle(username);
  }, [username]);

  return (
    <div className="flex">
      <Avatar src={profilePicture && profilePicture}>
        {username && username[0]}
      </Avatar>

      <div className="ml-2 grid items-center">
        {/* <span className="text-base font-bold">{title}</span> */}
        <span className="text-sm text-stone-500">{secondaryTitle}</span>
      </div>
    </div>
  );
};

export default AvatarWithUsername;

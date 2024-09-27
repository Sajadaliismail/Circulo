import { lazy, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import { useSelector } from "react-redux";

const AvatarWithUsername = lazy(() => import("./withusername"));

const ChatBoxHeader = ({ onClose, onMinimize, data }) => {
  const { userData } = useSelector((state) => state.friends);
  const { user } = useSelector((state) => state.user);
  const [friendId, setFriendId] = useState("");

  useEffect(() => {
    if (data.user1 === user._id) setFriendId(data.user2);
    else setFriendId(data.user1);
  }, []);

  return (
    <div
      onClick={onMinimize}
      className="flex justify-between items-center text-white p-1 rounded-lg ps-2  w-[350px] bg-blue-600 hover:bg-blue-700 cursor-pointer"
    >
      <Box className="flex items-center">
        <AvatarWithUsername
          username={`${userData[friendId]?.firstName} ${userData[friendId]?.lastName}`}
          profilePicture={userData[friendId]?.profilePicture}
        />
        <span className="text-base font-bold">{`${userData[friendId]?.firstName} ${userData[friendId]?.lastName}`}</span>
      </Box>
      <div className="flex mr-3">
        <IconButton onClick={onClose}>
          <CloseIcon className="text-white" />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatBoxHeader;

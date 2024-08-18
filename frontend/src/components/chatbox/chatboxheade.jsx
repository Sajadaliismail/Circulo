import { lazy } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/material";

const AvatarWithUsername = lazy(() => import("./withusername"));

const ChatBoxHeader = ({ title, onClose, onMinimize, profilePicture }) => {
  return (
    <div
      className="flex justify-between items-center bg-blue-600 text-white p-1 rounded-lg "
      style={{ width: "350px" }}
    >
      <AvatarWithUsername username={title} profilePicture={profilePicture} />
      <div className="flex mr-3">
        <IconButton onClick={onMinimize}>
          <MinimizeIcon className="text-white" />
        </IconButton>
        <IconButton onClick={onClose}>
          <CloseIcon className="text-white" />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatBoxHeader;

import { useEffect, useState } from "react";
import MoreVert from "@mui/icons-material/MoreVert";
import {
  ClickAwayListener,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import AvatarWithUsername from "./withusername";
import { useSelector } from "react-redux";

const ChatBoxMessage = ({
  messageId,
  message,
  author,
  avatar,
  onEdit,
  data,
  onRemove,
}) => {
  const [actionMessageId, setActionMessageId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { userData } = useSelector((state) => state.friends);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    console.log(user, author);
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMouseLeave = () => {
    setActionMessageId(undefined);
    setAnchorEl(null);
  };

  const handleClickAway = () => {
    setActionMessageId(undefined);
  };

  const removeMessage = () => {
    handleClose();
    if (onRemove) {
      onRemove(messageId);
    }
  };

  if (author) {
    return (
      <div
        className={`flex my-2 ${
          author === user._id ? "justify-end" : "justify-start"
        }`}
      >
        {author !== user._id && (
          <AvatarWithUsername
            username={userData[author]?.firstName || ""}
            profilePicture={userData[author]?.profilePicture}
            hiddenName={true}
          />
        )}
        <div className="grid">
          {/* <Typography variant="caption">
            {userData[author]?.firstName}
          </Typography> */}
          <div className="w-fit max-w-[90%] bg-stone-200 p-2 rounded-xl">
            {message}
          </div>
        </div>
        {author === user._id && (
          <AvatarWithUsername
            username={userData[author]?.firstName || ""}
            profilePicture={userData[author]?.profilePicture}
            hiddenName={true}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="flex justify-end my-2"
      onMouseEnter={() => setActionMessageId(messageId)}
      onMouseLeave={onMouseLeave}
    >
      {actionMessageId === messageId && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <>
            <IconButton size="small" onClick={handleClick}>
              <MoreVert className="hover:bg-stone-200 rounded-full" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  width: 100,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={removeMessage}>Remove </MenuItem>
              <MenuItem onClick={handleClose}>Chỉnh sửa</MenuItem>
            </Menu>
          </>
        </ClickAwayListener>
      )}
      <div
        className={"w-fit max-w-[90%] bg-blue-500 text-white p-2 rounded-xl"}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBoxMessage;

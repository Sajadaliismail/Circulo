import { useState } from "react";
import MoreVert from "@mui/icons-material/MoreVert";
import {
  ClickAwayListener,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import AvatarWithUsername from "./withusername";
import { useSelector } from "react-redux";
import { AddReaction } from "@mui/icons-material";
import chatSocket from "../../features/utilities/Socket-io";

const ChatBoxMessage = ({
  messageId,
  message,
  author,
  data,
  onRemove,
  emoji,
  roomId,
}) => {
  const [actionMessageId, setActionMessageId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { userData } = useSelector((state) => state.friends);
  const { user } = useSelector((state) => state.user);

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
  const handleEmoji = (id, emoji, friendId, room) => {
    chatSocket.emit("emoji_send", { id, emoji, friendId, roomId: room });
  };

  const emojis = ["😀", "😂", "❤️", "👍", "👎"];

  if (author) {
    return (
      <div
        className={`flex my-2  ${
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
        <div className="grid relative">
          <div className="w-fit max-w-[90%] bg-stone-200 p-2 rounded-xl relative">
            {message}
          </div>
          {author === user._id ? (
            emoji && (
              <Fab
                sx={{
                  position: "absolute",
                  bottom: -5,
                  left: -20,
                  width: 30,
                  height: 30,
                  minHeight: 30,
                }}
              >
                {emoji}
              </Fab>
            )
          ) : emoji ? (
            <SpeedDial
              ariaLabel="Emoji"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -30,
                width: 30,
                height: 30,
                minHeight: 30,
              }}
              icon={emoji}
              direction="right"
            >
              {emojis.map((action) => (
                <SpeedDialAction
                  sx={{ fontSize: "20px", margin: "8px 0" }}
                  key={action}
                  icon={action}
                  onClick={() => {
                    handleEmoji(messageId, action, author, roomId);
                  }}
                />
              ))}
            </SpeedDial>
          ) : (
            <SpeedDial
              ariaLabel="Emoji"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -30,
                width: 30,
                height: 30,
                minHeight: 30,
              }}
              icon={
                <AddReaction className="text-cyan-700 bg-white rounded-full" />
              }
              direction="right"
            >
              {emojis.map((action) => (
                <SpeedDialAction
                  sx={{ fontSize: "20px", margin: "8px 0" }}
                  key={action}
                  icon={action}
                  onClick={() => handleEmoji(messageId, action, author, roomId)}
                />
              ))}
            </SpeedDial>
          )}
        </div>
        {author === user._id && (
          <AvatarWithUsername
            username={userData[author]?.firstName || ""}
            profilePicture={userData[author]?.profilePicture}
            hiddenName={true}
            data={data}
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

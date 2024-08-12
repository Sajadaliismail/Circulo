import {
  Avatar,
  Badge,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useSelector } from "react-redux";

const UserList = ({ friend, handleChat }) => {
  const { unReadMessages, chats } = useSelector((state) => state.chats);

  return (
    <ListItemButton
      onClick={(e) => handleChat(friend, e)}
      sx={{ width: "100%" }}
      key={friend.id}
    >
      <ListItemIcon>
        <Badge
          badgeContent={chats[friend._id]}
          color="error"
          invisible={false}
          variant="standard"
          overlap="circular"
        >
          <Avatar alt="Remy Sharp" src={friend?.profilePicture}>
            {friend?.firstName[0]}
          </Avatar>
        </Badge>
      </ListItemIcon>
      <ListItemText primary={`${friend?.firstName} ${friend?.lastName}`} />
      <ListItemText secondary="" align="right" />
    </ListItemButton>
  );
};

export default UserList;

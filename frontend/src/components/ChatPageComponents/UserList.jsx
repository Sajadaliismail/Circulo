import {
  Avatar,
  Badge,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";

const UserList = ({ friend, handleChat, roomId }) => {
  const { unReadMessages, chats } = useSelector((state) => state.chats);
  const { userData } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserDetails(friend));
    };
    if (userData[friend]) setUserDetails(userData[friend]);
    else {
      fetchData().then(() => setUserDetails(userData[friend]));
    }
  });

  return (
    <>
      {userDetails && (
        <ListItemButton
          onClick={(e) => handleChat(friend, roomId, e)}
          // sx={{ width: "100%" }}
          sx={{
            fontWeight: 700,
            padding: "10px 20px",
            borderRadius: "12px",
            letterSpacing: "0.5px",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              backgroundColor: "#c4c9d4",
              color: "black",
            },
          }}
          key={friend.id}
        >
          <ListItemIcon>
            <Badge
              badgeContent={chats[friend]}
              color="error"
              variant="standard"
              overlap="circular"
            >
              <Avatar
                alt={`${userDetails?.firstName} ${userDetails?.lastName}`}
                src={userDetails?.profilePicture}
              >
                {userDetails?.firstName?.[0]}
              </Avatar>
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary={`${userDetails?.firstName} ${userDetails?.lastName}`}
          />
          <ListItemText secondary="" align="right" />
        </ListItemButton>
      )}
    </>
  );
};

export default UserList;

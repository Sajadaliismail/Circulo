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
import { ChatRoomMessages } from "../../atoms/chatAtoms";
import { useRecoilState } from "recoil";
import { setReadMessages } from "../../features/chats/chatsSlice";

const UserList = ({
  friend,
  handleChat,
  roomId,
  unreadCount = 0,
  setFriendsData,
}) => {
  const { userData } = useSelector((state) => state.friends);
  const [chatMessages, setChatMessages] = useRecoilState(ChatRoomMessages);

  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserDetails(friend));
    };

    if (userData[friend]) {
      setUserDetails(userData[friend]);
    } else {
      fetchData().then(() => setUserDetails(userData[friend]));
    }
  }, [userData, friend, dispatch]);
  const handleClick = async (e) => {
    dispatch(setReadMessages(friend));
    setFriendsData((prev) => {
      return prev.map((user) => {
        if (user._id === friend) {
          console.log(user, friend);
          return {
            ...user,
            unreadCount: 0,
          };
        }
        return user;
      });
    });
    handleChat(friend, roomId, e);
  };

  return (
    <>
      {userDetails && (
        <ListItemButton
          onClick={handleClick}
          sx={{
            fontWeight: 700,
            padding: "10px 20px",
            borderRadius: "12px",
            letterSpacing: "0.5px",
            mb: "2px",
            backgroundColor:
              unreadCount && unreadCount > 0 ? "#6178b54f" : null,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              backgroundColor: "#c4c9d4",
              color: "black",
            },
          }}
          key={friend?.id}
        >
          <ListItemIcon>
            <Badge
              badgeContent={unreadCount}
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

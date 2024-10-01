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
// import { useTimeAgo } from "../../hooks/useTimeAgo";
import { convertUTCToIST } from "../../pages/Utilitis";

const UserList = ({
  friend,
  handleChat,
  roomId,
  unreadCount = 0,
  setFriendsData,
}) => {
  const { userData } = useSelector((state) => state.friends);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState(null);
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!userData[friend]) {
        await dispatch(fetchUserDetails(friend));
      } else {
        setUserDetails(userData[friend]);
      }
    };

    fetchData();
  }, [userData, friend, dispatch]);

  useEffect(() => {
    if (userDetails?.onlineTime) {
      const time = convertUTCToIST(userDetails?.onlineTime);
      if (time !== null) setTimeAgo(time);
    }
  }, [userDetails]);

  const handleClick = async (e) => {
    setFriendsData((prev) =>
      prev.map((user) =>
        user._id === friend ? { ...user, unreadCount: 0 } : user
      )
    );
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
          <ListItemText
            secondary={userDetails?.onlineStatus ? "Online" : timeAgo}
            align="right"
            secondaryTypographyProps={{
              sx: {
                fontSize: "0.70rem",
                textWrap: "nowrap",
                textAlign: "right",
              }, // Adjust the size as needed
            }}
          />
        </ListItemButton>
      )}
    </>
  );
};

export default UserList;

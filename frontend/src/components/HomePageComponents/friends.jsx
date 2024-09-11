import { Avatar, Box, Typography, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetails,
  getFriends,
} from "../../features/friends/friendsAsyncThunks";
import { useNavigate } from "react-router-dom";
import { AnimatedTooltip } from "../CommonComponents/AnimatedHoverComponent";

function Friends() {
  const dispatch = useDispatch();
  const { friends, userData, error } = useSelector((state) => state.friends);

  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriendsAndUserData = async () => {
      try {
        if (initialLoad.current) {
          await dispatch(getFriends());
          initialLoad.current = false;
        }
        const friendIds = friends.filter((id) => !userData[id]);

        if (friendIds.length > 0) {
          await Promise.all(
            friendIds.map((id) => dispatch(fetchUserDetails(id)))
          );
        }
      } catch (error) {
        console.error("Failed to fetch friends or user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndUserData();
  }, [dispatch, friends]);

  return (
    <>
      <Box
        sx={{
          marginY: "10px",
          paddingX: "15px",
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
          scrollbarWidth: "none",
          maxHeight: "80vh",
        }}
      >
        <Typography variant="h6">Friends</Typography>

        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                padding: 1,
                borderRadius: "12px",
                letterSpacing: "0.5px",
                marginBottom: 1,
              }}
            >
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton width="60%" height={24} />
            </Box>
          ))
        ) : error ? (
          <Typography variant="body2" color="error">
            Failed to load friends.
          </Typography>
        ) : friends && friends?.length === 0 ? (
          <Typography variant="body2">No friends.</Typography>
        ) : (
          friends?.map(
            (friend) =>
              userData[friend] && (
                <Box
                  key={`friends${userData[friend]?._id}`}
                  display={"flex"}
                  alignItems={"center"}
                  gap={2}
                  position="relative"
                  sx={{
                    padding: 1,
                    borderRadius: "12px",
                    letterSpacing: "0.5px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                      backgroundColor: "#c4c9d4",
                      color: "black",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`profile/${friend}`)}
                >
                  <AnimatedTooltip key={`friends-${friend}`} userId={friend} />
                  {userData[friend]?.firstName} {userData[friend]?.lastName}
                </Box>
              )
          )
        )}
      </Box>
    </>
  );
}

export default Friends;

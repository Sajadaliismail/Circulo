import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  CssBaseline,
  Divider,
  Icon,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFriends,
  fetchUserDetails,
} from "../../features/friends/friendsAsyncThunks";
import HoverComponent from "../CommonComponents/HoverComponen";

function Friends({ fetchUserData }) {
  const { friends } = useSelector((state) => state.friends);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFriends());
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <Container
        sx={{
          height: "60vh",
          marginY: "10px",
          paddingX: "15px",
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
          scrollbarWidth: "none",
        }}
      >
        <Typography variant="h6">Friends</Typography>

        {friends && friends?.length === 0 ? (
          <Typography variant="body2">No friends.</Typography>
        ) : (
          friends?.map((people) => (
            <Box
              key={`friends${people?.id}`}
              display={"flex"}
              alignItems={"center"}
              gap={2}
              position="relative"
              // onMouseOver={() => {
              //   fetchUserData(people.id);
              // }}
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
                // [`&:hover .friends-${people.id}`]: {
                //   visibility: "visible",
                // },
              }}
            >
              <Avatar src={people?.profilePicture}>
                {people?.firstName[0]}
              </Avatar>
              {people?.firstName} {people?.lastName}
              <HoverComponent component={"friends"} id={people.id} />
            </Box>
          ))
        )}
      </Container>
    </>
  );
}

export default Friends;

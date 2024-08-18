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
          height: "100vh",
          marginY: "10px",
          paddingY: "10px",

          paddingX: "15px",
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
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
              onMouseOver={() => {
                fetchUserData(people.id);
              }}
              sx={{
                cursor: "pointer",
                [`&:hover .friends-${people.id}`]: {
                  visibility: "visible",
                },
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

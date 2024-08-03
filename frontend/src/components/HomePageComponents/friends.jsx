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
import { getFriends } from "../../features/friends/friendsAsyncThunks";
import { Close, Done } from "@mui/icons-material";

function Friends() {
  const { friends } = useSelector((state) => state.friends);
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(getSuggestions());
    // dispatch(getRequests());
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
          borderRadius: "10px",
          paddingX: "15px",
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
        }}
      >
        <Typography variant="h6">Friends</Typography>

        {friends.length === 0 ? (
          <Typography variant="body2">No friends.</Typography>
        ) : (
          friends.map((people) => (
            <Box key={people.id} display={"flex"} alignItems={"center"} gap={2}>
              <Avatar src={people?.profilePicture}>
                {people.firstName[0]}
              </Avatar>
              {people.firstName} {people.lastName}
            </Box>
          ))
        )}
      </Container>
    </>
  );
}

export default Friends;

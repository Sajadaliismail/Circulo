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
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptRequest,
  cancelRequest,
  getFriends,
  getRequests,
  getSuggestions,
  sentRequest,
} from "../../features/friends/friendsAsyncThunks";
import { Close, Done } from "@mui/icons-material";
import HoverComponent from "../CommonComponents/HoverComponen";

function Suggestions({ fetchUserData }) {
  const { suggestions, requestsPending } = useSelector(
    (state) => state.friends
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSuggestions());
    dispatch(getRequests());
    dispatch(getFriends());
  }, [dispatch]);

  const updateStateAfterAction = async (action, updates = []) => {
    await dispatch(action);
    updates.forEach((update) => dispatch(update));
  };

  const handleRequest = (id) => {
    updateStateAfterAction(sentRequest({ friendId: id }), [getSuggestions()]);
  };

  const handleCancelRequest = (id) => {
    updateStateAfterAction(cancelRequest({ friendId: id }), [
      getSuggestions(),
      getRequests(),
    ]);
  };

  const handleAcceptRequest = (id) => {
    updateStateAfterAction(acceptRequest({ friendId: id }), [
      getSuggestions(),
      getFriends(),
      getRequests(),
    ]);
  };
  return (
    <>
      <CssBaseline />
      <Container>
        <Paper
          elevation={5}
          sx={{
            height: "100vh",
            marginY: "10px",
            paddingY: "10px",
            borderRadius: "25px",
            paddingX: "15px",
            display: "flex",
            flexDirection: "column",
            rowGap: "10px",
          }}
        >
          <Typography variant="h6">Friend requests</Typography>
          <Box
            sx={{
              overflowY: "scroll",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              scrollbarWidth: "none",
              maxHeight: "50vh",
              minHeight: "30vh",
            }}
          >
            {requestsPending?.length > 0 ? (
              requestsPending.map((people) => (
                <Box
                  key={people.id}
                  display={"flex"}
                  alignItems={"center"}
                  gap={2}
                  position="relative"
                  onMouseOver={() => {
                    fetchUserData(people.id);
                  }}
                  sx={{
                    cursor: "pointer",
                    [`&:hover .requests-${people.id}`]: {
                      visibility: "visible",
                    },
                  }}
                >
                  <Avatar src={people?.profilePicture}>
                    {people.firstName[0]}
                  </Avatar>
                  {people.firstName} {people.lastName}
                  <ButtonGroup sx={{ marginLeft: "auto" }}>
                    <Button
                      size="small"
                      onClick={() => handleCancelRequest(people.id)}
                    >
                      <Close />
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleAcceptRequest(people.id)}
                    >
                      <Done />
                    </Button>
                  </ButtonGroup>
                  <HoverComponent component={"requests"} id={people.id} />
                </Box>
              ))
            ) : (
              <Typography variant="body2">
                No pending friend requests
              </Typography>
            )}
          </Box>
          <Divider variant="fullWidth"></Divider>

          <Typography variant="h6">Suggestions</Typography>

          {suggestions && suggestions?.length === 0 ? (
            <Typography variant="body2">No suggestions available.</Typography>
          ) : (
            <Box
              sx={{
                overflowY: "scroll",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                scrollbarWidth: "none",
              }}
            >
              {suggestions.map((people) => (
                <Box
                  key={people.id}
                  display={"flex"}
                  alignItems={"center"}
                  gap={2}
                  position="relative"
                  onMouseOver={() => {
                    fetchUserData(people.id);
                  }}
                  sx={{
                    cursor: "pointer",
                    [`&:hover .suggestions-${people.id}`]: {
                      visibility: "visible",
                    },
                  }}
                >
                  <Avatar src={people?.profilePicture}>
                    {people.firstName[0]}
                  </Avatar>
                  {people.firstName} {people.lastName}
                  <Button
                    disabled={people.hasRequested}
                    onClick={() => handleRequest(people.id)}
                    sx={{ marginLeft: "auto" }}
                  >
                    {people.hasRequested ? "Request sent" : "Connect"}
                  </Button>
                  <HoverComponent component={"suggestions"} id={people.id} />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default Suggestions;

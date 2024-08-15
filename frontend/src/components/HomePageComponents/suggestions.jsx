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

function Suggestions() {
  const { suggestions, requestsPending } = useSelector(
    (state) => state.friends
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSuggestions());
    dispatch(getRequests());
    dispatch(getFriends());
  }, [dispatch]);

  const handleRequest = async (id) => {
    await dispatch(sentRequest({ friendId: id }));
    dispatch(getSuggestions());
  };

  const handleCancelRequest = async (id) => {
    dispatch(cancelRequest({ friendId: id }));
    dispatch(getSuggestions());
    dispatch(getRequests());
  };

  const handleAcceptRequest = async (id) => {
    dispatch(acceptRequest({ friendId: id }));
    dispatch(getSuggestions());
    dispatch(getRequests());
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
            }}
          >
            {requestsPending?.length > 0 ? (
              requestsPending.map((people) => (
                <Box
                  key={people.id}
                  display={"flex"}
                  alignItems={"center"}
                  gap={2}
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

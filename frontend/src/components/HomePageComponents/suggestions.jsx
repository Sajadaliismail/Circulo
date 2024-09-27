import { Box, Button, Divider, Typography } from "@mui/material";
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
import { Close, Done, PersonAdd } from "@mui/icons-material";
import HoverComponent from "../CommonComponents/HoverComponen";
import { AnimatedTooltip } from "../CommonComponents/AnimatedHoverComponent";
import { useNavigate } from "react-router-dom";
import chatSocket from "../../features/utilities/Socket-io";

function Suggestions({ fetchUserData }) {
  const { suggestions, requestsPending } = useSelector(
    (state) => state.friends
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getSuggestions());
    dispatch(getRequests());
    dispatch(getFriends());
  }, [dispatch]);

  const updateStateAfterAction = async (action, updates = [], activity, id) => {
    await dispatch(action);
    updates.forEach((update) => dispatch(update));
    chatSocket.emit("handleRelation", { user: id, change: activity });
  };

  const handleRequest = (id) => {
    updateStateAfterAction(
      sentRequest({ friendId: id }),
      [getSuggestions()],
      "request_sent",
      id
    );
  };

  const handleCancelRequest = (id) => {
    updateStateAfterAction(
      cancelRequest({ friendId: id }),
      [getSuggestions(), getRequests()],
      "request_canceled",
      id
    );
  };

  const handleAcceptRequest = (id) => {
    updateStateAfterAction(
      acceptRequest({ friendId: id }),
      [getSuggestions(), getFriends(), getRequests()],
      "request_accepted",
      id
    );
  };
  return (
    <>
      <Box
        className="shadow-2xl h-lvh mx-4 my-2  bg-gray-100 rounded-lg dark:bg-slate-700"
        elevation={5}
        // sx={{ borderRadius: "10px", py: 2,  }}
        sx={{
          height: "100vh",
          marginY: "10px",
          paddingY: "10px",
          borderRadius: "10px",
          paddingX: "10px",
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
            scrollbarWidth: "none",
            maxHeight: "50vh",
            minHeight: "30vh",
          }}
        >
          {requestsPending?.length > 0 ? (
            requestsPending.map((people) => (
              <Box
                key={people.id}
                className="flex flex-row flex-nowrap"
                alignItems={"center"}
                gap={2}
                position="relative"
                onMouseOver={() => {
                  fetchUserData(people.id);
                }}
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
                  mx: 2,
                }}
              >
                <AnimatedTooltip
                  key={`requests-${people.id}`}
                  userId={people.id}
                />
                {people.firstName} {people.lastName}
                <Box className="flex flex-row" sx={{ marginLeft: "auto" }}>
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    sx={{ borderRadius: 50, mr: 1 }}
                    onClick={() => handleCancelRequest(people.id)}
                  >
                    <Close />
                  </Button>
                  <Button
                    size="small"
                    color="success"
                    variant="contained"
                    sx={{ borderRadius: 50 }}
                    onClick={() => handleAcceptRequest(people.id)}
                  >
                    <Done />
                  </Button>
                </Box>
                <HoverComponent component={"requests"} id={people.id} />
              </Box>
            ))
          ) : (
            <Typography variant="body2">No pending friend requests</Typography>
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
              scrollbarWidth: "none",
            }}
          >
            {suggestions?.map((people) => (
              <Box
                className="mx-2"
                key={`suggestion-${people.id}`}
                display={"flex"}
                alignItems={"center"}
                gap={2}
                position="relative"
                onMouseOver={() => {
                  fetchUserData(people.id);
                }}
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
              >
                <AnimatedTooltip
                  key={`suggstions-${people.id}`}
                  userId={people.id}
                />
                <Typography
                  onClick={() => navigate(`profile/${people.id}`)}
                  sx={{
                    textOverflow: "hidden",
                    textWrap: "nowrap",
                    overflow: "hidden",
                    minWidth: "40%",
                    ml: 1,
                  }}
                >
                  {people.firstName} {people.lastName}
                </Typography>

                {people.hasRequested ? (
                  <>
                    {" "}
                    <div className="btn-group flex">
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: 50, mr: 1 }}
                        onClick={() => handleCancelRequest(people.id)}
                      >
                        <Close />
                      </Button>
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        disabled
                        sx={{ borderRadius: 50 }}
                        onClick={() => handleAcceptRequest(people.id)}
                      >
                        <PersonAdd />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      sx={{ borderRadius: 50 }}
                      onClick={() => handleRequest(people.id)}
                    >
                      <PersonAdd />
                    </Button>
                  </>
                )}
                <HoverComponent component={"suggestions"} id={people.id} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}

export default Suggestions;

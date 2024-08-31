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
import { Close, Done, PersonAdd } from "@mui/icons-material";
import HoverComponent from "../CommonComponents/HoverComponen";
import { AnimatedTooltip } from "../CommonComponents/AnimatedHoverComponent";
import { useNavigate } from "react-router-dom";

function Suggestions({ fetchUserData }) {
  const { suggestions, requestsPending, friends } = useSelector(
    (state) => state.friends
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    console.log(id);

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
          height: "100%",
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
                <AnimatedTooltip userId={people.id} />
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
                <AnimatedTooltip userId={people.id} />
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
                <Button
                  disabled={people.hasRequested}
                  onClick={() => handleRequest(people.id)}
                  sx={{ marginLeft: "auto" }}
                >
                  {people.hasRequested ? (
                    <>
                      {" "}
                      <div className="btn-group flex">
                        <button
                          onClick={() => handleCancelRequest()}
                          className="relative inline-flex h-9 w-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 "
                        >
                          {/* <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" /> */}
                          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                            <Close />
                          </span>
                        </button>
                        <button
                          disabled={true}
                          className="relative inline-flex h-9 w-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 "
                        >
                          {/* <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" /> */}
                          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-green-700 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                            Sent
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        // onClick={() => handleAddFriend()}
                        className="relative inline-flex h-9 w-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-5 focus:ring-offset-slate-50 "
                      >
                        {/* <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" /> */}
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-green-700  px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                          <PersonAdd></PersonAdd>
                        </span>
                      </button>
                    </>
                  )}
                </Button>
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

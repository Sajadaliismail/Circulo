import { useDispatch, useSelector } from "react-redux";
import UserPosts from "../components/UserPageComponents/userPosts";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  acceptRequest,
  addFriend,
  cancelRequest,
  fetchUserDetails,
  removeFriend,
} from "../features/friends/friendsAsyncThunks";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import Header from "../components/CommonComponents/header";
import { SyncLoader } from "react-spinners";

import { Close, Done, ExpandMore, Lock } from "@mui/icons-material";
import useFetchPosts from "../hooks/fetchPostHook";
import { fetchPosts } from "../features/posts/postsAsyncThunks";
import { AnimatedTooltip } from "../components/CommonComponents/AnimatedHoverComponent";
import { setFriend, setRoomId } from "../features/chats/chatsSlice";

const UserPage = () => {
  const { userData } = useSelector((state) => state.friends);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  // const { enqueueSnackbar } = useSnackbar();
  const {
    postsId,
    count,
    relation,
    friendsCount,
    loading,
    setRelation,
    friendsId,
  } = useFetchPosts(userId);

  // const handleClose = () => setOpen(false);
  // const handleRemoveFriend = async () => {
  //   await dispatch(removeFriend({ friendId: userId }));
  //   fetchPosts(userId);
  //   setRelation("NOT_FRIENDS");
  // };

  const handleDialogClose = () => setDialogOpen(false);

  const handleDialogConfirm = async () => {
    switch (dialogAction) {
      case "addFriend":
        await dispatch(addFriend({ friendId: userId }));
        setRelation("REQUESTSENT");
        break;
      case "removeFriend":
        await dispatch(removeFriend({ friendId: userId }));
        fetchPosts(userId);
        setRelation("NOT_FRIENDS");
        break;
      case "cancelRequest":
        await dispatch(cancelRequest({ friendId: userId }));
        setRelation("NOT_FRIENDS");
        break;
      case "acceptRequest":
        await dispatch(acceptRequest({ friendId: userId }));
        fetchPosts(userId);
        setRelation("FRIENDS");
        break;
    }
    handleDialogClose();
  };

  const openDialog = (action) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  // const handleCancelRequest = async () => {
  //   await dispatch(cancelRequest({ friendId: userId }));
  //   setRelation("NOT_FRIENDS");
  // };

  // const handleAddFriend = async () => {
  // setOpen(true);
  // await dispatch(addFriend({ friendId: userId }));
  // setRelation("REQUESTSENT");
  // };

  // const handleAcceptRequest = async () => {
  //   // setOpen(true);
  //   await dispatch(acceptRequest({ friendId: userId }));
  //   fetchPosts(userId);
  //   setRelation("FRIENDS");
  // };

  const handleChat = (id, roomId) => {
    dispatch(setFriend(id));
    dispatch(setRoomId(roomId));
    navigate("/chats");
  };
  const fetchUserData = useCallback(
    (id) => {
      if (!userData[id]) {
        dispatch(fetchUserDetails(id));
      }
    },
    [userData, dispatch]
  );
  useEffect(() => {
    fetchUserData(userId);
  }, []);

  useEffect(() => {
    friendsId?.forEach(async (id) => {
      await fetchUserData(id);
    });
  }, [friendsId]);

  const DialogueComponent = () => {
    const titles = {
      addFriend: "Add Friend",
      removeFriend: "Remove Friend",
      cancelRequest: "Cancel Friend Request",
      acceptRequest: "Accept Friend Request",
    };

    const messages = {
      addFriend: "Are you sure you want to send a friend request?",
      removeFriend: "Are you sure you want to remove this friend?",
      cancelRequest: "Are you sure you want to cancel the friend request?",
      acceptRequest: "Are you sure you want to accept the friend request?",
    };

    return (
      <Dialog
        open={dialogOpen}
        PaperProps={{
          sx: { backgroundColor: "#c4c9d4" },
        }}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {titles[dialogAction]}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {messages[dialogAction]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <Header> </Header>
      <DialogueComponent />
      {loading ? (
        <Box
          sx={{
            padding: "15px",
            width: "100%",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            height: "90vh",
          }}
        >
          <SyncLoader size={15} color="#1976d2" />
        </Box>
      ) : (
        <Box className="flex flex-col w-full overflow-hidden h-lvh md:flex-row md:justify-between my-2 mx-1">
          <Box className="flex flex-col lg:max-w-56 md:min-w-96  bg-gray-200 shadow-2xl rounded-lg dark:bg-slate-700 ">
            <Box className="flex flex-col items-center py-2 gap-1">
              <Avatar
                sx={{ width: 100, height: 100, fontSize: 50 }}
                src={userData[userId]?.profilePicture}
              >
                {userData[userId]?.firstName?.[0]}
              </Avatar>
              <Typography variant="h6" className="mt-2">
                {`${userData[userId]?.firstName} ${userData[userId]?.lastName}`}
              </Typography>
              <Typography variant="body2" className="mt-1">
                {`${userData[userId]?.city}, ${userData[userId]?.state}, ${userData[userId]?.country}`}
              </Typography>
              <Box className="flex flex-col md:flex-row space-y-2 md:space-x-4 mt-2">
                <Typography variant="body2">
                  <span>{`Friends: ${friendsCount} `}</span>
                  {`| Posts: ${count}`}
                </Typography>
              </Box>

              {relation === "NOT_FRIENDS" && (
                <button
                  onClick={() => openDialog("addFriend")}
                  className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-green-900  px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Add Friend
                  </span>
                </button>
              )}
              {relation === "FRIENDS" && (
                <div className="btn-group ">
                  <button
                    onClick={() => {
                      handleChat(userId, userData[userId].roomId);
                    }}
                    className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-red-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Message
                    </span>
                  </button>
                  <button
                    onClick={() => openDialog("removeFriend")}
                    className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-red-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Remove Friend
                    </span>
                  </button>
                </div>
              )}
              {relation === "SELF" && (
                <button className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-cyan-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Edit profile
                  </span>
                </button>
              )}
              {relation === "REQUESTSENT" && (
                <div className="btn-group ">
                  <button
                    onClick={() => openDialog("cancelRequest")}
                    className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-red-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Cancel Request
                    </span>
                  </button>
                  <button
                    disabled={true}
                    className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-500 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Request sent
                    </span>
                  </button>
                </div>
              )}
              {relation === "REQUESTRECEIVED" && (
                <div className="btn-group">
                  <button
                    onClick={() => openDialog("cancelRequest")}
                    className="relative inline-flex h-9 w-32 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-red-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Reject <Close />
                    </span>
                  </button>
                  <button
                    onClick={() => openDialog("acceptRequest")}
                    className="relative inline-flex h-9 w-32 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-green-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Accept <Done />
                    </span>
                  </button>
                </div>
              )}
            </Box>
            <Divider />
            <Box>
              <Accordion variant="outlined" sx={{ backgroundColor: "inherit" }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  className="font-bold text-lg"
                >
                  Friends
                </AccordionSummary>
                {relation && (relation === "FRIENDS" || relation === "SELF") ? (
                  <AccordionDetails
                    sx={{
                      overflow: "scroll",
                      height: "50vh ",
                      scrollbarWidth: "none",
                    }}
                  >
                    {friendsId?.map(
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

                              transition:
                                "transform 0.3s ease, box-shadow 0.3s ease",
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
                            <AnimatedTooltip
                              key={`friends-${friend}`}
                              userId={friend}
                            />
                            {userData[friend]?.firstName}{" "}
                            {userData[friend]?.lastName}
                          </Box>
                        )
                    )}
                  </AccordionDetails>
                ) : (
                  <AccordionDetails>
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                      <Tooltip title="This section is for friends only" arrow>
                        <p className="text-xl font-semibold">
                          Only friends <Lock />
                        </p>
                      </Tooltip>
                    </div>
                  </AccordionDetails>
                )}
              </Accordion>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
              scrollbarWidth: "none",
              height: "100vh",
              width: "100%",
            }}
            className="dark:bg-gray-900 dark:text-white bg-gray-100 text-black"
          >
            <Typography
              className="text-black dark:text-white "
              variant="h4"
              sx={{
                fontWeight: 600,
                marginY: 2,
                textAlign: "center",
              }}
            >
              Posts
            </Typography>

            {relation && (relation === "FRIENDS" || relation === "SELF") ? (
              <UserPosts
                userId={userId}
                fetchUserData={fetchUserData}
                postsId={postsId}
                count={count}
              />
            ) : (
              <Typography
                variant="h6"
                align="center"
                sx={{
                  color: "#757575",
                  padding: "30px",
                  borderRadius: "8px",
                  width: "inherit",
                  height: "inherit",
                }}
              >
                <Lock className="mr-1" />
                {`Only friends can see the posts.`}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default UserPage;

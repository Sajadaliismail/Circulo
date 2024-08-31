import { useDispatch, useSelector } from "react-redux";
import UserPosts from "../components/UserPageComponents/userPosts";
import { Avatar, Box, Divider, Typography } from "@mui/material";
import {
  acceptRequest,
  addFriend,
  cancelRequest,
  fetchUserDetails,
  removeFriend,
} from "../features/friends/friendsAsyncThunks";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import Header from "../components/CommonComponents/header";
import { SyncLoader } from "react-spinners";

import { Close, Done, Lock } from "@mui/icons-material";
import useFetchPosts from "../hooks/fetchPostHook";
import { fetchPosts } from "../features/posts/postsAsyncThunks";

const UserPage = () => {
  const { user } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.friends);

  const dispatch = useDispatch();
  const { userId } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { postsId, count, relation, friendsCount, loading, setRelation } =
    useFetchPosts(userId);

  const fetchFriendsList = async (id) => {
    if (relation != "FRIENDS" && relation != "SELF") {
      enqueueSnackbar("Only friends can view this", { variant: "error" });
    }
  };

  const handleRemoveFriend = async () => {
    await dispatch(removeFriend({ friendId: userId }));
    fetchPosts(userId);
    setRelation("NOT_FRIENDS");
  };

  const handleCancelRequest = async () => {
    await dispatch(cancelRequest({ friendId: userId }));
    setRelation("NOT_FRIENDS");
  };

  const handleAddFriend = async () => {
    await dispatch(addFriend({ friendId: userId }));
    setRelation("REQUESTSENT");
  };

  const handleAcceptRequest = async () => {
    await dispatch(acceptRequest({ friendId: userId }));
    fetchPosts(userId);
    setRelation("FRIENDS");
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

  return (
    <>
      <Header> </Header>
      {loading ? (
        <Box
          sx={{
            padding: "15px",
            width: "100%",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SyncLoader size={8} color="#1976d2" />
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
                  <span onClick={() => fetchFriendsList(userId)}>
                    {`Friends: ${friendsCount} `}
                  </span>
                  {`| Posts: ${count}`}
                </Typography>
              </Box>

              {relation && relation === "NOT_FRIENDS" && (
                <button
                  onClick={() => handleAddFriend()}
                  className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-green-900  px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Add Friend
                  </span>
                </button>
              )}
              {relation && relation === "FRIENDS" && (
                <button
                  onClick={handleRemoveFriend}
                  className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-red-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Remove Friend
                  </span>
                </button>
              )}
              {relation && relation === "SELF" && (
                <button className="relative inline-flex h-9 w-36 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-cyan-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Edit profile
                  </span>
                </button>
              )}
              {relation && relation === "REQUESTSENT" && (
                <div className="btn-group ">
                  <button
                    onClick={() => handleCancelRequest()}
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
              {relation && relation === "REQUESTRECEIVED" && (
                <div className="btn-group">
                  <button
                    onClick={() => handleCancelRequest()}
                    className="relative inline-flex h-9 w-32 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-red-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Reject <Close />
                    </span>
                  </button>
                  <button
                    // disabled={true}
                    onClick={() => handleAcceptRequest()}
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
              <Typography>About</Typography>
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
                  borderRadius: 5,
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

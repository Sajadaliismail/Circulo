import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../features/friends/friendsAsyncThunks";
import "cropperjs/dist/cropper.css";
import { fetchChatFriends } from "../features/chats/chatsAsycnThunks";
import { lazy } from "react";
import { Suspense } from "react";
import Header from "../components/CommonComponents/header";
import NewPost from "../components/HomePageComponents/newPost";
import { DotLoader } from "react-spinners";
const Profile = lazy(() => import("../components/HomePageComponents/profile"));
const Suggestions = lazy(() =>
  import("../components/HomePageComponents/suggestions")
);
const Posts = lazy(() => import("../components/HomePageComponents/posts"));
const ChatApp = lazy(() => import("../components/chatbox/chatbox"));

export default function Homepage({ msg, setmsg }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.friends);
  const { chatFriends } = useSelector((state) => state.chats);

  const fetchUserData = (id) => {
    if (!userData[id]) {
      dispatch(fetchUserDetails(id));
    }
  };

  useEffect(() => {
    const fetchChat = async () => {
      await dispatch(fetchChatFriends());
    };
    fetchChat().then(() => {
      chatFriends?.map((friend) => fetchUserData(friend._id));
    });
  }, []);

  if (!user?.firstName) return null;

  const Loader = () => (
    <div className="flex align-middle justify-center items-center my-auto h-[80vh]">
      <DotLoader color="#3f73e3" size={90} />
    </div>
  );

  return (
    <>
      <Header fetchUserData={fetchUserData} />
      <Suspense fallback={<Loader />}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container rowGap={10} spacing={0}>
            <Grid
              item
              xs={0}
              md={3}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Profile fetchUserData={fetchUserData} />
            </Grid>
            <Grid item xs={12} md={6}>
              <NewPost />
              <Posts fetchUserData={fetchUserData} />
            </Grid>
            <Grid
              item
              xs={0}
              md={3}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Suggestions fetchUserData={fetchUserData} />
            </Grid>
            <ChatApp fetchUserData={fetchUserData} msg={msg} setmsg={setmsg} />
          </Grid>
        </Box>
      </Suspense>
    </>
  );
}

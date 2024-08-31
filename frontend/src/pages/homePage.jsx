import React, { useEffect, useCallback, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../features/user/userAsyncThunks";
import { fetchUserDetails } from "../features/friends/friendsAsyncThunks";
import Header from "../components/CommonComponents/header";
import Profile from "../components/HomePageComponents/profile";
import Suggestions from "../components/HomePageComponents/suggestions";
import NewPost from "../components/HomePageComponents/newPost";
import Posts from "../components/HomePageComponents/posts";
import ChatApp from "../components/chatbox/chatbox";
// import { Sidebar } from "../components/CommonComponents/SideBar";
import "cropperjs/dist/cropper.css";

export default function Homepage({ msg, setmsg }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.friends);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const fetchUserData = useCallback(
    (id) => {
      if (!userData[id]) {
        dispatch(fetchUserDetails(id));
      }
    },
    [userData, dispatch]
  );

  if (!user?.firstName) return null;

  return (
    <>
      <Header setmsg={setmsg} />
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
    </>
  );
}

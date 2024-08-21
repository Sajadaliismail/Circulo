import Header from "../components/CommonComponents/header";
import Profile from "../components/HomePageComponents/profile";
import Suggestions from "../components/HomePageComponents/suggestions";
import React, { useEffect, useLayoutEffect } from "react";
import { styled, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import NewPost from "../components/HomePageComponents/newPost";
import Posts from "../components/HomePageComponents/posts";
import { createTheme } from "@mui/material/styles";
import ChatInterface from "../components/chats";
import ChatApp from "../components/chatbox/chatbox";
import OnlinePeopleAccordion from "../components/chatbox/online";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../features/user/userAsyncThunks";
import { fetchUserDetails } from "../features/friends/friendsAsyncThunks";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#2196f3",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default function Homepage() {
  const { user } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.friends);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  const [currentTheme, setCurrentTheme] = React.useState("light");

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const fetchUserData = (id) => {
    if (!userData[id]) {
      dispatch(fetchUserDetails(id));
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        {user?.firstName && (
          <>
            <Header toggleTheme={toggleTheme} />
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
                <ChatApp fetchUserData={fetchUserData} />
              </Grid>
            </Box>
          </>
        )}
      </ThemeProvider>
    </>
  );
}

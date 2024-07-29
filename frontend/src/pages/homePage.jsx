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
import ChatAPp from "../components/chatbox/chatbox";
import OnlinePeopleAccordion from "../components/chatbox/online";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../features/user/userAsyncThunks";

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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  const [currentTheme, setCurrentTheme] = React.useState("light");

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <>
      <ThemeProvider theme={theme}>
        {user?.firstName && (
          <>
            <Header toggleTheme={toggleTheme} />
            <Box sx={{ flexGrow: 1 }}>
              <Grid container rowGap={10} col spacing={0}>
                <Grid xs={0} md={3}>
                  <Profile />
                </Grid>
                <Grid xs={12} md={6}>
                  <NewPost />
                  <Posts />
                </Grid>
                <Grid xs={0} md={3}>
                  <Suggestions />
                </Grid>
              </Grid>
            </Box>
            <ChatAPp />
          </>
        )}
      </ThemeProvider>
    </>
  );
}

import Header from "../components/CommonComponents/header";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme } from "@mui/material/styles";
import { Avatar, Divider, List, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MessageArea from "../components/ChatPageComponents/messageArea";
import { fetchchats } from "../features/chats/chatsAsycnThunks";
import {
  setChats,
  setReadMessages,
  setUnreadMessages,
} from "../features/chats/chatsSlice";
import { getFriends } from "../features/friends/friendsAsyncThunks";
import UserList from "../components/ChatPageComponents/UserList";
import chatSocket from "../features/utilities/Socket-io";

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

export default function ChatPage() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const { chats, roomId } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.user);
  const { friends } = useSelector((state) => state.friends);

  const [friend, setFriend] = useState({});
  const friendRef = useRef(friend);
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    dispatch(getFriends()).then((action) => {
      if (action.payload) {
        const senderIds = action.payload.friends.map((friend) => friend.id);
        dispatch(setUnreadMessages({ senderIds }));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const id = user._id;
    chatSocket.emit("authenticate", id);

    chatSocket.on("newMessageNotification", (data) => {
      const { senderId } = data;
      dispatch(setUnreadMessages({ senderId }));
    });

    const receiveMessageHandler = ({ messages, roomId, hasOpened }) => {
      dispatch(setChats({ messages, roomId, hasOpened }));
    };

    if (friendRef.current.id) {
      chatSocket.on("receiveMessage", receiveMessageHandler);
    }

    return () => {
      chatSocket.off("newMessageNotification");
      chatSocket.off("receiveMessage", receiveMessageHandler);
    };
  }, [user._id, dispatch]);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  const handleSubmit = (id, e) => {
    e.preventDefault();
    chatSocket.emit("message", { userId: id, message });
    setMessage("");
  };

  const handleChat = async (friend, e) => {
    e.preventDefault();
    dispatch(fetchchats(friend.id));
    dispatch(setReadMessages(friend.id));
    setFriend(friend);
    friendRef.current = friend;
    setMessage("");
    chatSocket.emit("join_room", { userId: friend.id });
  };

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <Header toggleTheme={toggleTheme} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Inbox</Typography>
        </Grid>
        <Grid item xs={12} container component={Paper}>
          <Grid
            item
            xs={3}
            sx={{
              borderRight: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              padding: "0",
            }}
          >
            <Divider />
            <Grid item xs={12} style={{ padding: "10px" }}>
              <TextField
                id="outlined-basic-email"
                label="Search"
                variant="outlined"
                fullWidth
              />
              <List>
                {friends?.length &&
                  friends.map((friend) => (
                    <UserList
                      key={friend.id}
                      friend={friend}
                      handleChat={handleChat}
                    />
                  ))}
              </List>
            </Grid>
            <Divider />
          </Grid>
          <Grid item xs={9} sx={{ display: "flex", flexDirection: "column" }}>
            <MessageArea
              handleSubmit={handleSubmit}
              message={message}
              setMessage={setMessage}
              friend={friend}
              messages={chats[roomId]}
            />
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

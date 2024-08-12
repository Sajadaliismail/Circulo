import Header from "../components/CommonComponents/header";
import React, { useEffect, useState, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Divider, List, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MessageArea from "../components/ChatPageComponents/messageArea";
import {
  fetchAllChats,
  fetchChatFriends,
  fetchchats,
} from "../features/chats/chatsAsycnThunks";
import {
  setChats,
  setEmoji,
  setReadMessages,
  setReceivedChats,
  setSentMessages,
  setUnreadMessages,
} from "../features/chats/chatsSlice";
import { getFriends } from "../features/friends/friendsAsyncThunks";
import UserList from "../components/ChatPageComponents/UserList";
import chatSocket from "../features/utilities/Socket-io";
import { darkTheme, lightTheme } from "./Style";
import { UploadImage } from "../Utilities/UploadImage";

export default function ChatPage() {
  const dispatch = useDispatch();
  const { chats, roomId } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.user);
  const { chatFriends } = useSelector((state) => state.chats);

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
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

  const handleSubmitImage = async () => {
    const id = friend._id;
    await UploadImage(
      id,
      setImageUrl,
      imageUrl,
      dispatch,
      setSentMessages,
      chatSocket,
      image
    );
  };
  useEffect(() => {
    dispatch(fetchAllChats());
    dispatch(fetchChatFriends());
  }, []);

  useEffect(() => {
    const id = user._id;
    chatSocket.emit("authenticate", id);

    chatSocket.on(
      "newMessageNotification",
      ({ senderId, roomId, hasOpened, message, timestamp, type, _id }) => {
        dispatch(
          setChats({
            senderId,
            roomId,
            hasOpened,
            message,
            timestamp,
            type,
            _id,
          })
        );
        // dispatch(setReceivedChats(data));
        // const { senderId } = data;
        dispatch(setUnreadMessages({ senderId }));
      }
    );

    chatSocket.on("emoji_recieved", ({ id, emoji }) => {
      dispatch(setEmoji({ id, emoji }));
    });
    const receiveMessageHandler = ({
      senderId,
      roomId,
      hasOpened,
      message,
      timestamp,
      type,
      _id,
    }) => {
      // console.log(senderId, roomId, hasOpened, message, timestamp, type, _id);
      dispatch(setReadMessages(senderId));

      // dispatch(
      //   setChats({ senderId, roomId, hasOpened, message, timestamp, type })
      // );
    };

    if (friendRef.current._id) {
      chatSocket.on("emoji_recieved", (arg) => {
        console.log(arg);
      });
    }
    chatSocket.on("receiveMessage", receiveMessageHandler);

    return () => {
      chatSocket.off("newMessageNotification");
      chatSocket.off("emoji_recieved");
      chatSocket.off("receiveMessage", receiveMessageHandler);
    };
  }, [user._id, dispatch]);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  const handleSubmit = (id) => {
    if (message.trim()) {
      chatSocket.emit("message", { userId: id, message, type: "text" });
      dispatch(
        setSentMessages({ message, timestamp: Date.now(), type: "text" })
      );
      setMessage("");
    }
  };

  const handleChat = async (friend, e) => {
    const id = friend._id;

    dispatch(fetchchats(id));
    dispatch(setReadMessages(id));
    setFriend(friend);
    friendRef.current = friend;
    setMessage("");
    chatSocket.emit("join_room", { userId: id });
  };

  const handleEmoji = (id, emoji, friendId) => {
    chatSocket.emit("emoji_send", { id: id, emoji: emoji, friendId: friendId });

    dispatch(setEmoji({ id, emoji }));
  };

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <Header toggleTheme={toggleTheme} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Inbox</Typography>
          {/* <VideoCall></VideoCall> */}
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
                {chatFriends?.length &&
                  chatFriends.map((friend) => (
                    <UserList
                      key={friend._id}
                      friend={friend.userDetails}
                      handleChat={handleChat}
                    />
                  ))}
              </List>
            </Grid>
            <Divider />
          </Grid>
          <Grid item xs={9} sx={{ display: "flex", flexDirection: "column" }}>
            {friend?._id && (
              <MessageArea
                setImage={setImage}
                handleSubmitImage={handleSubmitImage}
                handleEmoji={handleEmoji}
                handleSubmit={handleSubmit}
                message={message}
                setMessage={setMessage}
                friend={friend}
                messages={chats[roomId]}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import {
  Paper,
  Grid,
  Divider,
  TextField,
  Typography,
  List,
} from "@mui/material";

import Header from "../components/CommonComponents/header";
import MessageArea from "../components/ChatPageComponents/messageArea";
import UserList from "../components/ChatPageComponents/UserList";

import { fetchChatFriends } from "../features/chats/chatsAsycnThunks";
import {
  fetchUserDetails,
  getFriends,
} from "../features/friends/friendsAsyncThunks";
import { setUnreadMessages } from "../features/chats/chatsSlice";

import chatSocket from "../features/utilities/Socket-io";
import useChatSocket from "../hooks/chatSocketHook";
import { UploadImage } from "../Utilities/UploadImage";
import { darkTheme, lightTheme } from "./Style";
import { handleNewMessage } from "./Utilitis";

export default function ChatPage() {
  const dispatch = useDispatch();
  const { chatFriends } = useSelector((state) => state.chats);
  const { friends, userData } = useSelector((state) => state.friends);
  const { user } = useSelector((state) => state.user);

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [friend, setFriend] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [msg, setmsg] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [friendsData, setFriendsData] = useState([]);

  const toggleTheme = () =>
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");

  const theme = currentTheme === "light" ? lightTheme : darkTheme;
  useEffect(() => {
    const fetchData = async () => {
      const friendsId = friends.map((friend) => friend.id);
      const roomIds = friendsId.map((id) => [user._id, id].sort().join(""));

      const userPromises = friendsId.map((id, index) => {
        const roomId = roomIds[index];
        return userData[id]
          ? { ...userData[id], roomId }
          : dispatch(fetchUserDetails(id)).then(() => ({
              ...userData[id],
              roomId,
            }));
      });

      const resolvedUserData = await Promise.all(userPromises);
      setFriendsData(resolvedUserData);
    };

    fetchData();
  }, [friends, userData, dispatch]);

  useEffect(() => {
    dispatch(getFriends()).then((action) => {
      if (action.payload) {
        const senderIds = action.payload.friends.map((friend) => friend.id);
        dispatch(setUnreadMessages({ senderIds }));
      }
    });
  }, [dispatch]);

  const handleSubmitImage = async () => {
    await UploadImage(friend, setImageUrl, chatSocket, image);
  };

  useEffect(() => {
    dispatch(fetchChatFriends());
  }, [dispatch]);

  const chatSocketHook = useChatSocket();

  useEffect(() => {
    if (!chatSocketHook) return;

    const handleEmojiReceived = ({ id, emoji, roomId }) => {
      setmsg((prevChats) => ({
        ...prevChats,
        [roomId]: {
          ...prevChats[roomId],
          messages: prevChats[roomId].messages.map((mess) =>
            mess._id === id ? { ...mess, emoji } : mess
          ),
        },
      }));
    };

    chatSocketHook.on("newMessageNotification", (arg) =>
      handleNewMessage(arg, setmsg)
    );
    chatSocketHook.on("emoji_recieved", handleEmojiReceived);
    chatSocketHook.on("sentMessageNotification", (arg) => {
      handleNewMessage(arg, setmsg);
    });

    return () => {
      chatSocketHook.off("newMessageNotification", handleNewMessage);
      chatSocketHook.off("sentMessageNotification", handleNewMessage);
      chatSocketHook.off("emoji_recieved", handleEmojiReceived);
    };
  }, [chatSocketHook]);

  const handleChat = (friend, roomId) => {
    setRoomId(roomId);
    setFriend(friend);
    setMessage("");
    chatSocket.emit("join_room", { userId: friend });
  };

  const handleEmoji = (id, emoji, friendId, room) => {
    chatSocket.emit("emoji_send", { id, emoji, friendId, roomId: room });
    setmsg((prevChats) => ({
      ...prevChats,
      [room]: {
        ...prevChats[room],
        messages: prevChats[room].messages.map((mess) =>
          mess._id === id ? { ...mess, emoji } : mess
        ),
      },
    }));
  };

  useEffect(() => {
    if (!friend) return;

    const fetchChatmsg = async (id) => {
      const response = await fetch(
        `http://localhost:3008/chats/fetchchat?id=${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const { chat } = await response.json();
        setmsg((prevChats) => ({
          ...prevChats,
          [chat.roomId]: {
            messages: chat.messages,
            user1: chat.user1,
            user2: chat.user2,
            roomId: chat.roomId,
            unreadCount: chat.unreadCount,
          },
        }));
      }
    };

    fetchChatmsg(friend);
  }, [friend]);

  useEffect(() => {
    setSearchResult(
      searchQuery.trim()
        ? friendsData.filter(
            (friend) =>
              new RegExp(searchQuery, "i").test(friend.firstName) ||
              new RegExp(searchQuery, "i").test(friend.lastName)
          )
        : []
    );
  }, [searchQuery, friendsData]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleSubmit = (id, room) => {
    if (message.trim()) {
      console.log(message, id, room);

      chatSocket.emit("message", {
        userId: id,
        message,
        type: "text",
        roomId: room,
      });
      setMessage("");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header toggleTheme={toggleTheme} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
              height: "88vh",
            }}
          >
            <Divider />
            <Grid item xs={12} style={{ padding: "10px" }}>
              <Typography
                variant="h5"
                sx={{
                  marginX: "auto",
                  mb: 2,
                  fontWeight: 700,
                  textAlign: "center",
                  padding: "12px 12px",
                  width: "100%",
                  alignItems: "center",
                  borderRadius: "12px",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                  letterSpacing: "0.5px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                Inbox
              </Typography>
              <TextField
                id="search"
                label="Search"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearch}
              />
              <List
                sx={{
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  padding: 2,
                }}
              >
                {searchResult.length ? (
                  searchResult.map((friend) => (
                    <UserList
                      key={friend._id}
                      friend={friend._id}
                      roomId={friend.roomId}
                      handleChat={handleChat}
                    />
                  ))
                ) : chatFriends.length ? (
                  chatFriends.map((friend) => (
                    <UserList
                      key={friend._id}
                      friend={friend.chatFriends}
                      roomId={friend._id}
                      handleChat={handleChat}
                    />
                  ))
                ) : friendsData.length ? (
                  friendsData.map((friend) => (
                    <UserList
                      key={friend._id}
                      friend={friend._id}
                      roomId={friend._id}
                      handleChat={handleChat}
                    />
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      color: "#757575",
                      padding: "20px",
                      fontStyle: "italic",
                      fontSize: "1rem",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    No friends found. Start adding friends to begin chatting!
                  </Typography>
                )}
              </List>
            </Grid>
            <Divider />
          </Grid>
          <Grid
            item
            xs={9}
            sx={{
              display: "flex",
              flexDirection: "column",
              color: "#757575",
            }}
          >
            {friend ? (
              <MessageArea
                setImage={setImage}
                handleSubmitImage={handleSubmitImage}
                handleEmoji={handleEmoji}
                handleSubmit={handleSubmit}
                message={message}
                setMessage={setMessage}
                friend={friend}
                messages={msg[roomId]}
                roomId={roomId}
                theme={theme}
              />
            ) : (
              <Typography
                variant="h6"
                sx={{
                  marginX: "auto",
                  textAlign: "center",
                  padding: "20px",
                  fontStyle: "italic",
                  color: "#9e9e9e",
                }}
              >
                Click on any user to start chatting!
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

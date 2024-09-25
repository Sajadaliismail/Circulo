import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Divider,
  TextField,
  Typography,
  List,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Menu,
  Drawer,
} from "@mui/material";

import Header from "../components/CommonComponents/header";
import MessageArea from "../components/ChatPageComponents/messageArea";
import UserList from "../components/ChatPageComponents/UserList";

import {
  fetchUserDetails,
  getFriends,
} from "../features/friends/friendsAsyncThunks";
import { fetchChatFriends } from "../features/chats/chatsAsycnThunks";
import chatSocket from "../features/utilities/Socket-io";
import { UploadImage } from "../Utilities/UploadImage";
import { useRecoilState } from "recoil";
import { ChatFriendsData, ChatRoomMessages } from "../atoms/chatAtoms";
import { enqueueSnackbar } from "notistack";
import { ArrowBack } from "@mui/icons-material";
import { setReadMessages } from "../features/chats/chatsSlice";
const CHAT_BACKEND = process.env.REACT_APP_CHAT_BACKEND;

export default function ChatPage() {
  const dispatch = useDispatch();
  const { chatFriends } = useSelector((state) => state.chats);
  const { friends, userData } = useSelector((state) => state.friends);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [friend, setFriend] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [friendsData, setFriendsData] = useRecoilState(ChatFriendsData);
  const [chatMessages, setChatMessages] = useRecoilState(ChatRoomMessages);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getFriends()).unwrap();

      const resolvedUserData = await Promise.all(
        friends.map((id, index) => {
          return userData[id]
            ? userData[id]
            : dispatch(fetchUserDetails(id))
                .unwrap()
                .then((data) => ({
                  data,
                }));
        })
      );
      setFriendsData(resolvedUserData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      await dispatch(fetchChatFriends());
      setLoading(false);
    };

    fetchChatData();
  }, []);

  useEffect(() => {
    setSearchResult(
      searchQuery.trim()
        ? friendsData.filter(
            (friend) =>
              friend.firstName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              friend.lastName.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : []
    );
  }, [searchQuery, friendsData]);

  const handleChat = useCallback((friend, roomId) => {
    dispatch(setReadMessages(friend));
    setDrawerOpen(false);
    setRoomId(roomId);
    setFriend(friend);
    setMessage("");
    chatSocket.emit("join_room", { userId: friend });
  }, []);

  const handleSubmitImage = async () => {
    await UploadImage(friend, chatSocket, image);
    setImage(null);
  };

  useEffect(() => {
    if (!friend) return;

    const fetchChatMessages = async () => {
      const response = await fetch(
        `${CHAT_BACKEND}/chats/fetchchat?id=${friend}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const { chat } = await response.json();
        setChatMessages((prevChats) => ({
          ...prevChats,
          [chat.roomId]: chat,
        }));
      }
    };

    fetchChatMessages();
  }, [friend]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleSubmit = (id, room) => {
    if (message.trim()) {
      if (!chatSocket.connected) {
        enqueueSnackbar(
          "Error sending message. Please refresh the page and try again",
          {
            variant: "info",
          }
        );
        // chatSocket.connect();
      }
      dispatch(setReadMessages(friend));

      chatSocket.emit("message", {
        userId: id,
        message,
        type: "text",
        roomId: room,
      });
      setMessage("");
    }
  };
  const handleEmoji = (id, emoji, friendId, room) => {
    chatSocket.emit("emoji_send", { id, emoji, friendId, roomId: room });
  };

  if (loading) {
    return null;
  }

  const renderUserList = () => (
    <Grid item style={{ padding: "10px", width: "100%" }}>
      <Typography
        variant="h5"
        sx={{
          marginX: "auto",
          mb: 2,
          fontWeight: 700,
          textAlign: "center",
          padding: "12px 12px",
          // width: "100%",
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
              setFriendsData={setFriendsData}
            />
          ))
        ) : chatFriends.length ? (
          chatFriends.map((friend) => (
            <UserList
              key={friend._id}
              friend={friend._id}
              roomId={friend.roomId}
              unreadCount={friend?.unreadCount}
              handleChat={handleChat}
              setFriendsData={setFriendsData}
            />
          ))
        ) : friendsData.length ? (
          friendsData.map((friend) => (
            <UserList
              key={friend._id}
              friend={friend._id}
              roomId={friend.roomId}
              handleChat={handleChat}
              setFriendsData={setFriendsData}
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
  );

  const renderChatArea = () => (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* <Box
          sx={{
            p: 1,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
          )}
        </Box> */}

      {friend ? (
        <MessageArea
          setImage={setImage}
          handleSubmitImage={handleSubmitImage}
          handleEmoji={handleEmoji}
          handleSubmit={handleSubmit}
          message={message}
          setMessage={setMessage}
          friend={friend}
          messages={chatMessages[roomId]}
          roomId={roomId}
          setDrawerOpen={setDrawerOpen}
        />
      ) : (
        <>
          {isMobile ? (
            <Box sx={{ borderRight: 1, borderColor: "divider" }}>
              {renderUserList()}
            </Box>
          ) : (
            <Typography
              variant="h6"
              sx={{
                margin: "auto",
                padding: "20px",
                textAlign: "center",
                color: "#999",
                fontStyle: "italic",
              }}
            >
              `Click on any user to start chatting!`
            </Typography>
          )}
        </>
      )}
    </Box>
  );

  return (
    <>
      <Header setChatMessages={setChatMessages} />
      <Grid container sx={{ flexWrap: "nowrap" }}>
        {!isMobile && (
          <Box sx={{ maxWidth: 300, borderRight: 1, borderColor: "divider" }}>
            {renderUserList()}
          </Box>
        )}
        <Box
          sx={{
            height: "85vh",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderChatArea()}
        </Box>
      </Grid>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
          },
        }}
      >
        <Box role="presentation">
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(false)}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6">Contacts</Typography>
          </Box>
          {renderUserList()}
        </Box>
      </Drawer>
    </>
  );
}

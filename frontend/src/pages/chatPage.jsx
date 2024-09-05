import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import {
  fetchUserDetails,
  getFriends,
} from "../features/friends/friendsAsyncThunks";
import { fetchChatFriends } from "../features/chats/chatsAsycnThunks";
import chatSocket from "../features/utilities/Socket-io";
import useChatSocket from "../hooks/chatSocketHook";
import { UploadImage } from "../Utilities/UploadImage";
import { useRecoilState } from "recoil";
import { ChatFriendsData, ChatRoomMessages } from "../atoms/chatAtoms";
const CHAT_BACKEND = process.env.REACT_APP_CHAT_BACKEND;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [friendsData, setFriendsData] = useRecoilState(ChatFriendsData);
  const [chatMessages, setChatMessages] = useRecoilState(ChatRoomMessages);
  const [loading, setLoading] = useState(false);

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
      console.log(chatFriends);

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
    setRoomId(roomId);
    setFriend(friend);
    setMessage("");
    chatSocket.emit("join_room", { userId: friend });
  }, []);

  const handleSubmitImage = async () => {
    await UploadImage(friend, setImageUrl, chatSocket, image);
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

  return (
    <>
      <Header setChatMessages={setChatMessages} />
      <Grid container spacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12} container>
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
                messages={chatMessages[roomId]}
                roomId={roomId}
              />
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
                Click on any user to start chatting!
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

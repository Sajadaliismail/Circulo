import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllChats,
  fetchChatFriends,
  fetchchats,
} from "./chatsAsycnThunks";

const initialState = {
  chats: {},
  roomId: "",
  unReadMessages: {},
  chatFriends: [],
};

const updateChatMessages = (
  state,
  roomId,
  senderId,
  message,
  timestamp,
  type,
  _id
) => {
  console.log(roomId, senderId, message, timestamp, type);
  let newChats;
  if (type === "text") {
    newChats = { senderId, timestamp, message, _id };
  } else if (type === "image") {
    newChats = { senderId, timestamp, imageUrl: message, _id };
  }
  const prevChats = state.chats[roomId]?.messages || [];
  return [...prevChats, newChats];
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      const { roomId, hasOpened, senderId, message, timestamp, type, _id } =
        action.payload;
      state.chats[roomId] = {
        messages: updateChatMessages(
          state,
          roomId,
          senderId,
          message,
          timestamp,
          type,
          _id
        ),
        hasOpened,
      };
    },
    setReceivedChats: (state, action) => {
      const { message, senderId, roomId, timestamp } = action.payload;
      state.chats[roomId] = {
        messages: updateChatMessages(state, roomId, [
          { message, senderId, timestamp },
        ]),
        hasOpened: false,
      };
    },
    setUnreadMessages: (state, action) => {
      const friendId = action.payload.senderId;
      state.unReadMessages[friendId] =
        (state.unReadMessages[friendId] || 0) + 1;
    },
    setReadMessages: (state, action) => {
      const friendId = action.payload;
      state.unReadMessages[friendId] = 0;
    },
    setSentMessages: (state, action) => {
      const { message, timestamp, type } = action.payload;
      const roomId = state.roomId;
      const prevChats = state.chats[roomId]?.messages || [];
      if (type == "text") {
        state.chats[roomId].messages = [...prevChats, { message, timestamp }];
      }
      if (type == "image") {
        state.chats[roomId].messages = [
          ...prevChats,
          { imageUrl: message, timestamp },
        ];
      }
    },
    setEmoji: (state, action) => {
      const { id, emoji } = action.payload;
      const roomId = state.roomId;
      state.chats[roomId]?.messages.map((mess) => {
        if (mess._id === id) {
          mess.emoji = emoji;
          return mess;
        }
        return mess;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchchats.fulfilled, (state, action) => {
        const { roomId, messages, hasOpened, unreadCount } = action.payload;

        state.chats[roomId] = {
          messages,
          hasOpened,
          unreadCount,
        };
        state.roomId = roomId;
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        if (action.payload.length) {
          action.payload.map((chat) => {
            state.chats[chat.roomId] = {
              messages: chat.messages,
              unReadCount: chat.unreadCount,
            };
          });
        }
      })
      .addCase(fetchChatFriends.fulfilled, (state, action) => {
        state.chatFriends = action.payload.chatFriends;
      });
  },
});

export const {
  setChats,
  setUnreadMessages,
  setReadMessages,
  setReceivedChats,
  setSentMessages,
  setEmoji,
} = chatsSlice.actions;
export default chatsSlice.reducer;

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
      const curr = state.chats[roomId];

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
        ...curr,
      };
    },
    setReceivedChats: (state, action) => {
      const { message, senderId, roomId, timestamp, type, _id } =
        action.payload;
      const curr = state.chats[roomId];

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
        ...curr,
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
    setChatBox: (state) => {
      const currState = state.chats;
      state.chats = Object.fromEntries(
        Object.entries(currState).map(([key, chat]) => [
          key,
          {
            ...chat,
            chatBoxOpen: false,
            minimized: false,
          },
        ])
      );
    },
    setMinimize: (state, action) => {
      const id = action.payload;
      const curr = state.chats[id];
      state.chats[id] = { ...curr, minimized: !curr.minimized };
    },
    setClosed: (state, action) => {
      const id = action.payload;
      const curr = state.chats[id];
      state.chats[id] = { ...curr, chatBoxOpen: false };
    },
    setOpen: (state, action) => {
      const id = action.payload;
      const curr = state.chats[id];
      state.chats[id] = { ...curr, chatBoxOpen: true, minimized: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchchats.fulfilled, (state, action) => {
        const { roomId, messages, hasOpened, unreadCount, user1, user2 } =
          action.payload;
        const curr = state.chats[roomId];

        state.chats[roomId] = {
          ...curr,
          messages,
          hasOpened,
          unreadCount,
          roomId: roomId,
          user1,
          user2,
        };
        state.roomId = roomId;
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        if (action.payload?.length) {
          action.payload.map((chat) => {
            state.chats[chat.roomId] = {
              messages: chat.messages,
              unReadCount: chat.unreadCount,
              roomId: chat.roomId,
              user1: chat.user1,
              user2: chat.user2,
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
  setChatBox,
  setOpen,
  setClosed,
  setMinimize,
} = chatsSlice.actions;
export default chatsSlice.reducer;

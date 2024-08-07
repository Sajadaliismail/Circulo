import { createSlice } from "@reduxjs/toolkit";
import { fetchchats } from "./chatsAsycnThunks";

const initialState = {
  chats: {},
  roomId: "",
  unReadMessages: {},
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      const roomId = action.payload.roomId;
      const hasOpened = action.payload.hasOpened;
      const newChats = action.payload.messages;
      const prevChats = state.chats[roomId].messages;
      state.chats[roomId] = {
        messages: [...prevChats, ...newChats],
        hasOpened: hasOpened,
      };
    },
    setUnreadMessages: (state, action) => {
      console.log(action.payload);
      const friendId = action.payload.senderId;
      if (!state.unReadMessages[friendId]) {
        state.unReadMessages[friendId] = 0;
      }
      state.unReadMessages[friendId] += 1;
    },
    setReadMessages: (state, action) => {
      const friendId = action.payload;
      if (state.unReadMessages[friendId]) {
        state.unReadMessages[friendId] = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchchats.fulfilled, (state, action) => {
      const roomId = action.payload.roomId;
      const messages = action.payload.messages;
      const hasOpened = action.payload.hasOpened;
      state.chats[roomId] = {
        messages: messages,
        hasOpened: hasOpened,
      };
      state.roomId = roomId;
    });
  },
});

export const { setChats, setUnreadMessages, setReadMessages } =
  chatsSlice.actions;
export default chatsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllChats,
  fetchChatFriends,
  fetchchats,
} from "./chatsAsycnThunks";
import { act } from "react";

const initialState = {
  chats: {},
  roomId: "",
  unReadMessages: {},
  chatFriends: [],
};

// const updateChatMessages = (
//   state,
//   roomId,
//   senderId,
//   message,
//   timestamp,
//   type,
//   _id
// ) => {
//   let newChats;
//   if (type === "text") {
//     newChats = { senderId, timestamp, message, _id };
//   } else if (type === "image") {
//     newChats = { senderId, timestamp, imageUrl: message, _id };
//   }
//   const prevChats = state.chats[roomId]?.messages || [];

//   return [...prevChats, newChats];
// };

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    // setChats: (state, action) => {
    //   const { roomId, hasOpened, senderId, message, timestamp, type, _id } =
    //     action.payload;
    //   const curr = state.chats[roomId];
    //   state.chats[roomId] = {
    //     messages: updateChatMessages(
    //       state,
    //       roomId,
    //       senderId,
    //       message,
    //       timestamp,
    //       type,
    //       _id
    //     ),
    //     ...curr,
    //   };
    // },
    // setReceivedChats: (state, action) => {
    //   const { message, senderId, roomId, timestamp, type, _id } =
    //     action.payload;
    //   const curr = state.chats[roomId];
    //   state.chats[roomId] = {
    //     messages: updateChatMessages(
    //       state,
    //       roomId,
    //       senderId,
    //       message,
    //       timestamp,
    //       type,
    //       _id
    //     ),
    //     ...curr,
    //   };
    // },
    setUnreadMessages: (state, action) => {
      console.log(action.payload);

      const friendId = action.payload.senderId;
      const roomId = action.payload.roomId;

      // Check if the friend already exists in the chatFriends list
      const existingFriend = state.chatFriends.find(
        (friends) => friends._id === friendId
      );

      if (existingFriend) {
        // Map over the array to update the unreadCount of the correct friend
        state.chatFriends = state.chatFriends.map((friends) => {
          if (friends._id === friendId) {
            return {
              ...friends,
              unreadCount: friends.unreadCount + 1, // Increment unreadCount immutably
            };
          }
          return friends; // Return other friends unchanged
        });
      } else {
        // Add new friend to the list with unreadCount of 1
        state.chatFriends.unshift({
          _id: friendId,
          unreadCount: 1,
          roomId: roomId,
        });
      }
    },

    // setReadMessages: (state, action) => {
    //   const friendId = action.payload;
    //   const curr = state.chatFriends.map((user) => {
    //     if (user._id === friendId) {
    //       console.log(user, friendId);
    //       return {
    //         ...user,
    //         unreadCount: 0,
    //       };
    //     }
    //     return user;
    //   });
    //   state.chatFriends = curr;
    // },
    // setSentMessages: (state, action) => {
    //   const { message, timestamp, type } = action.payload;
    //   const roomId = state.roomId;
    //   const prevChats = state.chats[roomId]?.messages || [];
    //   if (type === "text") {
    //     state.chats[roomId].messages = [...prevChats, { message, timestamp }];
    //   }
    //   if (type === "image") {
    //     state.chats[roomId].messages = [
    //       ...prevChats,
    //       { imageUrl: message, timestamp },
    //     ];
    //   }
    // },
    // setEmoji: (state, action) => {
    //   const { id, emoji } = action.payload;
    //   const roomId = state.roomId;
    //   state.chats[roomId]?.messages.map((mess) => {
    //     if (mess._id === id) {
    //       mess.emoji = emoji;
    //       return mess;
    //     }
    //     return mess;
    //   });
    // },
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
  //   setChats,
  setUnreadMessages,
  //   setReadMessages,
  //   setReceivedChats,
  //   setSentMessages,
  //   setEmoji,
} = chatsSlice.actions;
export default chatsSlice.reducer;

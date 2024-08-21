import { createAsyncThunk } from "@reduxjs/toolkit";
import { setOpen } from "./chatsSlice";

export const fetchchats = createAsyncThunk(
  "chats/fetchchats",
  async (id, { dispatch }) => {
    try {
      const response = await fetch(
        `http://localhost:3008/chats/fetchchat?id=${id}`,
        {
          method: "GET",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.chat || !data.chat.roomId) {
        throw new Error("Invalid data format received from server.");
      }

      const roomId = data.chat.roomId;
      console.log(roomId);
      dispatch(setOpen(roomId));

      return data.chat;
    } catch (error) {
      console.error("Failed to fetch chats:", error);

      throw error;
    }
  }
);

export const fetchAllChats = createAsyncThunk(
  "chats/fetchAllChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3008/chats/fetchAllChats`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue("Error fetching chats");
      }
      console.log(data);

      return data;
    } catch (error) {}
  }
);

export const fetchChatFriends = createAsyncThunk(
  "chats/fetchChatFriends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3008/chats/fetchChatFriends`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        return rejectWithValue("Error fetching chats");
      }
      return data;
    } catch (error) {}
  }
);

export const refreshAccessToken = async () => {
  try {
    const response = await fetch(
      "http://localhost:3008/chats/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await response.json();

    if (response.ok) {
      return data.accessToken;
    } else {
      console.error("Failed to refresh access token");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

import { createAsyncThunk } from "@reduxjs/toolkit";
const CHAT_BACKEND = process.env.REACT_APP_CHAT_BACKEND;

export const fetchchats = createAsyncThunk(
  "chats/fetchchats",
  async (id, { dispatch }) => {
    try {
      const response = await fetch(`${CHAT_BACKEND}/chats/fetchchat?id=${id}`, {
        method: "GET",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.chat || !data.chat.roomId) {
        throw new Error("Invalid data format received from server.");
      }

      // const roomId = data.chat.roomId;
      // dispatch(setOpen(roomId));

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
      const response = await fetch(`${CHAT_BACKEND}/chats/fetchAllChats`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue("Error fetching chats");
      }
      // console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue("Error fetching chats");
    }
  }
);

export const fetchChatFriends = createAsyncThunk(
  "chats/fetchChatFriends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CHAT_BACKEND}/chats/fetchChatFriends`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue("Error fetching chats");
      }
      return data;
    } catch (error) {
      console.log(error);

      return rejectWithValue("Error fetching chats");
    }
  }
);

export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${CHAT_BACKEND}/chats/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
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

export const getNotifications = createAsyncThunk(
  "chats/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CHAT_BACKEND}/chats/notifications`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue("Error fetching notificatoins");
      }
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error fetching notificatoins");
    }
  }
);

export const clearNotifications = createAsyncThunk(
  "chats/clearNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CHAT_BACKEND}/chats/clearNotifications`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue("Error fetching notificatoins");
      }
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error fetching notificatoins");
    }
  }
);

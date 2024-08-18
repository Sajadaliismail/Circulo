import { createAsyncThunk } from "@reduxjs/toolkit";
import { setOpen } from "./chatsSlice";

export const fetchchats = createAsyncThunk(
  "chats/fetchchats",
  async (id, { dispatch, getState }) => {
    try {
      const token = localStorage.getItem("jwt");

      // Checking if token exists before making the request
      if (!token) {
        throw new Error("Authorization token is missing.");
      }

      const response = await fetch(
        `http://localhost:3008/chats/fetchchat?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Check if the data structure is as expected
      if (!data.chat || !data.chat.roomId) {
        throw new Error("Invalid data format received from server.");
      }

      const roomId = data.chat.roomId;
      console.log(roomId);
      dispatch(setOpen(roomId));

      return data.chat;
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      // Optionally dispatch an action to handle the error in your Redux store
      // dispatch(setFetchError(error.message));
      throw error; // Rethrow the error to propagate it to the async thunk's rejection handler
    }
  }
);

export const fetchAllChats = createAsyncThunk(
  "chats/fetchAllChats",
  async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3008/chats/fetchAllChats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      return data.chat;
    } catch (error) {}
  }
);

export const fetchChatFriends = createAsyncThunk(
  "chats/fetchChatFriends",
  async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3008/chats/fetchChatFriends`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {}
  }
);

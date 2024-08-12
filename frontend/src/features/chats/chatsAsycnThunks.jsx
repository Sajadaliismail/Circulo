import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchchats = createAsyncThunk("chats/fetchchats", async (id) => {
  try {
    console.log(id);

    const token = localStorage.getItem("jwt");
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
    const data = await response.json();
    console.log(data);

    return data.chat;
  } catch (error) {}
});

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

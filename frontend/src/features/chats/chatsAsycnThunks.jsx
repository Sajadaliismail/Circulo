import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchchats = createAsyncThunk("chats/fetchchats", async (id) => {
  try {
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
    return data.chat;
  } catch (error) {}
});

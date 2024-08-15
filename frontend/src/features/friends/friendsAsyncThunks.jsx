import { createAsyncThunk } from "@reduxjs/toolkit";
export const addFriend = createAsyncThunk("friends/addFriend", async (id) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:3006/friends/addfriend`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    });
    const data = await response.json();
    return true;
  } catch (error) {
    console.log(error);
    return;
  }
});

export const getSuggestions = createAsyncThunk(
  "friends/suggestions",
  async (postalCode) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3006/friends/suggestions?postalCode=${postalCode}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

export const getFriends = createAsyncThunk("friends/getFriends", async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:3006/friends/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
    return;
  }
});

export const getRequests = createAsyncThunk("friends/getRequests", async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:3006/friends/requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
});

export const cancelRequest = createAsyncThunk(
  "friends/cancelRequest",
  async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3006/friends/cancel-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "friends/acceptRequest",
  async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3006/friends/accept-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

export const sentRequest = createAsyncThunk(
  "friends/sendRequest",
  async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3006/friends/send-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

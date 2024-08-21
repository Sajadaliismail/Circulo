import { createAsyncThunk } from "@reduxjs/toolkit";
export const addFriend = createAsyncThunk("friends/addFriend", async (id) => {
  try {
    const response = await fetch(`http://localhost:3006/friends/addfriend`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
      const response = await fetch(
        `http://localhost:3006/friends/suggestions?postalCode=${postalCode}`,
        {
          method: "GET",
          credentials: "include",
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

export const getFriends = createAsyncThunk("friends/getFriends", async (_) => {
  try {
    const response = await fetch(`http://localhost:3006/friends/friends`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    return;
  }
});

export const getRequests = createAsyncThunk(
  "friends/getRequests",
  async (_) => {
    try {
      const response = await fetch(`http://localhost:3006/friends/requests`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

export const cancelRequest = createAsyncThunk(
  "friends/cancelRequest",
  async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3006/friends/cancel-request`,
        {
          method: "POST",
          credentials: "include",
          headers: {
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
      const response = await fetch(
        `http://localhost:3006/friends/accept-request`,
        {
          method: "POST",
          credentials: "include",

          headers: {
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
      const response = await fetch(
        `http://localhost:3006/friends/send-request`,
        {
          method: "POST",
          credentials: "include",

          headers: {
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

export const fetchUserDetails = createAsyncThunk(
  "friends/fetchUserDetails",
  async (id, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(
        `http://localhost:3002/fetchUserData?userId=${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {},
        }
      );
      const data = await response.json();
      if (!response.ok) {
        rejectWithValue("User Not found");
      }
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

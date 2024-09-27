import { createAsyncThunk } from "@reduxjs/toolkit";
const FRIENDS_BACKEND = process.env.REACT_APP_FRIENDS_BACKEND;
const BACKEND = process.env.REACT_APP_USER_BACKEND;

export const addFriend = createAsyncThunk("friends/addFriend", async (id) => {
  try {
    const response = await fetch(`${FRIENDS_BACKEND}/friends/send-request`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });
    await response.json();
    return true;
  } catch (error) {
    console.log(error);
    return;
  }
});

export const getSuggestions = createAsyncThunk(
  "friends/suggestions",
  async (postalCode, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${FRIENDS_BACKEND}/friends/suggestions?postalCode=${postalCode}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) return rejectWithValue("Error fetching suggestions");
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error fetching suggestions");
    }
  }
);

export const getFriends = createAsyncThunk(
  "friends/getFriends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${FRIENDS_BACKEND}/friends/friends`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue("Error fetching friends details");
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error fetching friends details");
    }
  }
);

export const getRequests = createAsyncThunk(
  "friends/getRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${FRIENDS_BACKEND}/friends/requests`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue("Error fetching requests details");

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error fetching requests details");
    }
  }
);

export const cancelRequest = createAsyncThunk(
  "friends/cancelRequest",
  async (id) => {
    try {
      const response = await fetch(
        `${FRIENDS_BACKEND}/friends/cancel-request`,
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
        `${FRIENDS_BACKEND}/friends/accept-request`,
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
      const response = await fetch(`${FRIENDS_BACKEND}/friends/send-request`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
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
      const response = await fetch(`${BACKEND}/fetchUserData?userId=${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        rejectWithValue("User Not found");
      }
      return data;
    } catch (error) {
      console.log(error);
      rejectWithValue("User Not found");

      return;
    }
  }
);

export const fetchUserStatus = createAsyncThunk(
  "friends/fetchUserStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND}/fetchUserStatus?userId=${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue("User Not found");
      }

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("User Not found");
    }
  }
);

export const removeFriend = createAsyncThunk(
  "friends/removeFriend",
  async (id, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${FRIENDS_BACKEND}/friends/removeFriend`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
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

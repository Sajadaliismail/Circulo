import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAccessToken } from "./authSlice";
const BACKEND = process.env.REACT_APP_USER_BACKEND;

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BACKEND}/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      dispatch(sendOtp({ email: data.email }));
      return data.email;
    } catch (error) {
      console.log(error);
      return rejectWithValue({ error: "Server error, Try after some time" });
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BACKEND}/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }
      if (response.status === 206) {
        await dispatch(sendOtp({ email: data.email }));
        return { email: data.email, isEmailVerified: false };
      }
      dispatch(setAccessToken(data.token));
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({ error: "Server error, Try after some time" });
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendotp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND}/sendotp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return true;
    } catch (err) {
      return rejectWithValue({ message: "Server error, Try again later" });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyotp",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BACKEND}/verifyotp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }
      dispatch(setAccessToken(data.token));

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND}/updatepassword`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return true;
    } catch (error) {}
  }
);

export const addressSetup = createAsyncThunk(
  "auth/addressSetup",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.accessToken;

      const response = await fetch(`${BACKEND}/updateaddress`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue({ message: data.error });
      }
      return data.success;
    } catch (error) {
      return rejectWithValue({ message: "Error updating address" });
    }
  }
);

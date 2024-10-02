import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserDetails } from "../friends/friendsAsyncThunks";
import { setImage } from "../friends/friendsSlice";
const BACKEND = process.env.REACT_APP_USER_BACKEND;

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { dispatch }) => {
    try {
      const response = await fetch(`${BACKEND}/fetchuser`, {
        method: "GET",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      await dispatch(fetchUserDetails(data._id));
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "user/uploadImage",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const imageData = new FormData();
      imageData.append("image", formData);
      const response = await fetch(`${BACKEND}/uploadImage`, {
        method: "POST",
        credentials: "include",
        body: imageData,
      });
      const data = await response.json();
      if (response.ok) {
        await dispatch(setImage(data.message));
        return data;
      } else return rejectWithValue("Error uploading image");
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error uploading image");
    }
  }
);

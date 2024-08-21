import { createAsyncThunk } from "@reduxjs/toolkit";
const BACKEND = process.env.REACT_APP_BACKEND;

export const fetchUser = createAsyncThunk("user/fetchUser", async (_) => {
  try {
    const response = await fetch(`${BACKEND}/fetchuser`, {
      method: "GET",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
});

export const uploadImage = createAsyncThunk(
  "user/uploadImage",
  async (formData) => {
    try {
      const imageData = new FormData();
      imageData.append("image", formData);
      const response = await fetch(`${BACKEND}/uploadImage`, {
        method: "POST",
        credentials: "include",
        body: imageData,
      });
    } catch (error) {}
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
const BACKEND = process.env.REACT_APP_BACKEND;

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${BACKEND}/fetchuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    console.log(formData);
    try {
      const imageData = new FormData();
      imageData.append("image", formData);

      const token = localStorage.getItem("jwt");
      const response = await fetch(`${BACKEND}/uploadImage`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageData,
      });
      console.log(response);
    } catch (error) {}
  }
);

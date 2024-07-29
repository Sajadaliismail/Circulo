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
    console.log(data, token);

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

export const addPost = createAsyncThunk(
  "user/addPost",
  async ({ imgData, post }, { dispatch }) => {
    console.log(imgData, post);
    try {
      const formData = new FormData();
      formData.append("image", imgData);
      formData.append("post", post);
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${BACKEND}/addpost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      dispatch(fetchPosts());
      return true;
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

export const fetchPosts = createAsyncThunk("user/fetchPosts", async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${BACKEND}/fetchposts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    // return data.userData
    return data;
  } catch (error) {}
});

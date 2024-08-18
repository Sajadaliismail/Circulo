import { createAsyncThunk } from "@reduxjs/toolkit";
export const addPost = createAsyncThunk(
  "posts/addPost",
  async ({ imgData, post }, { dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("image", imgData);
      formData.append("post", post);
      const token = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:3004/posts/addpost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { getState }) => {
    try {
      const state = getState(); // Access the current state
      const { pages, limits } = state.posts;
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3004/posts/fetchposts?page=${pages}&limits=${limits}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {}
  }
);

export const handleLike = createAsyncThunk(
  "posts/handleLike",
  async (_id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:3004/posts/handlelike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id }),
      });
      const data = await response.json();
      return true;
    } catch (error) {
      console.log(error);
      return rejectWithValue({ id: _id });
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async (formdata) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:3004/posts/addcomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
    } catch (error) {}
  }
);

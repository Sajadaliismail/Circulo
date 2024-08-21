import { createAsyncThunk } from "@reduxjs/toolkit";
export const addPost = createAsyncThunk(
  "posts/addPost",
  async ({ imgData, post }) => {
    try {
      const formData = new FormData();
      formData.append("image", imgData);
      formData.append("post", post);

      const response = await fetch(`http://localhost:3004/posts/addpost`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      console.log(data);

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
      const state = getState();
      const { pages, limits } = state.posts;
      const token = state.auth.accessToken;
      const response = await fetch(
        `http://localhost:3004/posts/fetchposts?page=${pages}&limits=${limits}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const handleLike = createAsyncThunk(
  "posts/handleLike",
  async (_id, { dispatch, rejectWithValue, getState }) => {
    try {
      const response = await fetch(`http://localhost:3004/posts/handlelike`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });
      const data = await response.json();
      console.log(data);

      return true;
    } catch (error) {
      console.log(error);
      return rejectWithValue({ id: _id });
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3004/posts/addcomment`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      if (response.ok) return data.data;
      else rejectWithValue("Error adding Comment");
    } catch (error) {
      rejectWithValue("Error adding Comment");
    }
  }
);

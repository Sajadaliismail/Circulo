import { createAsyncThunk } from "@reduxjs/toolkit";
const POST_BACKEND = process.env.REACT_APP_POST_BACKEND;

export const addPost = createAsyncThunk(
  "posts/addPost",
  async ({ imgData, post }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", imgData);
      formData.append("post", post);

      const response = await fetch(`${POST_BACKEND}/posts/addpost`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        return data.result._id;
      } else rejectWithValue("Error posting");
    } catch (error) {
      console.log(error);
      rejectWithValue("Error posting");
      return;
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${POST_BACKEND}/posts/fetchposts`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) return data;
      return rejectWithValue("Error fetching data");
    } catch (error) {
      console.log(error);
      rejectWithValue("Error fetching data");
    }
  }
);

export const handleLike = createAsyncThunk(
  "posts/handleLike",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${POST_BACKEND}/posts/handlelike`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });
      await response.json();
      if (response.ok) return true;
      return rejectWithValue({ id: _id });
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
      const response = await fetch(`${POST_BACKEND}/posts/addcomment`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      if (response.ok) return data;
      else rejectWithValue("Error adding Comment");
    } catch (error) {
      rejectWithValue("Error adding Comment");
    }
  }
);

export const addReply = createAsyncThunk(
  "posts/addReply",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await fetch(`${POST_BACKEND}/posts/addReply`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      // console.log(data);

      if (response.ok) return data;
      else rejectWithValue("Error adding Comment");
    } catch (error) {
      rejectWithValue("Error adding Comment");
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${POST_BACKEND}/posts/deletepost/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) return data.postId;
      else rejectWithValue("Error deleting post");
    } catch (error) {
      rejectWithValue("Error deleting post");
    }
  }
);

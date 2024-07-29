import { createSlice } from "@reduxjs/toolkit";
import { addPost, fetchPosts, fetchUser, uploadImage } from "./userAsyncThunks";

const initialState = {
  user: {},
  posts: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.status = "";
        state.error = {};
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = "";
        // state.error = action.payload
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "";
        state.error = {};
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "";
        // state.error = action.payload
      })
      .addCase(addPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = "";
        // state.error = action.payload
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
        // state.posts = action.payload.posts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "";
        // state.error = action.payload
      });
  },
});

// export const {} = userSlice.actions
export default userSlice.reducer;

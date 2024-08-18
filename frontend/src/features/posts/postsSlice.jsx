import { createSlice } from "@reduxjs/toolkit";
import {
  addComment,
  addPost,
  fetchPosts,
  handleLike,
} from "./postsAsyncThunks";

const initialState = {
  posts: [],
  pages: 1,
  limits: 10,
  comments: {},
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPages: (state) => {
      state.pages = state.pages + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
        const prevPosts = state.posts;
        state.posts = [action.payload.result, ...prevPosts];
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = "";
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const newPosts = action.payload?.posts;
        if (newPosts) {
          const prevPostsIdSet = new Set(state.posts.map((post) => post._id));
          const filteredPosts = newPosts?.filter(
            (post) => !prevPostsIdSet.has(post._id)
          );

          const updatedPosts = [...state.posts, ...filteredPosts];
          state.posts = updatedPosts;
          state.count = action.payload.count;
        }
        state.status = "";
        state.error = {};
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "";
      })
      .addCase(addComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = "";
        // state.error = action.payload
      })
      .addCase(handleLike.pending, (state, action) => {
        state.status = "loading";
        const currentPostId = action.meta.arg; // Access the ID passed to the thunk

        // Update state immutably
        state.posts = state.posts.map((post) => {
          if (post._id === currentPostId._id) {
            const alreadyLiked = post.hasLiked;
            let count = post.likesCount;
            if (alreadyLiked) count--;
            else count++;

            return {
              ...post,
              hasLiked: !alreadyLiked,
              likesCount: count,
            };
          }
          return post;
        });
      })
      .addCase(handleLike.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
      })
      .addCase(handleLike.rejected, (state, action) => {
        state.status = "";
        const currentPostId = action.meta.arg;
        state.posts = state.posts.map((post) => {
          if (post._id === currentPostId._id) {
            console.log("eth");
            const alreadyLiked = post.hasLiked;
            let count = post.likesCount;
            if (alreadyLiked) count--;
            else count++;

            return {
              ...post,
              hasLiked: !alreadyLiked,
              likesCount: count,
            };
          }
          return post;
        });
      });
  },
});
export const { setPages } = postSlice.actions;
export default postSlice.reducer;

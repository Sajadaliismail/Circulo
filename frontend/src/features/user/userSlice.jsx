import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, uploadImage } from "./userAsyncThunks";

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
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
        const message = action.payload.message;
        state.user.profilePicture = message.profilePicture;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = "";
        // state.error = action.payload
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "";
        // state.error = action.payload
      });
  },
});

// export const {} = userSlice.actions
export default userSlice.reducer;

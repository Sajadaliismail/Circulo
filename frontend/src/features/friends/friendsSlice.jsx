import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserDetails,
  getFriends,
  getRequests,
  getSuggestions,
} from "./friendsAsyncThunks";

const initialState = {
  friends: [],
  suggestions: [],
  nearBy: [],
  requestsSent: [],
  requestsPending: [],
  status: "",
  error: "",
  userData: {},
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload.suggestions;
      })
      .addCase(getRequests.fulfilled, (state, action) => {
        state.requestsPending = action.payload.requests;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.friends = action.payload.friends;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        const { _id } = action?.payload;
        state.userData[_id] = action.payload;
      });
  },
});

export default friendsSlice.reducer;

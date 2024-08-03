import { createSlice } from "@reduxjs/toolkit";
import { getFriends, getRequests, getSuggestions } from "./friendsAsyncThunks";

const initialState = {
  friends: [],
  suggestions: [],
  nearBy: [],
  requestsSent: [],
  requestsPending: [],
  status: "",
  error: "",
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
        console.log(action.payload);

        state.requestsPending = action.payload.requests;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        console.log(action.payload);

        state.friends = action.payload.requests;
      });
  },
});

export default friendsSlice.reducer;

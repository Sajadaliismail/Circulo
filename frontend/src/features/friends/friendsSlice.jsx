import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserDetails,
  fetchUserStatus,
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
  reducers: {
    setStatus: (state, action) => {
      const id = action.payload;
      if (state.userData[id]) state.userData[id].onlineStatus = true;
    },
    setImage: (state, action) => {
      const { _id, profilePicture } = action.payload;
      state.userData[_id].profilePicture = [profilePicture];
    },
  },
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
      })
      .addCase(fetchUserStatus.fulfilled, (state, action) => {
        const { onlineStatus, onlineTime, id } = action.payload;
        if (state.userData && state.userData[id]) {
          state.userData[id] = {
            ...state.userData[id],
            onlineStatus,
            onlineTime,
          };
        }
      });
  },
});
export const { setStatus, setImage } = friendsSlice.actions;
export default friendsSlice.reducer;

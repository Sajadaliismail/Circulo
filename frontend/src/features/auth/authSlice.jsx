import { createSlice } from "@reduxjs/toolkit";
import {
  sendOtp,
  signup,
  signin,
  verifyOtp,
  updatePassword,
  addressSetup,
} from "./authAsyncThunks";

const initialState = {
  error: {},
  isLoggedIn: false,
  isSetupComplete: false,
  isEmailVerified: false,
  email: "",
  firstName: "",
  lastName: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
    },
    resetErrors: (state) => {
      state.error = {};
    },
    setIsSetupComplete: (state) => {
      state.isSetupComplete = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.error = {};
        state.status = "";
        state.email = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "";
      })
      .addCase(signin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.error = {};
        state.status = "";
        state.isLoggedIn = true;
        state.isEmailVerified = action.payload.isEmailVerified;
        state.isSetupComplete = action.payload.isSetupComplete;
        state.email = action.payload.email;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
      })
      .addCase(signin.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "";
      })
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = "";
        state.error = {};
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "";
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
        state.isEmailVerified = action.payload.isEmailVerified;
        state.isSetupComplete = action.payload.isSetupComplete;
        state.firstName = action.payload.firstName;
        state.email = action.payload.email;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "";
        state.error = action.payload;
      })
      .addCase(updatePassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = "";
        state.error = {};
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = "";
        state.error = action.payload;
      })
      .addCase(addressSetup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addressSetup.fulfilled, (state, action) => {
        state.status = "";
        state.error = {};
      })
      .addCase(addressSetup.rejected, (state, action) => {
        state.status = "";
        state.error = action.payload;
      });
  },
});

export const {
  setError,
  setEmail,
  setLogout,
  setIsSetupComplete,
  resetErrors,
} = authSlice.actions;
export default authSlice.reducer;

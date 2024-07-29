import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../features/auth/authAsyncThunks";
import { setEmail } from "../../features/auth/authSlice";
import { useSnackbar } from "notistack";

const EmailForm = ({ onOtpSent }) => {
  const dispatch = useDispatch();
  const { email, error } = useSelector((state) => state.auth);
  const [emailError, setEmailError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const validateEmail = (email) => {
    // Simple email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    setEmailError("");
    const result = await dispatch(sendOtp({ email }));
    if (sendOtp.fulfilled.match(result)) {
      enqueueSnackbar("OTP sent to your email", { variant: "success" });
      onOtpSent();
    } else {
      enqueueSnackbar("Email is not registered", { variant: "error" });
    }
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{ mt: 1, width: "100%" }}
      onSubmit={handleSendOtp}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Enter linked Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => dispatch(setEmail(e.target.value))}
        type="email"
        helperText={emailError || error.message}
        error={!!emailError}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Send OTP
      </Button>
    </Box>
  );
};

export default EmailForm;

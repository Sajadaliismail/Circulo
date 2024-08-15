import React, { useState } from "react";
import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../features/auth/authAsyncThunks";
import { resetErrors, setEmail } from "../../features/auth/authSlice";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";

const EmailForm = ({ setShowOTP }) => {
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
      setShowOTP(true);
      dispatch(resetErrors());
    } else if (sendOtp.rejected.match(result)) {
      enqueueSnackbar("Email is not registered", { variant: "error" });
    } else {
      enqueueSnackbar("Server error", { variant: "error" });
    }
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{ mt: 1, width: "100%" }}
      onSubmit={(e) => handleSendOtp(e)}
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

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2, width: "50%" }}
        >
          Send OTP
        </Button>
      </motion.div>
    </Box>
  );
};

export default EmailForm;

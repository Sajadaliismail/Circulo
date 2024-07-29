// OtpForm.js
import React from "react";
import { Box, Button } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../features/auth/authAsyncThunks";
import { useSnackbar } from "notistack";

const OtpForm = ({ otp, onOtpChange, count, onResendOtp, onOtpSubmit }) => {
  const { email, error } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleOtpSubmit = async () => {
    const resultAction = await dispatch(verifyOtp({ email, inputOtp: otp }));
    if (verifyOtp.fulfilled.match(resultAction)) {
      enqueueSnackbar("OTP verified", { variant: "success" });
      onOtpSubmit();
    } else {
      enqueueSnackbar("Invalid OTP", { variant: "error" });
    }
  };

  return (
    <>
      <MuiOtpInput
        length={6}
        sx={{ mt: 4 }}
        value={otp}
        onChange={onOtpChange}
      />
      <Box
        sx={{ display: "flex", gap: "50px", justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          sx={{ mt: 3, mb: "auto" }}
          onClick={handleOtpSubmit}
        >
          Proceed
        </Button>
        <Button
          variant="contained"
          sx={{ mt: 3, mb: 5 }}
          disabled={count !== 0}
          onClick={onResendOtp}
        >
          Resend OTP {count > 0 && `(${count})`}
        </Button>
      </Box>
    </>
  );
};

export default OtpForm;

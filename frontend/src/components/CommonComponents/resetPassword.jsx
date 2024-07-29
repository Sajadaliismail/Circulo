// ResetPassword.js
import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Logo } from "./logoComponent";
import EmailForm from "../AuthPageComponents/emailForm";
import OtpForm from "../AuthPageComponents/otpForm";
import PasswordForm from "../AuthPageComponents/passwordForm";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [count, setCount] = useState(60);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  const decrementCount = () => {
    setCount((prevCount) => {
      if (prevCount <= 1) {
        return 0;
      }
      return prevCount - 1;
    });
  };

  useEffect(() => {
    const timer = setInterval(decrementCount, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleResendOtp = () => {
    setCount(60);
  };

  const handleOtpSubmit = () => {
    setShowPasswordForm(true);
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        back
      </Button>
      <Logo />
      <Typography component="h1" variant="h5">
        Reset password
      </Typography>
      {!showOTP && !showPasswordForm && (
        <EmailForm onOtpSent={() => setShowOTP(true)} />
      )}
      {showOTP && !showPasswordForm && (
        <OtpForm
          otp={otp}
          onOtpChange={setOtp}
          count={count}
          onResendOtp={handleResendOtp}
          onOtpSubmit={handleOtpSubmit}
        />
      )}
      {showPasswordForm && <PasswordForm />}
    </Box>
  );
};

export default ResetPassword;

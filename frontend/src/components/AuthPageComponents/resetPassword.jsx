// ResetPassword.js
import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { Logo } from "../CommonComponents/logoComponent";
import EmailForm from "./emailForm";
import OtpForm from "./otpForm";
import PasswordForm from "./passwordForm";
import { SVGComponent } from "../CommonComponents/svgComponent";

const ResetPassword = ({ signin }) => {
  const [count, setCount] = useState(60);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
          signin();
        }}
      >
        back
      </Button>
      <Logo />
      <SVGComponent len={60} text={"RESET PASSWORD"} />
      {!showOTP && !showPasswordForm && <EmailForm setShowOTP={setShowOTP} />}
      {showOTP && !showPasswordForm && (
        <OtpForm
          otp={otp}
          onOtpChange={setOtp}
          count={count}
          onResendOtp={handleResendOtp}
          onOtpSubmit={handleOtpSubmit}
        />
      )}
      {showPasswordForm && <PasswordForm signin={signin} />}
    </Box>
  );
};

export default ResetPassword;

import { Box, Button, Typography } from "@mui/material";
import Copyright from "../CommonComponents/copyright";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useEffect, useState } from "react";
import { Logo } from "../CommonComponents/logoComponent";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../../features/auth/authAsyncThunks";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerifyOtp() {
  const [count, setCount] = useState(60);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (newValue) => setOtp(newValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(verifyOtp({ email, inputOtp: otp }));
    if (verifyOtp.fulfilled.match(resultAction)) {
      enqueueSnackbar("OTP verified", { variant: "success" });
      navigate("/setup");
    } else {
      enqueueSnackbar("Invalid OTP", { variant: "error" });
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(sendOtp({ email, inputOtp: otp }));
    if (sendOtp.fulfilled.match(resultAction)) {
      enqueueSnackbar("OTP Sent", { variant: "success" });
      setCount(60);
      setOtp("");
    } else {
      enqueueSnackbar("Error sending OTP", { variant: "error" });
    }
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
      <Logo />
      <Typography component="h1" variant="h4" sx={{ mt: 5 }}>
        Verify Account
      </Typography>
      <Box component="form" noValidate sx={{ mt: 5, width: "100%" }}>
        <MuiOtpInput length={6} value={otp} onChange={handleChange} />
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmit}>
              Proceed
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              disabled={count > 0}
              onClick={handleResend}
            >
              Resend OTP {count > 0 && `(${count})`}
            </Button>
          </motion.div>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
}

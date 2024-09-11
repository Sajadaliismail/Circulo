// PasswordForm.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../features/auth/authAsyncThunks"; // Import your action
import Copyright from "../CommonComponents/copyright";
import { useSnackbar } from "notistack";
import { resetErrors } from "../../features/auth/authSlice";

const PasswordForm = ({ signin }) => {
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      return "Both fields are required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/.test(password)) {
      return "Password must be alphanumeric";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePasswords();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    const result = await dispatch(updatePassword({ email, password }));
    if (updatePassword.fulfilled.match(result)) {
      enqueueSnackbar("Password updated successfully", { variant: "success" });
      enqueueSnackbar("Please login now", { variant: "info" });
      signin();
      dispatch(resetErrors());
    } else {
      enqueueSnackbar("Error updating the password", { variant: "error" });
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "password-info-popover" : undefined;

  return (
    <Box
      component="form"
      noValidate
      sx={{ mt: 1, width: "100%" }}
      onSubmit={handleSubmit}
    >
      <Grid container mt={5} spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error && error.includes("Password") ? error : ""}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-describedby={id}
                  onClick={handleClick}
                  edge="end"
                >
                  <InfoOutlinedIcon />
                </IconButton>
              ),
            }}
          />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Typography sx={{ p: 2 }}>
              <ul>
                <li>At least 8 characters long</li>
                <li>Must be alphanumeric (contains letters and numbers)</li>
              </ul>
            </Typography>
          </Popover>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="cnf_password"
            label="Confirm password"
            type="password"
            id="cnf_password"
            autoComplete="new-cnf_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error}
            helperText={
              error && error.includes("Passwords do not match") ? error : ""
            }
          />
        </Grid>
      </Grid>
      <Button type="submit" sx={{ mt: 5 }} variant="contained">
        Change Password
      </Button>
      <Copyright sx={{ mt: 5, mx: "auto" }} />
    </Box>
  );
};

export default PasswordForm;

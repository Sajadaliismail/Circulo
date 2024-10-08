import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import {
  months,
  years,
  errorState,
  validateForm,
  formValues,
} from "../../pages/signupUtils";
import { Box } from "@mui/material";
import Copyright from "../CommonComponents/copyright";
import { signupStyle } from "../../pages/Style";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../features/auth/authAsyncThunks";
import { useSnackbar } from "notistack";
import { Logo } from "../CommonComponents/logoComponent";
import { resetErrors, setError } from "../../features/auth/authSlice";
import VerifyOtp from "./verifyOTp";
import { SVGComponent } from "../CommonComponents/svgComponent";
import { motion } from "framer-motion";

function SignUp({ signin }) {
  const [errors, setErrors] = useState(errorState);
  const [formData, setFormData] = useState(formValues);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const { error } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const validatedData = await validateForm(formData);
      if (validatedData) {
        setErrors(validatedData);
        return;
      }
      setErrors(errorState);
      const resultAction = await dispatch(signup(formData));

      if (signup.fulfilled.match(resultAction)) {
        enqueueSnackbar("Signup succesful, OTP send to your Email", {
          variant: "success",
        });
        setShowOTPVerification(true);
        dispatch(resetErrors());
      } else {
        dispatch(setError({ err: "Some unexpected error occured" }));
      }
    } catch (error) {
      dispatch(setError({ err: "Some unexpected error occured" }));
    }
  };

  useEffect(() => {
    Object.values(error).forEach((val) => {
      enqueueSnackbar(val, { variant: "error" });
    });
  }, [error, enqueueSnackbar]);

  function handleInput(e) {
    const { name, value } = e.target;
    const formattedValue =
      name === "firstName" || name === "lastName"
        ? capitalizeFirstLetter(value)
        : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  }

  const capitalizeFirstLetter = (str) => {
    if (typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const renderTextField = (name, label, type = "text") => (
    <TextField
      required
      fullWidth
      name={name}
      label={label}
      type={type}
      id={name}
      autoComplete={name}
      error={errors[name].error}
      helperText={errors[name].error ? errors[name].message : ""}
      value={formData[name]}
      onChange={handleInput}
    />
  );

  const renderSelectField = (name, label, options) => (
    <FormControl fullWidth>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        label={label}
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={formData[name]}
        error={errors[name].error}
        onChange={handleInput}
      >
        {options.map((option) => (
          <MenuItem key={option.value || option} value={option.value || option}>
            {option.label || option}
          </MenuItem>
        ))}
      </Select>
      {errors[name].error && (
        <FormHelperText sx={signupStyle.errorText}>
          {errors[name].message}
        </FormHelperText>
      )}
    </FormControl>
  );

  return (
    <>
      {showOTPVerification ? (
        <VerifyOtp />
      ) : (
        <Box sx={signupStyle.grid}>
          <Logo />
          <Typography component="h1" variant="h5">
            <SVGComponent text={"SIGN UP"} />
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 2, width: "100%" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderTextField("firstName", "First Name")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderTextField("lastName", "Last Name")}
              </Grid>
              <Grid item xs={12}>
                {renderTextField("email", "Email Address", "email")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderTextField("password", "Password", "password")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderTextField(
                  "cnf_password",
                  "Confirm password",
                  "password"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderSelectField("birthMonth", "Birth Month", months)}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderSelectField("birthYear", "Birth Year", years)}
              </Grid>
            </Grid>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "100%" }}
              >
                Sign Up
              </Button>
            </motion.button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  onClick={signin}
                  sx={{ cursor: "pointer" }}
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            <Copyright />
          </Box>
        </Box>
      )}
    </>
  );
}

export default SignUp;

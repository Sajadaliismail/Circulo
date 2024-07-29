import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import FinalStep from "../components/SetupPage/FinalStep";
import ImageUpload from "../components/SetupPage/ImageUpload";
import AddressForm from "../components/SetupPage/PlaceSelectComponent";
import { isLocationValid } from "./Utilitis";
import Navbar from "../components/SetupPage/Navbar";
import { useDispatch } from "react-redux";
import { addressSetup } from "../features/auth/authAsyncThunks";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../features/user/userAsyncThunks";
import { useSnackbar } from "notistack";

const steps = ["Upload Image", "Your Circle", "People in your circle"];

const SetupPage = () => {
  const { firstName } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [croppedImg, setCroppedImg] = useState(null);

  const dispatch = useDispatch();
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 0 && croppedImg) {
      const fileName = Date.now() + "" + firstName;
      fetch(croppedImg)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], fileName, { type: "image/png" });
          dispatch(uploadImage(file));
        })
        .catch((err) =>
          enqueueSnackbar("Error uploading image", { variant: "error" })
        );
    }

    if (activeStep === 1) {
      const validationErrors = isLocationValid(location);
      if (Object.keys(validationErrors).length !== 0) {
        setErrors(validationErrors);
        return;
      } else {
        dispatch(addressSetup(location));
      }
    }
    setErrors({});
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinish = (e) => {
    e.preventDefault();
    //  navigate('/')
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          justifyContent: {
            xs: "flex-start",
            sm: "center",
          },
          alignItems: {
            xs: "center",
            sm: "center",
          },
          height: "100vh",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ my: 3, color: "primary.main", textDecoration: "underline" }}
        >
          Setting up your Account
        </Typography>
        <Box
          component={Paper}
          elevation={8}
          borderRadius={2}
          padding={5}
          sx={{
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <FinalStep />
          ) : (
            <>
              <Box sx={{ mt: 2, mb: 1 }}>
                {activeStep === 0 && (
                  <ImageUpload
                    setCroppedImg={setCroppedImg}
                    croppedImg={croppedImg}
                    name={firstName}
                  />
                )}
                {activeStep === 1 && (
                  <AddressForm
                    errors={errors}
                    setErrors={setErrors}
                    location={location}
                    setLocation={setLocation}
                  />
                )}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                      People around you.
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
                <Button
                  onClick={
                    activeStep === steps.length - 1 ? handleFinish : handleNext
                  }
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SetupPage;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
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
import { motion } from "framer-motion";
import {
  getSuggestions,
  sentRequest,
} from "../features/friends/friendsAsyncThunks";
import { setIsSetupComplete } from "../features/auth/authSlice";

const steps = ["Upload Image", "Your Circle", "People in your circle"];

const SetupPage = () => {
  const navigate = useNavigate();
  const { firstName, lastName } = useSelector((state) => state.auth);
  const { suggestions } = useSelector((state) => state.friends);
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

  const handleNext = async (e) => {
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
        await dispatch(addressSetup(location));
        dispatch(getSuggestions(location.postalCode));
      }
    }
    setErrors({});
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinish = (e) => {
    e.preventDefault();
    dispatch(setIsSetupComplete());
    navigate("/");
  };
  const handleRequest = async (id) => {
    await dispatch(sentRequest({ friendId: id }));
    dispatch(getSuggestions(location.postalCode));
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          height: "100vh",
          backgroundImage: `url("/bg3.jpg")`,
          backgroundSize: "cover",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 0, y: 500 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 50, y: 50 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 5,
            mass: 0.5,
            bounce: 0.5,
          }}
          width={"100%"}
        >
          <Box
            component={Paper}
            elevation={8}
            borderRadius={10}
            padding={5}
            sx={{
              width: "100%",
              maxWidth: "800px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 2,
                color: "Black",
              }}
            >
              {`Hello, ${firstName} ${lastName}! Let’s get started!`}
            </Typography>

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
                      <Box
                        sx={{
                          overflowY: "scroll",
                          scrollbarWidth: "none",
                          height: "30vh",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {suggestions &&
                          suggestions?.map((people) => (
                            <Box
                              key={people.id}
                              display={"flex"}
                              alignItems={"center"}
                              gap={2}
                            >
                              <Avatar src={people?.profilePicture}>
                                {people.firstName[0]}
                              </Avatar>
                              {people.firstName} {people.lastName}
                              <Button
                                disabled={people?.hasRequested}
                                onClick={() => handleRequest(people.id)}
                                sx={{ marginLeft: "auto" }}
                              >
                                {people.hasRequested
                                  ? "Request sent"
                                  : "Connect"}
                              </Button>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}
                >
                  <Button
                    onClick={
                      activeStep === steps.length - 1
                        ? handleFinish
                        : handleNext
                    }
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </motion.div>
      </Box>
    </>
  );
};

export default SetupPage;

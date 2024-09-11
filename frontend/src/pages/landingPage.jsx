import {
  Backdrop,
  CircularProgress,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { landingPageStyles } from "./Style";
import { useSelector } from "react-redux";
import SignInSide from "../components/AuthPageComponents/signIn";
import SignUp from "../components/AuthPageComponents/signup";
import ResetPassword from "../components/AuthPageComponents/resetPassword";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VerifyOtp from "../components/AuthPageComponents/verifyOTp";
import { FlipWords } from "../components/CommonComponents/FlipComponent";

function LandingPage() {
  const { status } = useSelector((state) => state.auth);
  const [component, setComponent] = useState("signin");

  const components = {
    signup: <SignUp signin={() => setComponent("signin")} />,
    resetpassword: <ResetPassword signin={() => setComponent("signin")} />,
    signin: (
      <SignInSide
        resetpassword={() => setComponent("resetpassword")}
        signup={() => setComponent("signup")}
        VerifyOtp={() => setComponent("verifyOtp")}
      />
    ),
    verifyOtp: <VerifyOtp></VerifyOtp>,
  };

  return (
    <>
      {status === "loading" && (
        <Backdrop sx={{ color: "#fff", zIndex: 100 }} open={true}>
          <CircularProgress color="inherit" variant="indeterminate" />
        </Backdrop>
      )}
      <Grid container component="main" sx={landingPageStyles.gridContainer}>
        <CssBaseline />
        <Grid item xs={12} sx={landingPageStyles.backgroundGrid}>
          <Typography variant="h2" sx={landingPageStyles.typography}>
            Your{" "}
            <FlipWords duration={2000} words={["World", "Circle", "Voice"]} />
          </Typography>

          <Grid
            item
            xs={12}
            sm={10}
            md={8}
            lg={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginX: "auto",
              paddingX: { xs: 2, sm: 3, md: 4 },
              paddingY: { xs: 4, sm: 5, md: 6 },
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={component}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4, ease: "backIn" }}
                style={{
                  width: "100%",

                  background:
                    "linear-gradient(0deg, rgba(89,167,167,1) 0%, rgba(207,219,235,1) 50%, rgba(174,197,207,1) 100%)",
                  boxShadow:
                    "0px 6px 10px -2px rgba(0,0,0,0.8), 0px 8px 12px 0px rgba(0,0,0,0.6), 0px 4px 8px 0px rgba(0,0,0,0.8)",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              >
                {components[component]}
              </motion.div>
            </AnimatePresence>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default LandingPage;

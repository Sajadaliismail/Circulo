import {
  Backdrop,
  CircularProgress,
  createTheme,
  CssBaseline,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { landingPageStyles } from "./Style";
import { useSelector } from "react-redux";
import SignInSide from "../components/AuthPageComponents/signIn";
import SignUp from "../components/AuthPageComponents/signup";
import ResetPassword from "../components/AuthPageComponents/resetPassword";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { verifyOtp } from "../features/auth/authAsyncThunks";
import VerifyOtp from "../components/AuthPageComponents/verifyOTp";
const theme = createTheme();

function LandingPage() {
  const { status } = useSelector((state) => state.auth);
  const [component, setComponent] = useState("signin");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
    <ThemeProvider theme={theme}>
      {status === "loading" && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 10 }}
          open={true}
        >
          <CircularProgress color="inherit" variant="indeterminate" />
        </Backdrop>
      )}
      <Grid sx={landingPageStyles.gridContainer}>
        <CssBaseline />
        <Grid item xs={12} sx={landingPageStyles.backgroundGrid}>
          <Typography
            sx={landingPageStyles.typography}
            variant={isSmallScreen ? "h6" : isMediumScreen ? "h4" : "h2"}
          >
            Your World, Your Circle, Your Voice.
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
              paddingX: { xs: 2, sm: 3, md: 4 }, // Responsive padding
              paddingY: { xs: 4, sm: 5, md: 6 }, // Responsive padding
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
                  borderRadius: "50px",
                  marginTop: "10px",
                }}
              >
                {components[component]}
              </motion.div>
            </AnimatePresence>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LandingPage;

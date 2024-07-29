import { Backdrop, CircularProgress, createTheme, CssBaseline, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { landingPageStyles } from "./Style";
import { useSelector } from "react-redux";

const theme = createTheme();

function LandingPage(props) {
  const {status} = useSelector((state)=>state.auth)
  return (
    <ThemeProvider theme={theme}>
{status === 'loading' && (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
    open={true}
  >
    <CircularProgress color="inherit" variant="indeterminate" />
  </Backdrop>
)}
      <Grid container component="main" sx={landingPageStyles.gridContainer}>
        <CssBaseline />
        <Grid item sm={4} md={8} sx={landingPageStyles.backgroundGrid}>
          {["Your World,", "Your Circle,", "Your Voice."].map((text, index) => (
            <Typography  key={index} sx={landingPageStyles.typography} variant="h2">
              {text}
            </Typography>
          ))}
        </Grid>
        <Grid item xs={12} sm={8} md={4} component={Paper} bgcolor={'#e6e8fa'}  sx={{background:'linear-gradient(0deg, rgba(89,167,167,1) 0%, rgba(207,219,235,1) 50%, rgba(174,197,207,1) 100%)'}}  elevation={10} square>
        {props.children}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LandingPage;

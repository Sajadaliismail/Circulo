import { createTheme, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { landingPageStyles } from "./Style";

const theme = createTheme();

function LandingPage(props) {
  return (
    <ThemeProvider theme={theme}>
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

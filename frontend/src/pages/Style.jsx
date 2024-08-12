import { createTheme } from "@mui/material/styles";

export const landingPageStyles = {
  gridContainer: {
    height: "100vh",
  },
  backgroundGrid: {
    backgroundImage: 'url("/bg.png")',
    backgroundColor: (t) =>
      t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "left",
    textAlign: "right",
    paddingRight: "50px",
    paddingTop: "20px",
    display: { xs: "none", sm: "block" },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    textShadow: "4px 4px 4px rgba(0, 0, 0, 0.8)",
    color: "white",
    display: { xs: "none", sm: "block" },
  },
};

export const signupStyle = {
  img: {
    height: "50px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)",
    borderRadius: "10px",
    marginBottom: "5px",
    background:
      "linear-gradient(90deg, rgba(4,102,102,1) 0%, rgba(38,187,217,1) 51%, rgba(2,161,185,1) 100%)",
  },
  grid: {
    my: 8,
    mx: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
  },
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#2196f3",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

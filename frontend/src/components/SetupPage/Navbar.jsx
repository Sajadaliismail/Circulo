import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="default" position="static">
        <Toolbar>
          <img style={{ height: "45px" }} alt="Logo" src="/circulo.png" />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

import { Box, Typography } from "@mui/material";

const FinalStep = () => {
  return (
    <>
      <Typography sx={{ mt: 2, mb: 1 }}>
        All steps completed - you're finished
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}></Box>
    </>
  );
};

export default FinalStep;

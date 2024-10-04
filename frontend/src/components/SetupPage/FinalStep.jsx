import { Box, Typography } from "@mui/material";

const FinalStep = () => {
  return (
    <>
      <Typography sx={{ mt: 2, mb: 1 }}>
        Congrats, You have finished setting up your account.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}></Box>
    </>
  );
};

export default FinalStep;

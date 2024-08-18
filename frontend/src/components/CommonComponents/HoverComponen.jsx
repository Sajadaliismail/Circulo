import { Avatar, Box, Modal, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const HoverComponent = ({ id, component }) => {
  const { userData } = useSelector((state) => state.friends);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      {userData && (
        <Box
          component={Paper}
          elevation={5}
          className={`${component}-${id}`}
          sx={{
            visibility: "hidden",
            textWrap: "nowrap",
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            top: "100%",
            left: 0,
            gap: 2,
            borderStyle: "solid",
            borderColor: "black",
            borderRadius: 3,
            paddingX: 2,
            justifyContent: "space-around",
            zIndex: 1,
          }}
        >
          <Box>
            <Avatar
              sx={{ width: 55, height: 55 }}
              src={userData[id]?.profilePicture}
              onClick={handleOpen}
            >
              {userData[id]?.firstName[0]?.toUpperCase()}
            </Avatar>
          </Box>
          <Box>
            <Typography variant="body1">
              {userData[id]?.firstName} {userData[id]?.lastName}
            </Typography>
            <Typography variant="caption">
              {userData[id]?.city}, {userData[id]?.state},{" "}
              {userData[id]?.country}
            </Typography>
            <Typography variant="subtitle2">{userData[id]?.email}</Typography>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="enlarged-avatar"
            aria-describedby="avatar-in-modal"
          >
            <Box
              component={Paper}
              elevation={5}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                p: 4,
                backgroundColor: "#494f57",
                textAlign: "center",
                fontSize: "25px",
                borderRadius: 5,
                color: "white",
              }}
            >
              <Avatar
                sx={{ width: 400, height: 400, fontSize: 200 }}
                src={userData[id]?.profilePicture}
              >
                {userData[id]?.firstName[0]?.toUpperCase()}
              </Avatar>
              {userData[id]?.firstName} {userData[id]?.lastName}
            </Box>
          </Modal>
        </Box>
      )}
    </>
  );
};

export default HoverComponent;

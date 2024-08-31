import { Avatar, Box, Button, Modal, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnimatedTooltip } from "./AnimatedHoverComponent";

const HoverComponent = ({ id, component }) => {
  const { userData } = useSelector((state) => state.friends);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      {userData[id] && (
        <>
          {/* <AnimatedTooltip item={userData[id]} /> */}
          {/* <Box
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
              top: -50,
              left: 0,
              gap: 2,
              borderStyle: "solid",
              borderColor: "black",
              borderRadius: 3,
              paddingX: 2,
              justifyContent: "space-around",
              zIndex: 100,
              p: 1,
            }}
          >
            <Box>
              <Avatar
                sx={{ width: 55, height: 55 }}
                src={userData[id]?.profilePicture}
                onClick={handleOpen}
              >
                {userData[id]?.firstName &&
                  userData[id]?.firstName[0]?.toUpperCase()}
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
              <Button size="small" onClick={() => navigate(`profile/${id}`)}>
                View Profile
              </Button>
            </Box>
          </Box> */}

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
                zIndex: 1200,
              }}
            >
              <Avatar
                sx={{ width: 400, height: 400, fontSize: 200 }}
                src={userData[id]?.profilePicture}
              >
                {userData[id]?.firstName &&
                  userData[id]?.firstName[0]?.toUpperCase()}
              </Avatar>
              {userData[id]?.firstName} {userData[id]?.lastName}
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default HoverComponent;

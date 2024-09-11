import { Avatar, Box, Modal, Paper } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

const HoverComponent = ({ id, component }) => {
  const { userData } = useSelector((state) => state.friends);

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  return (
    <>
      {userData[id] && (
        <>
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

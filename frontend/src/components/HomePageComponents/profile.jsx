import { Edit, EditNotifications, ModeEdit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Friends from "./friends";

function Profile({ fetchUserData }) {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <CssBaseline />
      <Container>
        <Paper
          elevation={5}
          sx={{ height: "100vh", marginY: "10px", borderRadius: "25px", py: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              "&:hover .overlay": {
                height: "25%",
              },
            }}
          >
            <Avatar
              className="imgUpload"
              src={user?.profilePicture}
              sx={{
                width: 150,
                height: 150,
                fontSize: "10vmin",
              }}
            >
              <Box
                className={"overlay"}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "primary.main",
                  overflow: "hidden",
                  width: "100%",
                  height: 0,
                  transition: ".5s ease",
                  fontSize: "15px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="file-upload"
                  type="file"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    bottom: "-20px",
                    cursor: "pointer",
                  }}
                >
                  <ModeEdit />
                </label>
              </Box>
              {user.firstName[0].toUpperCase()}
            </Avatar>

            <Typography>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography>{user.city}</Typography>
            <Typography>
              {user.state},{user.country}
            </Typography>
            <Typography>{user.email}</Typography>
          </Box>

          <Divider variant="fullWidth"></Divider>
          <Friends fetchUserData={fetchUserData} />
        </Paper>
      </Container>
    </>
  );
}

export default Profile;

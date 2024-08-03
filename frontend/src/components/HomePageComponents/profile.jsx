import { Edit } from "@mui/icons-material";
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

function Profile() {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <CssBaseline />
      <Container>
        <Paper
          elevation={5}
          sx={{ height: "100vh", marginY: "10px", borderRadius: "10px" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={user?.profilePicture}
              sx={{
                width: 150,
                height: 150,
                fontSize: "10vmin",
                "&:hover .edit-button": {
                  opacity: 1,
                },
              }}
            >
              {user.firstName[0].toUpperCase()}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              // onChange={handleImageUpload}
            />
            <label htmlFor="file-upload">
              <IconButton
                component="span"
                className="edit-button"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
              >
                <Edit />
              </IconButton>
            </label>
            <Typography>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography>{user.city}</Typography>
            <Typography>
              {user.state},{user.country}
            </Typography>
          </Box>
          <Divider variant="fullWidth"></Divider>
          <Friends />
        </Paper>
      </Container>
    </>
  );
}

export default Profile;

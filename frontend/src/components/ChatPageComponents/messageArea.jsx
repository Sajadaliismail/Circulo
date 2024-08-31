import { AttachFile, Send } from "@mui/icons-material";
import {
  Grid,
  List,
  Divider,
  TextField,
  Fab,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { RecieverMessageList, SenderMessageList } from "./message";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";

const MessageArea = ({
  handleSubmitImage,
  setImage,
  handleSubmit,
  message,
  setMessage,
  friend,
  messages,
  handleEmoji,
  roomId,
}) => {
  const messageEl = useRef(null);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.friends);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserDetails(friend));
    };

    if (userData[friend]) {
      setUserDetails(userData[friend]);
    } else {
      fetchData().then(() => setUserDetails(userData[friend]));
    }
  }, [friend, userData, dispatch]);

  useEffect(() => {
    if (messageEl.current) {
      messageEl.current.scrollTo({
        top: messageEl.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    handleSubmitImage();
  };

  if (!userDetails) {
    return (
      <Grid
        container
        sx={{
          padding: "20px",
          height: "70vh",
          alignContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginX: "auto" }}>
          Click on any of the chats
        </Typography>
      </Grid>
    );
  }

  return (
    <>
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingLeft: "15px",

            padding: "10px",
          }}
        >
          <Avatar src={userDetails.profilePicture}>
            {userDetails.firstName[0]}
          </Avatar>
          <Typography variant="h6">
            {userDetails.firstName} {userDetails.lastName}
          </Typography>
        </Box>

        <List
          ref={messageEl}
          sx={{
            paddingX: "20px",
            height: "60vh",
            overflowY: "auto",
            flexGrow: 1,
            overflowX: "hidden",
            scrollbarWidth: "none",
          }}
        >
          {messages?.messages?.length ? (
            messages.messages.map((mess) =>
              mess.senderId === friend ? (
                <SenderMessageList
                  key={mess._id}
                  mess={mess}
                  friend={friend}
                  handleEmoji={handleEmoji}
                  roomId={roomId}
                />
              ) : (
                <RecieverMessageList key={mess._id} mess={mess} />
              )
            )
          ) : (
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              No messages
            </Typography>
          )}
        </List>

        <Divider />

        <Grid
          container
          sx={{
            padding: "20px",
          }}
        >
          <Grid item xs={10}>
            <TextField
              id="outlined-basic-email"
              label="Type your message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Grid>

          <Grid item xs={1} align="right">
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="contained-button-file">
              <Fab component="span" color="secondary">
                <AttachFile />
              </Fab>
            </label>
          </Grid>

          <Grid item xs={1} align="right">
            <Fab
              onClick={() => handleSubmit(friend, roomId)}
              color="primary"
              aria-label="send"
            >
              <Send />
            </Fab>
          </Grid>
        </Grid>
      </>
    </>
  );
};

export default MessageArea;

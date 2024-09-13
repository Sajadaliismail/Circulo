import {
  AttachFile,
  Call,
  Image,
  Mic,
  Send,
  Stop,
  Videocam,
} from "@mui/icons-material";
import {
  Grid,
  List,
  Divider,
  TextField,
  Fab,
  Typography,
  Avatar,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { RecieverMessageList, SenderMessageList } from "./message";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";
import VideoCall from "../../pages/VideoCall";
import Menu from "@mui/icons-material/Menu";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleDataAvailable = useCallback((event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  }, []);
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
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        <Typography variant="h4" sx={{ marginX: "auto" }}>
          Click on any of the chats
        </Typography>
      </Box>
    );
  }

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };
  return (
    <>
      <>
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              // onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
          )}
          <Avatar src={userDetails.profilePicture}>
            {userDetails.firstName[0]}
          </Avatar>
          <Typography variant="h6">
            {userDetails.firstName} {userDetails.lastName}
          </Typography>

          <IconButton color="inherit">
            <Call />
          </IconButton>
          <IconButton
            color="inherit"
            //  onClick={handleStartVideoCall}
          >
            <Videocam />
          </IconButton>
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingLeft: "15px",

            padding: "10px",
          }}
        >
          <VideoCall friend={friend} />
        </Box> */}

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
          <Grid item xs={12}>
            <TextField
              id="outlined-basic-email"
              label="Type your message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton component="label">
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Image />
                    </IconButton>
                    <IconButton
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? <Stop /> : <Mic />}
                    </IconButton>
                    <IconButton onClick={() => handleSubmit(friend, roomId)}>
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* <Grid item xs={1} align="right">
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
          </Grid> */}
        </Grid>
      </>
    </>
  );
};

export default MessageArea;

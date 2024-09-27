import {
  ArrowBack,
  AttachFile,
  Call,
  CameraAlt,
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
import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from "react";
import { RecieverMessageList, SenderMessageList } from "./message";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";

import { enqueueSnackbar } from "notistack";
import chatSocket from "../../features/utilities/Socket-io";
import VideoCall from "../../pages/VideoCall";

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
  setDrawerOpen,
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
  const textFieldRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    chatSocket.emit("userIsTyping", {
      id: friend,
      roomId: roomId,
      userIsTyping,
    });
  }, [userIsTyping]);

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

    if (textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.select();
    }
  }, [messages]);

  const handleStartVideoCall = (e) => {
    e.preventDefault();
    if (!isVideoCallActive) {
      setIsVideoCallActive(true);
      setIsCameraOn(true);
    }
  };
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      const fileSize = file.size;

      if (!fileType.startsWith("image/")) {
        enqueueSnackbar("Please select an image file.", { variant: "error" });

        return;
      }

      if (fileSize > 3 * 1024 * 1024) {
        enqueueSnackbar("File size exceeds 3 MB.", { variant: "error" });
        return;
      }
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  if (!userDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <p className="text-2xl   font-semibold">Start a conversation</p>
        <p className="text-lg mt-2">
          No messages yet. Say hi to begin chatting!
        </p>
      </div>
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
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Avatar src={userDetails.profilePicture}>
            {userDetails.firstName[0]}
          </Avatar>
          <Typography variant="h6">
            {userDetails.firstName} {userDetails.lastName}
          </Typography>
          <Box className="ml-auto">
            <IconButton color="inherit">
              <Call />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={(e) => handleStartVideoCall(e)}
            >
              <Videocam />
            </IconButton>
          </Box>
        </Box>

        <List
          ref={messageEl}
          sx={{
            paddingX: "20px",
            height: "65vh",
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
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p className="text-2xl   font-semibold">Start a conversation</p>
              <p className="text-lg mt-2">
                No messages yet. Say hi to begin chatting!
              </p>
            </div>
          )}
        </List>
        <Divider />

        <Grid
          container
          sx={{
            paddingY: "8px",
            paddingX: "10px",
          }}
        >
          <Grid item xs={12} className="dark:text-white">
            {imagePreview && (
              <>
                <img
                  width={200}
                  className="ml-auto"
                  src={imagePreview}
                  alt="pics"
                />
              </>
            )}
            {messages?.isTyping ? (
              <>
                <span className="text-blue-950 dark:text-white flex flex-row flex-nowrap items-center gap-1">
                  <b>{userData[friend]?.firstName} </b> is typing
                  <PulseLoader color="#1976d2" size={5} />
                </span>
              </>
            ) : null}

            <TextField
              label="Type your message"
              className="dark:text-white  dark:placeholder:text-white"
              focused={true}
              fullWidth
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (!userIsTyping) setUserIsTyping(true);
                else if (message.trim().length <= 2) setUserIsTyping(false);
              }}
              inputRef={textFieldRef}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setUserIsTyping(false);
                  handleSubmit(friend, roomId);
                }
              }}
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
                      <Image className="dark:text-white" />
                    </IconButton>
                    <IconButton
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? (
                        <Stop className="dark:text-white" />
                      ) : (
                        <Mic className="dark:text-white" />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        if (imagePreview) {
                          handleSubmitImage();

                          setImagePreview(null);
                        } else {
                          setUserIsTyping(false);
                          handleSubmit(friend, roomId);
                        }
                      }}
                    >
                      <Send className="dark:text-white" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        {isVideoCallActive && (
          <>
            <VideoCall
              isCameraOn={isCameraOn}
              isVideoCallActive={isVideoCallActive}
              setIsCameraOn={setIsCameraOn}
              setIsVideoCallActive={setIsVideoCallActive}
              recipientId={friend}
            />
          </>
        )}
      </>
    </>
  );
};

export default MessageArea;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowBack,
  Call,
  Close,
  Delete,
  DeleteForever,
  DeleteForeverOutlined,
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
  Typography,
  Avatar,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";
import { enqueueSnackbar } from "notistack";
import chatSocket from "../../features/utilities/Socket-io";
import VideoCall from "../../pages/VideoCall";
import { RecieverMessageList, SenderMessageList } from "./message";
import debounce from "lodash/debounce";
import AudioRecorder from "./AudioMessage";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { Button, Card, CardContent } from "@mui/material";
const CHAT_BACKEND = process.env.REACT_APP_CHAT_BACKEND;

const MessageInput = React.memo(
  ({
    message,
    setMessage,
    handleSubmit,
    friend,
    roomId,
    textFieldRef,
    imagePreview,
    setImagePreview,
    handleImageChange,
    isRecording,
    startRecording,
    stopRecording,
    setUserIsTyping,
    handleSubmitImage,
    waveformRef,
    inputDisabled,
    isRecorded,
    sendAudio,
  }) => {
    const debouncedSetUserIsTyping = useMemo(
      () => debounce(setUserIsTyping, 300),
      [setUserIsTyping]
    );

    return (
      <TextField
        label="Type your message"
        className="dark:text-white dark:placeholder:text-white"
        fullWidth
        value={message}
        onChange={(e) => {
          const newMessage = e.target.value;
          setMessage(newMessage);
          debouncedSetUserIsTyping(newMessage.trim().length > 0);
        }}
        inputRef={textFieldRef}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            debouncedSetUserIsTyping.cancel();
            setUserIsTyping(false);
            handleSubmit(friend, roomId);
          }
        }}
        disabled={inputDisabled}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton component="label">
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  disabled={isRecorded}
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
                  if (isRecorded) {
                    sendAudio();
                  } else if (imagePreview) {
                    handleSubmitImage();
                    setImagePreview(null);
                  } else {
                    debouncedSetUserIsTyping.cancel();
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
    );
  }
);

const TypingIndicator = React.memo(({ isTyping, friend }) => {
  if (!isTyping) return null;
  return (
    <span className="text-blue-950 dark:text-white flex flex-row items-center gap-1">
      <b>{friend?.firstName}</b> is typing
      <PulseLoader color="#1976d2" size={5} />
    </span>
  );
});

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

  const textFieldRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [blobData, setBlobData] = useState(null);
  const [isRecorded, setIsRecorded] = useState(false);

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const recordPluginRef = useRef(null);
  const recordedChunks = [];

  const startRecording = async () => {
    console.log("started");
    if (inputDisabled) return;
    setInputDisabled(true);

    try {
      if (waveformRef.current) {
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#2563eb",
          progressColor: "#2563eb",
          cursorColor: "navy",
          barWidth: 3,
          barRadius: 3,
          cursorWidth: 1,
          height: 50,
          barGap: 3,
        });

        wavesurferRef.current.on("click", () => {
          wavesurferRef.current.play();
        });

        recordPluginRef.current = wavesurferRef.current.registerPlugin(
          RecordPlugin.create()
        );

        wavesurferRef.current.on("finish", () => setIsPlaying(false));
      }
      if (recordPluginRef.current) {
        await recordPluginRef.current.startRecording();
        console.log(
          "MediaRecorder state after starting:",
          recordPluginRef.current.mediaRecorder?.state
        );
        setIsRecording(true);
        recordPluginRef.current.mediaRecorder?.addEventListener(
          "dataavailable",
          (event) => {
            console.log(event);

            if (event.data.size > 0) {
              recordedChunks.push(event.data);
              console.log(recordedChunks);
            }
          }
        );
      }
      console.log("no recordplugin");
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = async () => {
    console.log("stopped");
    if (recordPluginRef.current) {
      try {
        await recordPluginRef.current.stopRecording();

        await recordPluginRef.current.mediaRecorder?.addEventListener(
          "dataavailable",
          (event) => {
            if (event.data.size > 0) {
              const newBlob = new Blob([event.data], { type: event.data.type });
              setBlobData(newBlob);
              const audio = URL.createObjectURL(newBlob);
              console.log(audio);
              setIsRecorded(true);
              setAudioUrl(audio);
            }
          }
        );

        if (wavesurferRef.current) {
          // wavesurferRef.current.destroy();
        }

        setIsRecording(false);
      } catch (error) {
        setIsRecording(false);

        console.error("Error stopping recording:", error);
      }
    }
  };

  const sendAudio = async () => {
    try {
      setInputDisabled(false);

      const fileName = `recording-${Date.now()}.webm`;
      const fileType = blobData.type;

      const response = await fetch(
        `${CHAT_BACKEND}/chats/generateAudioUrl?fileName=${encodeURIComponent(
          fileName
        )}&fileType=${encodeURIComponent(fileType)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("Error");
        return;
      }
      const { uploadUrl } = await response.json();

      const responseForUploading = await fetch(uploadUrl, {
        method: "PUT",
        body: blobData,
        headers: {
          "Content-Type": blobData.type,
        },
      });
      if (responseForUploading.ok) {
        const fileUrl = `https://circulo.s3.ap-south-1.amazonaws.com/${fileName}`;
        chatSocket.emit("message", {
          userId: friend,
          message: fileUrl,
          type: "voice",
        });
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
        setBlobData(null);
      } else {
        console.error("Upload failed:", responseForUploading);
      }
      setIsRecorded(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const debouncedEmitTyping = useCallback(
    debounce((isTyping) => {
      chatSocket.emit("userIsTyping", {
        id: friend,
        roomId: roomId,
        userIsTyping: isTyping,
      });
    }, 300),
    [friend, roomId]
  );

  useEffect(() => {
    debouncedEmitTyping(userIsTyping);
    return () => debouncedEmitTyping.cancel();
  }, [userIsTyping, debouncedEmitTyping]);

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
      // textFieldRef.current.select();
    }
  }, [messages]);

  const handleStartVideoCall = useCallback(
    (e) => {
      e.preventDefault();
      if (!isVideoCallActive) {
        setIsVideoCallActive(true);
        setIsCameraOn(true);
      }
    },
    [isVideoCallActive]
  );

  const handleImageChange = useCallback(
    (e) => {
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
        setInputDisabled(true);
        setImage(file);
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
      }
    },
    [setImage]
  );

  const deleteAudioRecorded = () => {
    setInputDisabled(false);

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }
    setIsRecorded(false);
    setAudioUrl(null);
  };
  const removeImage = () => {
    setImagePreview(null);
    setImage(null);
    setInputDisabled(false);
  };

  if (!userDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <p className="text-2xl font-semibold">Start a conversation</p>
        <p className="text-lg mt-2">
          No messages yet. Say hi to begin chatting!
        </p>
      </div>
    );
  }

  return (
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
          <IconButton color="inherit" onClick={handleStartVideoCall}>
            <Videocam />
          </IconButton>
        </Box>
      </Box>

      <List
        ref={messageEl}
        sx={{
          paddingX: "20px",
          height: "70vh",
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
            <p className="text-2xl font-semibold">Start a conversation</p>
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
            <div className="flex flex-row max-h-60 justify-end ">
              <img width={"25%"} src={imagePreview} alt="preview" />
              <Button
                sx={{ height: "20px", marginX: 0, paddingX: 0 }}
                onClick={removeImage}
              >
                <Close />
              </Button>
            </div>
          )}
          {/* {(isRecording || isRecorded) && (
            <AudioRecorder
              setIsRecorded={setIsRecorded}
              onAudioRecorded={handleAudioRecorded}
            />
          )} */}
          <TypingIndicator
            isTyping={messages?.isTyping}
            friend={userData[friend]}
          />
          {/* <AudioRecorder /> */}
          <div className="flex flex-row">
            <div ref={waveformRef} className="w-full" />
            {isRecorded && (
              <button onClick={deleteAudioRecorded}>
                <DeleteForeverOutlined />
              </button>
            )}
          </div>
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSubmit={handleSubmit}
            friend={friend}
            roomId={roomId}
            textFieldRef={textFieldRef}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            handleImageChange={handleImageChange}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            setUserIsTyping={setUserIsTyping}
            handleSubmitImage={handleSubmitImage}
            waveformRef={waveformRef}
            inputDisabled={inputDisabled}
            isRecorded={isRecorded}
            sendAudio={sendAudio}
          />
        </Grid>
      </Grid>
      {isVideoCallActive && (
        <VideoCall
          isCameraOn={isCameraOn}
          isVideoCallActive={isVideoCallActive}
          setIsCameraOn={setIsCameraOn}
          setIsVideoCallActive={setIsVideoCallActive}
          recipientId={friend}
        />
      )}
    </>
  );
};

export default React.memo(MessageArea);

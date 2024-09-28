import React, { useEffect, useRef, useState } from "react";
// import "./ringtone.wav";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Fade,
  Paper,
  Stack,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  DialogActions,
} from "@mui/material";
import TrapFocus from "@mui/material/Unstable_TrapFocus";
import useChatSocket from "../../hooks/chatSocketHook";
import { useSelector } from "react-redux";
import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";

export default function IncomingCallDialog() {
  const {
    incomingCall,
    caller,
    remoteVideoRef,
    handleAccept,
    handleReject,
    callAccepted,
    localVideoRef,
    peer,
    stopCamera,
    setPeer,
    chatSocket,
    localStream,
    isCameraOn,
    setIsCameraOn,
    setAccepted,
    audioRef,
    stopAudio,
  } = useChatSocket();
  const { userData } = useSelector((state) => state.friends);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isMuted, setIsMuted] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval;
    if (callStartTime) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStartTime]);

  const handleEndVideoCall = () => {
    chatSocket.emit("call_ended", { recipientId: caller });
    setIsMuted(false);
    setAccepted(false);
    stopCamera();
    stopAudio();
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
  };

  const toggleCamera = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  };

  const toggleMute = async () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="./ring.mp3" loop />
      <TrapFocus open disableAutoFocus disableEnforceFocus>
        <Fade appear={false} in={incomingCall}>
          <Box
            className="bg-slate-300 shadow-md dark:bg-slate-800 dark:text-white"
            role="dialog"
            aria-modal="false"
            variant="outlined"
            tabIndex={-1}
            sx={{
              zIndex: 500,
              position: "fixed",
              top: 65,
              right: 50,
              left: 50,
              m: 0,
              p: 1,
              borderWidth: 0,
              borderTopWidth: 1,
              borderRadius: 5,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{ justifyContent: "space-around", gap: 2 }}
            >
              <Box sx={{ flexShrink: 1, alignSelf: "center" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Incoming call from {userData[caller]?.firstName}
                </Typography>
              </Box>
              <Stack
                direction={"row"}
                sx={{
                  gap: 2,
                  flexShrink: 0,
                  alignSelf: { xs: "center", sm: "center" },
                }}
              >
                <Button
                  color="success"
                  variant="contained"
                  onClick={(e) => {
                    setCallStartTime(Date.now());
                    handleAccept(e);
                  }}
                >
                  Accept
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </TrapFocus>
      <Dialog
        open={callAccepted}
        PaperProps={{
          style: {
            backgroundColor: "black",
            height: isMobile ? "100%" : "auto",
            maxHeight: isMobile ? "100%" : "80vh",
            margin: 0,
            width: isMobile ? "100%" : 1200,
            maxWidth: isMobile ? "100%" : 1200,
          },
        }}
        fullWidth
      >
        <DialogTitle style={{ color: "white" }}>
          In call with {userData[caller]?.firstName}
          {callStartTime && (
            <span className="text-white ml-auto text-sm block">
              Call Duration: {formatDuration(callDuration)}
            </span>
          )}
        </DialogTitle>
        <DialogContent className="scrollbar-none">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "calc(100vh - 200px)",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: isMobile ? "absolute" : "relative",
                top: 0,
                left: 0,
                width: !isMobile ? "50%" : "100%",
                height: "100%",
                height: "100%",
                zIndex: 2,
              }}
            >
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box
              sx={{
                position: isMobile ? "absolute" : "relative",
                right: isMobile ? 16 : null,
                bottom: isMobile ? 16 : null,
                width: isMobile ? "30%" : "50%",
                aspectRatio: "9/16",
                zIndex: 3,
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  transform: "scaleX(-1)",
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={toggleCamera}
            variant="contained"
            color={isCameraOn ? "error" : "primary"}
            sx={{ mr: 2 }}
          >
            {isCameraOn ? <Videocam /> : <VideocamOff />}
          </Button>
          <Button onClick={toggleMute} variant="contained" sx={{ mr: 2 }}>
            {isMuted ? <Mic /> : <MicOff />}
          </Button>
          <Button
            onClick={handleEndVideoCall}
            color="error"
            variant="contained"
          >
            <CallEnd />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

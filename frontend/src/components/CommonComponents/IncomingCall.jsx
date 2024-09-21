import React, { useState } from "react";
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
    peerConnection,
    stopCamera,
    setPeerConnection,
    chatSocket,
    localStream,
    isCameraOn,
    setIsCameraOn,
    setAccepted,
  } = useChatSocket();
  const { userData } = useSelector((state) => state.friends);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isMuted, setIsMuted] = useState(false);

  const handleEndVideoCall = () => {
    setIsMuted(false);
    setAccepted(false);
    stopCamera();
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      console.log("Closed the WebRTC peer connection");
    }
    chatSocket.emit("call-ended", { caller });
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
      <TrapFocus open disableAutoFocus disableEnforceFocus>
        <Fade appear={false} in={incomingCall}>
          <Box
            className="bg-slate-300 shadow-md dark:bg-slate-800 dark:text-white "
            role="dialog"
            aria-modal="false"
            variant="outlined"
            tabIndex={-1}
            sx={{
              zIndex: 100,
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
              <Box
                sx={{
                  flexShrink: 1,
                  alignSelf: "center",
                }}
              >
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
                  onClick={handleAccept}
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
            margin: isMobile ? "0px" : "0px",
            width: isMobile ? "100%" : 1200,
            maxWidth: isMobile ? "100%" : 1200,
          },
        }}
        fullWidth
      >
        <DialogTitle>In call with {userData[caller]?.firstName}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              height: isMobile ? "calc(100vh - 200px)" : "60vh",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: isMobile ? "50%" : "50%",
                height: isMobile ? "20%" : "100%",
                position: isMobile ? "absolute" : "relative",
                bottom: isMobile ? 10 : 0,
                right: isMobile ? 90 : 0,
                zIndex: isMobile ? 1 : "auto",
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
                  objectFit: "contain",
                  transform: isMobile ? "scaleX(-1)" : "none",
                }}
              />
            </Box>
            <Box
              sx={{
                width: isMobile ? "100%" : "50%",
                height: "100%",
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
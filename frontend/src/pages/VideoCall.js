import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import chatSocket from "../features/utilities/Socket-io";
import { useSelector } from "react-redux";

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.l.google.com:5349" },
    { urls: "stun:stun1.l.google.com:3478" },
    { urls: "stun:stun1.l.google.com:5349" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:5349" },
    { urls: "stun:stun3.l.google.com:3478" },
    { urls: "stun:stun3.l.google.com:5349" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:5349" },
  ],
};

const VideoCall = ({
  isVideoCallActive,
  isCameraOn,
  setIsVideoCallActive,
  setIsCameraOn,
  recipientId,
}) => {
  const { userData } = useSelector((state) => state.friends);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCalling, setIscalling] = useState(false);
  const [isRinging, setIsRinging] = useState("Calling...");
  const [isMuted, setIsMuted] = useState(false);
  const [remoteError, setRemoteError] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callAnswered, setCallAnswered] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [timer, setTimer] = useState(0);
  let mounted = false;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    let interval = null;

    if (timerStart) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!timerStart && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerStart, timer]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };
  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    setIsCameraOn(false);
    setIsMuted(false);
    stopCamera();
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      console.log("Closed the WebRTC peer connection");
    }
    chatSocket.emit("call-hung", { recipientId });
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

  useEffect(() => {
    const makeCall = async () => {
      const pc = new RTCPeerConnection(configuration);

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        if (remoteStream) {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        } else {
          setRemoteError("No remote stream available");
          console.error("No remote stream available");
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const data = { recipientId, candidate: event.candidate };
          chatSocket.emit("ice-candidate", data);
        }
      };

      setPeerConnection(pc);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setLocalStream(stream);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const data = { recipientId, offer };
        chatSocket.emit("start-call", data);
      } catch (error) {
        console.error("Error getting media stream:", error);
      }
    };

    chatSocket.on("callFailed", () => {
      setIsRinging("Not reachable now.");
    });

    if (!mounted) {
      makeCall();
      mounted = true;
    }

    return () => {
      chatSocket.off("callFailed");
      stopCamera();
    };
  }, []);

  useEffect(() => {
    const handleAnswer = async (answer) => {
      console.log("call answered");

      setCallAnswered(true);
      if (peerConnection) {
        const answerDesc = new RTCSessionDescription(answer);
        try {
          await peerConnection.setRemoteDescription(answerDesc);
          console.log("Answer successfully set as remote description");
          setTimerStart(true);
        } catch (error) {
          console.error("Error setting remote description for answer:", error);
        }
      }
    };

    const handleCallStatus = async (data) => {
      console.log(data, "ethy");

      setIsRinging(data.message);
    };

    chatSocket.on("callAnswered", handleAnswer);
    chatSocket.on("user_status", handleCallStatus);
    return () => {
      chatSocket.off("callAnswered", handleAnswer);
      chatSocket.off("user_status", handleCallStatus);
    };
  }, [peerConnection]);

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setLocalStream(null);
  };

  return (
    <Dialog
      open={isVideoCallActive}
      fullWidth
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
    >
      <DialogTitle style={{ color: "white" }}>
        Video Call with {userData[recipientId]?.firstName}
        <Typography color="white">{isRinging}</Typography>
        {timerStart && (
          <span className="text-white font-thin text-sm">
            In call: {formatTime(timer)}
          </span>
        )}
      </DialogTitle>
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
              width: isCalling || isMobile ? "100%" : "50%",
              height: isMobile && callAnswered ? "20%" : "100%",
              position: isMobile && callAnswered ? "absolute" : "relative",
              bottom: isMobile && callAnswered ? 10 : 0,
              left: isMobile && callAnswered ? 90 : 0,
              zIndex: isMobile && callAnswered ? 1 : "auto",
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
                transform: isMobile && !isCalling ? "scaleX(-1)" : "none",
              }}
            />
          </Box>
          {callAnswered && (
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
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button
          onClick={toggleCamera}
          variant="contained"
          color={isCameraOn ? "error" : "primary"}
          sx={{ mr: 2 }}
        >
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </Button>
        <Button
          onClick={toggleMute}
          variant="contained"
          color={isMuted ? "warning" : "primary"}
          sx={{ mr: 2 }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </Button>
        <Button onClick={handleEndVideoCall} color="error" variant="contained">
          End Call
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoCall;

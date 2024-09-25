import React, { useEffect, useRef, useState, useCallback } from "react";
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
import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";
import chatSocket from "../features/utilities/Socket-io";
import { useSelector } from "react-redux";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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
  const [isRinging, setIsRinging] = useState("Calling...");
  const [isMuted, setIsMuted] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callAnswered, setCallAnswered] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [timer, setTimer] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const remoteStreamRef = useRef(new MediaStream());

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

  const handleEndVideoCall = useCallback(() => {
    setIsVideoCallActive(false);
    setIsCameraOn(false);
    setIsMuted(false);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }
    chatSocket.emit("call_ended", { recipientId });
  }, [
    setIsVideoCallActive,
    setIsCameraOn,
    localStream,
    peerConnection,
    recipientId,
  ]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  }, [localStream, isCameraOn, setIsCameraOn]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  }, [localStream, isMuted]);

  useEffect(() => {
    const makeCall = async () => {
      const pc = new RTCPeerConnection(configuration);

      pc.ontrack = (event) => {
        console.log(`Received ${event.track.kind} track`);
        remoteStreamRef.current.addTrack(event.track);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }

        event.streams.forEach((stream, index) => {
          console.log(`Stream ${index}:`, stream.id);
          stream.getTracks().forEach((track) => {
            console.log(`  Track:`, track.kind, track.id);
          });
        });
      };

      pc.oniceconnectionstatechange = () => {
        console.log("ICE Connection State: ", pc.iceConnectionState);
      };

      pc.onsignalingstatechange = () => {
        console.log("Signaling State: ", pc.signalingState);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("New ICE candidate:", event.candidate);
          chatSocket.emit("ice-candidate", {
            recipientId,
            candidate: event.candidate,
          });
        }
      };

      setPeerConnection(pc);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        chatSocket.emit("start-call", { recipientId, offer });
      } catch (error) {
        console.error("Error getting media stream:", error);
      }
    };

    if (isVideoCallActive) {
      makeCall();
    }

    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoCallActive, recipientId]);

  useEffect(() => {
    const handleAnswer = async (answer) => {
      if (peerConnection && peerConnection.signalingState !== "closed") {
        try {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          console.log("Answer set as remote description");
          setCallAnswered(true);
          setTimerStart(true);
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      }
    };

    const handleIceCandidate = async (data) => {
      console.log("Received ICE candidate:", data.candidate);
      if (peerConnection && peerConnection.remoteDescription) {
        try {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
          console.log("ICE candidate added");
        } catch (error) {
          console.error("Error adding received ice candidate", error);
        }
      }
    };

    chatSocket.on("callAnswered", handleAnswer);
    chatSocket.on("ice-candidate", handleIceCandidate);

    return () => {
      chatSocket.off("callAnswered", handleAnswer);
      chatSocket.off("ice-candidate", handleIceCandidate);
    };
  }, [peerConnection]);

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
              width: !callAnswered || isMobile ? "100%" : "50%",
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
                transform: isMobile && callAnswered ? "scaleX(-1)" : "none",
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
          color={isCameraOn ? "primary" : "error"}
          sx={{ mr: 2 }}
        >
          {isCameraOn ? <Videocam /> : <VideocamOff />}
        </Button>
        <Button
          onClick={toggleMute}
          variant="contained"
          color={isMuted ? "error" : "primary"}
          sx={{ mr: 2 }}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>
        <Button onClick={handleEndVideoCall} color="error" variant="contained">
          <CallEnd />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoCall;

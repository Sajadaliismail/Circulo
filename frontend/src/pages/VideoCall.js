"use client";

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
import SimplePeer from "simple-peer/simplepeer.min.js";
import chatSocket from "../features/utilities/Socket-io";
import { useSelector } from "react-redux";

const VideoCall = ({
  isVideoCallActive,
  isCameraOn,
  setIsVideoCallActive,
  setIsCameraOn,
  recipientId,
}) => {
  const { userData } = useSelector((state) => state.friends);
  const [localStream, setLocalStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const startVideoCall = async () => {
      console.log("Starting video call");

      const newPeer = new SimplePeer({
        initiator: true,
        trickle: true,
        video: true,
        audio: true,
      });

      console.log("New peer created");

      newPeer.on("connect", () => {
        console.log("Connected to peer");
        setCallStartTime(Date.now());
      });

      newPeer.on("signal", (data) => {
        console.log("Signal event fired:", data);
        chatSocket.emit("start-call", { recipientId, offer: data });
      });

      newPeer.on("stream", (stream) => {
        console.log("Stream received from peer");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          console.log("Remote video stream added to video element");
        }
      });

      newPeer.on("error", (err) => {
        console.error("Peer connection error:", err);
      });

      newPeer.on("close", () => {
        console.log("Peer connection closed");
        handleEndVideoCall();
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Media stream obtained");

        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        newPeer.addStream(stream);
      } catch (error) {
        console.error("Error getting media stream:", error);
      }

      setPeer(newPeer);
    };

    if (isVideoCallActive) {
      startVideoCall();
    }

    return () => {
      if (peer) {
        peer.destroy();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoCallActive, recipientId]);

  useEffect(() => {
    const handleAnswer = (answer) => {
      console.log("Call answered", answer);
      if (peer) {
        peer.signal(answer);
      }
    };

    const handleIceCandidate = (data) => {
      console.log("ICE candidate received", data);
      if (peer) {
        peer.signal(data.candidate);
      }
    };

    const handleCallEnded = () => {
      console.log("Call ended by the other user");
      handleEndVideoCall();
    };

    chatSocket.on("callAnswered", handleAnswer);
    chatSocket.on("ice-candidate-reciever", handleIceCandidate);
    chatSocket.on("call_ended", handleCallEnded);

    return () => {
      chatSocket.off("callAnswered", handleAnswer);
      chatSocket.off("ice-candidate-reciever", handleIceCandidate);
      chatSocket.off("call_ended", handleCallEnded);
    };
  }, [peer]);

  useEffect(() => {
    let interval;
    if (callStartTime) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStartTime]);

  const handleEndVideoCall = useCallback(() => {
    console.log("Ending video call");
    setIsVideoCallActive(false);
    setIsCameraOn(false);
    setIsMuted(false);
    setCallStartTime(null);
    setCallDuration(0);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peer) {
      try {
        peer.destroy();
        console.log("Peer connection destroyed successfully");
      } catch (error) {
        console.error("Error destroying peer connection:", error);
      }
    }
    chatSocket.emit("call_ended", { recipientId });
  }, [setIsVideoCallActive, setIsCameraOn, localStream, peer, recipientId]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
        console.log("Camera toggled:", !isCameraOn);
      }
    }
  }, [localStream, isCameraOn, setIsCameraOn]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
        setIsMuted(!isMuted);
        console.log("Microphone toggled:", !isMuted);
      }
    }
  }, [localStream, isMuted]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
        {callStartTime && (
          <Typography variant="subtitle1" style={{ color: "white" }}>
            Call Duration: {formatDuration(callDuration)}
          </Typography>
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
          <Box sx={{ width: !peer ? "100%" : "50%", height: "100%" }}>
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
          <Box sx={{ width: isMobile ? "100%" : "50%", height: "100%" }}>
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

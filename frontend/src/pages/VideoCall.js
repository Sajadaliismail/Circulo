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
// import SimplePeer from "simple-peer";
import SimplePeer from "simple-peer/simplepeer.min.js";

import chatSocket from "../features/utilities/Socket-io";
import { useSelector } from "react-redux";

export default function VideoCall({
  isVideoCallActive,
  isCameraOn,
  setIsVideoCallActive,
  setIsCameraOn,
  recipientId,
}) {
  const { userData } = useSelector((state) => state.friends);
  const [localStream, setLocalStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [answered, setAnswered] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const startVideoCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const newPeer = new SimplePeer({
          initiator: true,
          trickle: true,
          stream,
          config: {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          },
        });

        newPeer.on("signal", (data) => {
          if (data.type === "offer" || data.type === "answer") {
            chatSocket.emit("start-call", { recipientId, offer: data });
          } else {
            chatSocket.emit("ice-candidate", {
              recipientId,
              candidate: data,
              type: "toReciever",
            });
          }
        });

        newPeer.on("stream", (remoteStream) => {
          console.log("stream recieved");

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        newPeer.on("error", (err) =>
          console.error("Peer connection error:", err)
        );
        newPeer.on("close", handleEndVideoCall);

        setPeer(newPeer);
      } catch (error) {
        console.error("Error starting video call:", error);
      }
    };

    if (isVideoCallActive) {
      startVideoCall();
    }

    return () => {
      if (peer) peer.destroy();
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
    };
  }, [isVideoCallActive, recipientId]);

  useEffect(() => {
    const handleAnswer = (answer) => {
      setAnswered(true);
      setCallStartTime(Date.now());
      if (peer) peer.signal(answer);
    };

    const handleIceCandidate = (data) => {
      if (peer) peer.signal(data.candidate);
    };

    chatSocket.on("callAnswered", handleAnswer);
    chatSocket.on("ice-candidate-toCaller", handleIceCandidate);
    chatSocket.on("call_ended", handleEndVideoCall);

    return () => {
      chatSocket.off("callAnswered", handleAnswer);
      chatSocket.off("ice-candidate-toCaller", handleIceCandidate);
      chatSocket.off("call_ended", handleEndVideoCall);
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
    setIsVideoCallActive(false);
    setIsCameraOn(false);
    setIsMuted(false);
    setCallStartTime(null);
    setCallDuration(0);
    setAnswered(false);
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (peer) peer.destroy();
    chatSocket.emit("call_ended", { recipientId });
  }, [setIsVideoCallActive, setIsCameraOn, localStream, peer, recipientId]);

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
      maxWidth={false}
      PaperProps={{
        style: {
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          margin: 0,
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle style={{ color: "white" }}>
        Video Call with {userData[recipientId]?.firstName}
      </DialogTitle>
      {callStartTime && (
        <Typography variant="subtitle1" style={{ color: "white" }}>
          Call Duration: {formatDuration(callDuration)}
        </Typography>
      )}
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 200px)",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: answered ? 1 : 2,
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
              position: isMobile && answered ? "absolute" : "relative",
              right: isMobile && answered ? 16 : null,
              bottom: isMobile && answered ? 16 : null,
              width: isMobile && answered ? "30%" : "100%",
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
}

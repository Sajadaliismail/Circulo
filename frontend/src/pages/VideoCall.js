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
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const startVideoCall = async () => {
      // Create a new SimplePeer instance
      const newPeer = new SimplePeer({
        initiator: true, // Set to true if this peer is initiating the connection
        trickle: false, // Disable trickle ICE
        video: true,
        audio: true,
      });

      // Handling stream events
      newPeer.on("stream", (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });

      // Get local media stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Add local stream to peer
        stream.getTracks().forEach((track) => newPeer.addTrack(track, stream));

        // Handle signaling
        newPeer.on("signal", (data) => {
          chatSocket.emit("start-call", { recipientId, offer: data });
        });
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
      if (peer) {
        peer.signal(answer); // Signal the answer to the peer
      }
    };

    const handleIceCandidate = (data) => {
      if (peer) {
        peer.signal(data.candidate); // Signal the ICE candidate to the peer
      }
    };

    chatSocket.on("callAnswered", handleAnswer);
    chatSocket.on("ice-candidate-reciever", handleIceCandidate);

    return () => {
      chatSocket.off("callAnswered", handleAnswer);
      chatSocket.off("ice-candidate-reciever", handleIceCandidate);
    };
  }, [peer]);

  const handleEndVideoCall = useCallback(() => {
    setIsVideoCallActive(false);
    setIsCameraOn(false);
    setIsMuted(false);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    try {
      peer.destroy();
      console.log("Peer connection destroyed successfully.");
    } catch (error) {
      console.error("Error destroying peer connection:", error);
    }
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

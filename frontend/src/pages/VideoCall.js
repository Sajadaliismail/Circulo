import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: process.env.REACT_APP_TURN_SERVERS_USERNAME,
      credential: process.env.REACT_APP_TURN_SERVERS_PASSWORD,
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: process.env.REACT_APP_TURN_SERVERS_USERNAME,
      credential: process.env.REACT_APP_TURN_SERVERS_PASSWORD,
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: process.env.REACT_APP_TURN_SERVERS_USERNAME,
      credential: process.env.REACT_APP_TURN_SERVERS_PASSWORD,
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: process.env.REACT_APP_TURN_SERVERS_USERNAME,
      credential: process.env.REACT_APP_TURN_SERVERS_PASSWORD,
    },
  ],
};

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
  const audioRef = useRef(null);

  const playAudio = () => {
    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const startVideoCall = async () => {
      // console.log(chatSocket.active, "socketactive");

      playAudio();
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
          trickle: false,
          stream,
          config,
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
          // console.log("stream recieved");

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        newPeer.on("error", (err) => {
          console.error("SimplePeer error:", err);
          if (err.message.includes("User-Initiated Abort")) {
            // console.log("User closed the peer connection.");
            handleEndVideoCall();
          }
        });

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
      stopAudio();
      setAnswered(true);
      setCallStartTime(Date.now());
      if (peer) peer.signal(answer);
    };

    const handleIceCandidate = (data) => {
      if (peer) {
        if (data.candidate) {
          const candidate = new RTCIceCandidate(data.candidate);
          peer.signal({ candidate });
        }
      }
    };

    chatSocket.on("callAnswered", handleAnswer);
    chatSocket.on("ice-candidate-toCaller", handleIceCandidate);
    chatSocket.on("call_hangup", handleEndVideoCall);

    return () => {
      chatSocket.off("callAnswered", handleAnswer);
      chatSocket.off("ice-candidate-toCaller", handleIceCandidate);
      chatSocket.off("call_hangup", handleEndVideoCall);
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
    stopAudio();
    setIsVideoCallActive(false);
    setIsCameraOn(false);
    setIsMuted(false);
    setCallStartTime(null);
    setCallDuration(0);
    setAnswered(false);
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (peer) peer.destroy();
    chatSocket.emit("call_ended", { recipientId: recipientId });
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
    <>
      <audio ref={audioRef} src="./callTune.mp3" loop />
      <Dialog
        open={isVideoCallActive}
        fullWidth
        // maxWidth={false}
        PaperProps={{
          style: {
            backgroundColor: "black",
            height: isMobile ? "100%" : "auto",
            maxHeight: isMobile ? "100%" : "80vh",
            margin: "0px",
            width: isMobile ? "100%" : 1200,
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle style={{ color: "white" }}>
          Video Call with {userData[recipientId]?.firstName}
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
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Box
              sx={{
                position: isMobile && answered ? "absolute" : "relative",
                right: isMobile && answered ? 16 : null,
                bottom: isMobile && answered ? 16 : null,
                width: isMobile && answered ? "30%" : isMobile ? "100%" : "50%",
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

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
import Webcam from "react-webcam";
import chatSocket from "../features/utilities/Socket-io";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

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
  const [isCalling, setIscalling] = useState(false);
  const [isRinging, setIsRinging] = useState("Calling...");
  const [remoteUrl, setRemoteUrl] = useState(null);
  const localVideoRef = useRef(null);
  const webcamRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        localStream.removeTrack(track);
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      setLocalStream(null);
    }
  };
  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    setIsCameraOn(false);

    stopCamera();

    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      console.log("Closed the WebRTC peer connection");
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null; // Clear the remote video element
    }

    //   navigator.mediaDevices
    //     .getUserMedia({ audio: true, video: true })
    //     .then((stream) => {
    //       stream.getTracks().forEach((track) => {
    //         track.stop();
    //       });
    //     })
    //     .catch((error) => console.error("Error accessing media devices:", error));

    //   // Release camera and microphone
    //   navigator.mediaDevices
    //     .getUserMedia({ audio: false, video: false })
    //     .then(() => {
    //       console.log("Camera and microphone access released");
    //     })
    //     .catch((error) => console.error("Error releasing media devices:", error));
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  useEffect(() => {
    const makeCall = async () => {
      // Initialize RTCPeerConnection first
      const pc = new RTCPeerConnection(configuration);
      console.log(pc);

      pc.ontrack = (event) => {
        console.log("Remote stream added:", event);
        const remoteStream = event.streams[0];
        if (remoteStream) {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            console.log("Remote stream set to video element");
          }
          setRemoteUrl(remoteStream);
        } else {
          console.error("No remote stream available");
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const data = { recipientId, candidate: event.candidate };
          chatSocket.emit("ice-candidate", data);
        }
      };

      // Store the peer connection in the state so it can be referenced later
      setPeerConnection(pc);

      // Acquire media stream
      await navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(async (stream) => {
          // Set local video stream
          localVideoRef.current.srcObject = stream;
          setLocalStream(stream);

          // Add media tracks to the peer connection
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));

          // Create and send offer after setting the local description
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          const data = { recipientId, offer };
          chatSocket.emit("start-call", data);
        })
        .catch((error) => {
          console.error("Error getting media stream:", error);
        });
    };

    // Listen for failed calls
    chatSocket.on("callFailed", () => {
      setIsRinging("Not reachable now.");
    });

    // Start the call
    makeCall();
  }, [isCalling, chatSocket]);

  useEffect(() => {
    const handleAnswer = async (answer) => {
      if (peerConnection) {
        const answerDesc = new RTCSessionDescription(answer);

        try {
          const connectionState = peerConnection.signalingState;
          console.log(`Connection state: ${connectionState}`);

          await peerConnection.setRemoteDescription(answerDesc);

          console.log("Answer successfully set as remote description");
        } catch (error) {
          console.error("Error setting remote description for answer:", error);
        }
      }
    };

    chatSocket.on("callAnswered", handleAnswer);
    return () => chatSocket.off("callAnswered", handleAnswer);
  });

  return (
    <Dialog
      open={isVideoCallActive}
      // onClose={handleEndVideoCall}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "black",
          height: isMobile ? "100%" : "auto",
          maxHeight: isMobile ? "100%" : "80vh",
        },
      }}
    >
      <DialogTitle style={{ color: "white" }}>
        Video Call with {userData[recipientId]?.firstName}
        <Typography color="white">{isRinging}</Typography>
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
              height: isMobile && !isCalling ? "20%" : "100%",
              position: isMobile && !isCalling ? "absolute" : "relative",
              top: isMobile && !isCalling ? 10 : 0,
              right: isMobile && !isCalling ? 10 : 0,
              zIndex: isMobile && !isCalling ? 1 : "auto",
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
                transform: isMobile && !isCalling ? "scaleX(-1)" : "none",
              }}
            />
          </Box>
          {/* {!isCalling && ( */}
          <Box
            sx={{
              width: isMobile ? "100%" : "50%",
              height: isMobile ? "80%" : "100%",
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
          {/* )}   */}
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
        <Button onClick={handleEndVideoCall} color="error" variant="contained">
          End Call
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoCall;

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import chatSocket from "../features/utilities/Socket-io";

const VideoCall = ({
  isVideoCallActive,
  isCameraOn,
  setIsVideoCallActive,
  setIsCameraOn,
  recipientId,
}) => {
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const webcamRef = useRef(null);

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    setIsCameraOn(false);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleUserMedia = (stream) => {
    setLocalStream(stream);
  };

  useEffect(() => {
    const makeCall = async () => {
      if (localStream) {
        const pc = new RTCPeerConnection();

        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            chatSocket.emit("ice-candidate", {
              recipientId,
              candidate: event.candidate,
            });
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        chatSocket.emit("start-call", { recipientId, offer });

        setPeerConnection(pc);
      }
    };

    makeCall();
  }, [localStream]);

  return (
    <Dialog
      open={isVideoCallActive}
      // onClose={handleEndVideoCall}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Video Call with </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: "100%",
            height: 400,
            bgcolor: "black",
            position: "relative",
          }}
        >
          {isCameraOn ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={{ facingMode: "user" }}
              onUserMedia={handleUserMedia}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography color="white">Camera is off</Typography>
          )}
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            onClick={toggleCamera}
            variant="contained"
            color={isCameraOn ? "error" : "primary"}
            sx={{ mr: 2 }}
          >
            {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </Button>
          <video ref={localVideoRef} autoPlay muted />
          <video ref={remoteVideoRef} autoPlay />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEndVideoCall} color="error" variant="contained">
          End Call
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoCall;

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

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    setIsCameraOn(false);
    setIscalling(false);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleUserMedia = (stream) => {
    setLocalStream(stream);
    setIscalling(true);
  };

  useEffect(() => {
    const makeCall = async () => {
      if (localStream) {
        const pc = new RTCPeerConnection(configuration);

        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));

        pc.ontrack = (event) => {
          const remoteStream = event.streams[0];
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          if (remoteStream) {
            setRemoteUrl(remoteStream);
          }
          // console.log(event, "event");
          // if (remoteVideoRef.current) {
          //   remoteVideoRef.current.srcObject = event.streams[0];
          // }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const data = { recipientId, candidate: event.candidate };
            chatSocket.emit("ice-candidate", data);
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const data = { recipientId, offer };
        chatSocket.emit("start-call", data);

        setPeerConnection(pc);
      }
    };

    chatSocket.on("callFailed", async () => {
      // enqueueSnackbar("not online", { variant: "info" });
      setIsRinging("Not reachable now.");
      console.log("1");
    });

    makeCall();
  }, [isCalling, chatSocket]);

  useEffect(() => {
    console.log("running answred");

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
  });

  return (
    <Dialog
      open={isVideoCallActive}
      // onClose={handleEndVideoCall}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Video Call with {userData[recipientId]?.firstName}
        <Typography>{isRinging}</Typography>
      </DialogTitle>

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
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "auto" }}
          />
          {/* {remoteUrl && <ReactPlayer url={remoteUrl} autoPlay />} */}
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

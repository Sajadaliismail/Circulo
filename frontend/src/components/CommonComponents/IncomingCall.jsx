import React from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import useChatSocket from "../../hooks/chatSocketHook";
import Webcam from "react-webcam";
import ReactPlayer from "react-player";

export default function IncomingCallDialog() {
  const {
    incomingCall,
    setIncomingCall,
    caller,
    handleAcceptCall,
    remoteUrl,
    webcamRef,
    setLocalStream,
    remoteVideoRef,
  } = useChatSocket();

  const handleUserMedia = (stream) => {
    setLocalStream(stream);
  };

  return (
    <Dialog open={incomingCall} maxWidth="md" fullWidth>
      <DialogTitle>Incoming call from {caller}</DialogTitle>
      <DialogContent>
        <Button variant="contained" color="primary" onClick={handleAcceptCall}>
          Accept Call
        </Button>
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{ facingMode: "user" }}
          onUserMedia={handleUserMedia}
          style={{
            width: "100%",
            height: "300px",
            backgroundColor: "lightgray",
            marginTop: "20px",
          }}
        />
        {/* {remoteUrl && <ReactPlayer url={remoteUrl} autoPlay />} */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "100%", height: "auto" }}
        />

        <Button
          onClick={() => setIncomingCall(false)}
          style={{ marginTop: "20px" }}
        >
          Hang up
        </Button>
      </DialogContent>
    </Dialog>
  );
}

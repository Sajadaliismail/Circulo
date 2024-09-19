import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Fade,
  Paper,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import TrapFocus from "@mui/material/Unstable_TrapFocus";
import useChatSocket from "../../hooks/chatSocketHook";
import Webcam from "react-webcam";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";

export default function IncomingCallDialog() {
  const {
    incomingCall,
    setIncomingCall,
    caller,
    setLocalStream,
    remoteVideoRef,
    handleAccept,
    handleReject,
    callAccepted,
    localVideoRef,
  } = useChatSocket();
  const { userData } = useSelector((state) => state.friends);

  const handleUserMedia = async (stream) => {
    setLocalStream(stream);
  };

  return (
    <>
      <TrapFocus open disableAutoFocus disableEnforceFocus>
        <Fade appear={false} in={incomingCall}>
          <Box
            className="bg-slate-300 shadow-md dark:bg-slate-800 dark:text-white "
            role="dialog"
            aria-modal="false"
            variant="outlined"
            tabIndex={-1}
            sx={{
              zIndex: 100,
              position: "fixed",
              top: 65,
              right: 50,
              left: 50,
              m: 0,
              p: 1,
              borderWidth: 0,
              borderTopWidth: 1,
              borderRadius: 5,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{ justifyContent: "space-around", gap: 2 }}
            >
              <Box
                sx={{
                  flexShrink: 1,
                  alignSelf: "center",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Incoming call from {userData[caller]?.firstName}
                </Typography>
              </Box>
              <Stack
                direction={"row"}
                sx={{
                  gap: 2,
                  flexShrink: 0,
                  alignSelf: { xs: "center", sm: "center" },
                }}
              >
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleAccept}
                >
                  Accept
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </TrapFocus>
      <Dialog open={callAccepted} maxWidth="md" fullWidth>
        <DialogTitle>In call with {userData[caller]?.firstName}</DialogTitle>
        <DialogContent>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleAcceptCall(e)}
          >
            Accept Call
          </Button> */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // transform: isMobile && !isCalling ? "scaleX(-1)" : "none",
            }}
          />
          {/* {remoteUrl && <ReactPlayer url={remoteUrl} autoPlay />} */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "300px" }}
          />

          <Button onClick={handleReject} style={{ marginTop: "20px" }}>
            Hang up
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

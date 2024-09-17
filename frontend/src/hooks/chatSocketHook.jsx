// src/hooks/useChatSocket.js
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import chatSocket from "../features/utilities/Socket-io";
import { fetchUser } from "../features/user/userAsyncThunks";
import { useRecoilState } from "recoil";
import { ChatRoomMessages } from "../atoms/chatAtoms";
import { setStatus } from "../features/friends/friendsSlice";
import { useSnackbar } from "notistack";
// import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
// import Webcam from "react-webcam";

const useChatSocket = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [socketConnected, setSocketConnected] = useState(false);
  const [chatMessages, setChatMessages] = useRecoilState(ChatRoomMessages);
  const [incomingCall, setIncomingCall] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [caller, setCaller] = useState(null);
  const remoteVideoRef = useRef(null);
  const webcamRef = useRef(null);
  // const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const dispatch = useDispatch();

  const handleUserMedia = () => {
    // setlocal
  };
  const handleAcceptCall = async () => {
    console.log(peerConnection, offerDetails);

    if (peerConnection && offerDetails) {
      try {
        if (offerDetails.sdp && offerDetails.type === "offer") {
          const offerDesc = new RTCSessionDescription({
            type: "offer",
            sdp: offerDetails.sdp,
          });

          await peerConnection.setRemoteDescription(offerDesc);

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          const data = {
            recipientId: caller,
            answer,
          };
          chatSocket.emit("answer", data);
          // setIncomingCall(false); // Hide incoming call UI
        } else {
          throw new Error("Invalid offer details");
        }
      } catch (error) {
        console.error("Error accepting call:", error);
      }
    }
  };

  const handleIncomingCall = async ({ offer, senderId }) => {
    console.log("incoming call");

    setIncomingCall(true);
    setOfferDetails(offer);
    setCaller(senderId);

    if (!peerConnection) {
      const pc = new RTCPeerConnection(configuration);

      pc.ontrack = (event) => {
        console.log(event, "event");

        if (remoteVideoRef.current) {
          console.log("setting remote video");

          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const data = { recipientId: senderId, candidate: event.candidate };

          chatSocket.emit("ice-candidate", data);
        }
      };

      try {
        await pc.setRemoteDescription(offer);

        // Create and send an answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        setPeerConnection(pc);
        const data = { recipientId: senderId, answer };
        chatSocket.emit("answer", data);
      } catch (error) {
        console.error("Error during WebRTC setup:", error);
      }
    }
  };

  const handleIceCandidate = async (data) => {
    const { candidate } = data;

    if (peerConnection) {
      try {
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(candidate);
          console.log("ICE candidate added successfully");
        } else {
          console.error(
            "Remote description not set, can't add ICE candidate yet"
          );
        }
      } catch (error) {
        console.error("Error adding received ICE candidate:", error);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUser());
    }
    if (isLoggedIn && user?._id && !socketConnected) {
      chatSocket.connect();
      const id = user._id;
      chatSocket.emit("authenticate", id, (response) => {
        if (response.status === "ok") {
          console.log("Authentication acknowledged by server.");
        } else {
          console.log("Authentication failed:", response.error);
        }
      });

      setSocketConnected(true);

      chatSocket.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
      });

      chatSocket.on("connect", () => {
        console.log("Socket connected");
        setSocketConnected(true);
      });

      chatSocket.on("newMessageNotification", (arg) => {
        const { roomId, senderId, message, type, _id } = arg;

        dispatch(setStatus(senderId));
        setChatMessages((chats) => {
          const prevChats = { ...chats };
          const chatRoom = prevChats[roomId] || { messages: [] };
          const chatMessages = chatRoom.messages;

          const isDuplicate = chatMessages.some((msg) => msg._id === _id);

          if (isDuplicate) {
            return prevChats;
          }

          if (type === "image") {
            prevChats[roomId] = {
              ...chatRoom,
              messages: [
                ...chatMessages,
                {
                  imageUrl: message,
                  timestamp: Date.now(),
                  senderId,
                  _id,
                },
              ],
            };
          } else if (type === "text") {
            prevChats[roomId] = {
              ...chatRoom,
              messages: [
                ...chatMessages,
                {
                  message,
                  timestamp: Date.now(),
                  senderId,
                  _id,
                },
              ],
            };
          }
          return prevChats;
        });
      });
      chatSocket.on("emoji_recieved", ({ id, emoji, roomId }) => {
        setChatMessages((prevChats) => ({
          ...prevChats,
          [roomId]: {
            ...prevChats[roomId],
            messages: prevChats[roomId].messages.map((mess) =>
              mess._id === id ? { ...mess, emoji } : mess
            ),
          },
        }));
      });

      chatSocket.on("incomingCall", handleIncomingCall);
      chatSocket.on("ice-candidate", handleIceCandidate);

      chatSocket.on("newMessage", (arg) => {
        console.log(arg);
        enqueueSnackbar("You have one message", { variant: "success" });
      });

      chatSocket.on("typingAlert", ({ roomId, userIsTyping }) => {
        setChatMessages((prevChats) => ({
          ...prevChats,
          [roomId]: {
            ...prevChats[roomId],
            isTyping: userIsTyping,
          },
        }));
      });

      return () => {
        chatSocket.off("newMessage");
        chatSocket.off("connect");
        chatSocket.off("disconnect");
        chatSocket.off("newMessageNotification");
        chatSocket.off("emoji_recieved");
        chatSocket.off("incomingCall", handleIncomingCall);
        chatSocket.off("ice-candidate", handleIceCandidate);
        chatSocket.disconnect();
        setSocketConnected(false);
      };
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleCleanup = () => {
      chatSocket.emit("logout");
      chatSocket.disconnect();
      setSocketConnected(false);

      chatSocket.off("connect");
      chatSocket.off("disconnect");
      chatSocket.off("newMessageNotification");
      chatSocket.off("emoji_recieved");
    };

    window.addEventListener("beforeunload", handleCleanup);
    window.addEventListener("unload", handleCleanup);

    return () => {
      handleCleanup();
      window.removeEventListener("beforeunload", handleCleanup);
      window.removeEventListener("unload", handleCleanup);
    };
  }, [isLoggedIn]);

  return {
    incomingCall,
    setIncomingCall,
    caller,
    handleAcceptCall,
    remoteVideoRef,
    webcamRef,
    setLocalStream,
  };
  // return (
  //   <>
  //     <Dialog open={true} maxWidth="md" fullWidth>
  //       <DialogTitle>Incoming call</DialogTitle>
  //       <DialogContent>
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           onClick={handleAcceptCall}
  //         >
  //           Accept Call
  //         </Button>
  //         <Webcam
  //           audio={false}
  //           ref={webcamRef}
  //           videoConstraints={{ facingMode: "user" }}
  //           onUserMedia={handleUserMedia}
  //           style={{
  //             // width: "100%",
  //             maxHeight: "500px",
  //             objectFit: "contain",
  //             position: "relative",
  //           }}
  //         />
  //         <video
  //           ref={remoteVideoRef}
  //           autoPlay
  //           playsInline
  //           style={{
  //             height: "250px",
  //             // position: "absolute",
  //             backgroundColor: "red",
  //           }}
  //         />
  //         <button onClick={() => setIncomingCall(false)}>Hang up</button>
  //       </DialogContent>
  //     </Dialog>
  //   </>
  // );
};

export default useChatSocket;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import chatSocket from "../features/utilities/Socket-io";
import { fetchUser } from "../features/user/userAsyncThunks";
import { useRecoilState } from "recoil";
import { ChatRoomMessages } from "../atoms/chatAtoms";
import { setStatus } from "../features/friends/friendsSlice";
import { closeSnackbar, useSnackbar } from "notistack";
import { setUnreadMessages } from "../features/chats/chatsSlice";
import SimplePeer from "simple-peer/simplepeer.min.js";
import {
  getFriends,
  getRequests,
  getSuggestions,
} from "../features/friends/friendsAsyncThunks";
import { useNavigate } from "react-router-dom";

const useChatSocket = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [socketConnected, setSocketConnected] = useState(false);
  const [peer, setPeer] = useState(null);
  const [chatMessages, setChatMessages] = useRecoilState(ChatRoomMessages);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [caller, setCaller] = useState(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const [accepted, setAccepted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setLocalStream(null);
    setCallAccepted(false);
    setIsCameraOn(false);
  };

  const handleAccept = async (e) => {
    stopAudio();
    console.log("handleAccept called");
    if (accepted) {
      return;
    }

    try {
      setAccepted(true);
      e.preventDefault();
      setCallAccepted(true);
      setIncomingCall(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const p = new SimplePeer({
        initiator: false,
        trickle: true,
        audio: true,
        video: true,
        config: {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        },
      });

      p.on("error", (err) => {
        console.error("SimplePeer error:", err);
        enqueueSnackbar("An error occurred during the call", {
          variant: "error",
        });
        handleReject();
      });

      p.addStream(stream);

      p.on("signal", (answerSignal) => {
        if (answerSignal.type === "answer") {
          console.log(answerSignal);
          chatSocket.emit("answer", {
            recipientId: caller,
            answer: answerSignal,
          });
        } else if (answerSignal.type === "candidate") {
          console.log("Emitting ICE candidate:", answerSignal);
          chatSocket.emit("ice-candidate", {
            recipientId: caller,
            candidate: answerSignal.candidate,
            type: "toCaller",
          });
        } else if (answerSignal.type === "transceiverRequest") {
          console.log("Emitting transceiver request:", answerSignal);
          chatSocket.emit("transceiver-request", {
            recipientId: caller,
            transceiverRequest: answerSignal.transceiverRequest,
          });
        }
      });

      p.on("stream", (remoteStream) => {
        console.log("Received remote stream");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      p.on("close", () => {
        console.log("Peer connection closed");
        handleReject();
      });

      console.log("Signaling offer to peer");
      console.log(offerDetails);

      p.signal(offerDetails);

      setPeer(p);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error in handleAccept:", error);
      enqueueSnackbar("Failed to start video call", { variant: "error" });
      handleReject();
    }
  };

  const handleReject = () => {
    chatSocket.emit("call_status", {
      recipientId: caller,
      message: "Call rejected",
    });
    if (peer) {
      peer.destroy();
    }
    setPeer(null);
    stopCamera();
    setCallRejected(true);
    setLocalStream(null);
    setIncomingCall(false);
    setCallAccepted(false);
    setAccepted(false);
  };

  const handleIceCandidate = (data) => {
    console.log("ICE candidate received", data);
    if (peer) {
      peer.signal(data.candidate);
    }
  };

  const handleIncomingCall = ({ offer, senderId }) => {
    playAudio();
    console.log("Incoming call from:", senderId);
    if (peer) {
      chatSocket.emit("call_status", {
        recipientId: senderId,
        message: "on another call",
      });
      return;
    }
    console.log(offer);
    if (offer.type == "offer") {
      setIncomingCall(true);
      setOfferDetails(offer);
      setCaller(senderId);
    }
  };

  let connectionTimeout;
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUser());
    }
    if (isLoggedIn && !socketConnected) {
      chatSocket.connect();
      const id = user._id;
      chatSocket.emit("authenticate", id, (response) => {
        if (response.status === "ok") {
          console.log("Authentication acknowledged by server.");
        } else {
          console.log("Authentication failed:", response.error);
        }
      });

      const handleConnect = () => {
        console.log("Socket connected");
        setSocketConnected(true);
        enqueueSnackbar("Connection successfull", {
          variant: "success",
          autoHideDuration: 1000,
        });
      };

      setSocketConnected(true);
      const handleDisconnect = () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
        enqueueSnackbar("Connection lost. Attempting to reconnect...", {
          variant: "warning",
        });

        connectionTimeout = setTimeout(() => {
          chatSocket.connect();
        }, 1000);
      };

      chatSocket.on("connect", handleConnect);
      chatSocket.on("disconnect", handleDisconnect);

      chatSocket.on("ice-candidate-toReciever", handleIceCandidate);

      // if (!socketConnected) {
      //   connectionTimeout = setTimeout(() => {
      //     if (!socketConnected) {
      //       enqueueSnackbar("Unable to connect to chat server", {
      //         variant: "error",
      //         autoHideDuration: 5000,
      //       });
      //     }
      //   }, 10000);
      // }

      // chatSocket.on("disconnect", () => {
      //   console.log("Socket disconnected");
      //   setSocketConnected(false);
      // });

      // chatSocket.on("connect", () => {
      //   console.log("Socket connected");
      //   setSocketConnected(true);
      // });

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
      chatSocket.on("newMessage", (arg) => {
        dispatch(setUnreadMessages(arg));
        // enqueueSnackbar("You have one message", { variant: "success" });
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

      chatSocket.on("relationChanged", (data) => {
        const { change, user } = data;
        const action = (snackbarId) => (
          <>
            <button
              className="mr-3"
              onClick={() => {
                navigate(`/profile/${user}`);
              }}
            >
              View profile
            </button>
            <button
              onClick={() => {
                closeSnackbar(snackbarId);
              }}
            >
              Dismiss
            </button>
          </>
        );
        if (change == "request_sent" || change === "request_canceled") {
          dispatch(getRequests());
          dispatch(getSuggestions());
          if (change === "request_sent")
            enqueueSnackbar("Request recieved", { action, variant: "info" });
          else
            enqueueSnackbar("Request cancelled", { action, variant: "error" });
        } else if (change === "request_accepted") {
          dispatch(getRequests());
          dispatch(getSuggestions());
          dispatch(getFriends());
          enqueueSnackbar("Request accepted", { action, variant: "success" });
        }
      });

      return () => {
        chatSocket.off("newMessage");
        chatSocket.off("connect");
        chatSocket.off("disconnect");
        chatSocket.off("newMessageNotification");
        chatSocket.off("emoji_recieved");
        chatSocket.off("relationChanged");
        chatSocket.off("incomingCall", handleIncomingCall);
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

      chatSocket.off("newMessage");
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
  }, []);

  return {
    incomingCall,
    setIncomingCall,
    caller,
    setLocalStream,
    chatSocket,
    remoteVideoRef,
    handleAccept,
    handleReject,
    callAccepted,
    localVideoRef,
    stopCamera,
    localStream,
    isCameraOn,
    setIsCameraOn,
    setAccepted,
    audioRef,
  };
};

export default useChatSocket;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import chatSocket from "../features/utilities/Socket-io";
import { fetchUser } from "../features/user/userAsyncThunks";
import { useRecoilState } from "recoil";
import { ChatRoomMessages } from "../atoms/chatAtoms";
import { setStatus } from "../features/friends/friendsSlice";
import { useSnackbar } from "notistack";
import { setUnreadMessages } from "../features/chats/chatsSlice";

const useChatSocket = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [socketConnected, setSocketConnected] = useState(false);
  const [chatMessages, setChatMessages] = useRecoilState(ChatRoomMessages);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [caller, setCaller] = useState(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const [accepted, setAccepted] = useState(false);

  const [localStream, setLocalStream] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun.l.google.com:5349" },
      { urls: "stun:stun1.l.google.com:3478" },
      { urls: "stun:stun1.l.google.com:5349" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:5349" },
      { urls: "stun:stun3.l.google.com:3478" },
      { urls: "stun:stun3.l.google.com:5349" },
      { urls: "stun:stun4.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:5349" },
    ],
  };

  const dispatch = useDispatch();

  let isCallAccepted = false;

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
  };

  const handleAcceptCall = async () => {
    if (isCallAccepted) return;
    isCallAccepted = true;
    if (peerConnection && offerDetails) {
      try {
        if (offerDetails.sdp && offerDetails.type === "offer") {
          const offerDesc = new RTCSessionDescription(offerDetails);

          await peerConnection.setRemoteDescription(offerDesc);

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
        } else {
          throw new Error("Invalid offer details");
        }
      } catch (error) {
        console.error("Error accepting call:", error);
      }
    }
  };

  const handleAccept = async (e) => {
    console.log("handleAccept called", accepted);
    if (accepted) {
      return;
    }

    setAccepted(true);
    e.preventDefault();
    setCallAccepted(true);
    setIncomingCall(false);

    if (!peerConnection) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        const pc = new RTCPeerConnection(configuration);

        setIsCameraOn(true);
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        setLocalStream(stream);
        pc.ontrack = (event) => {
          const remoteStream = event.streams[0];
          if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
          } else {
            console.log("setting remote video failed");
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log("ICE Connection State: ", pc.iceConnectionState);
          if (pc.iceConnectionState === "connected") {
            console.log("Peers are connected");
          } else if (pc.iceConnectionState === "disconnected") {
            console.log("Peers are disconnected");
          } else if (pc.iceConnectionState === "failed") {
            console.log("ICE connection failed");
          }
        };

        pc.ongatheringstatechange = () => {
          console.log("ICE Gathering State: ", pc.iceGatheringState);
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const data = {
              recipientId: caller,
              candidate: event.candidate,
            };

            chatSocket.emit("ice-candidate", data);
          }
        };

        const offerDesc = new RTCSessionDescription(offerDetails);
        await pc.setRemoteDescription(offerDesc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        setPeerConnection(pc);

        const data = {
          recipientId: caller,
          answer,
        };
        console.log("emtted", data);

        chatSocket.emit("answer", data);
      } catch (error) {
        console.error("Error during WebRTC setup:", error);
      }
    }
  };

  const handleReject = async () => {
    chatSocket.emit("call_status", {
      recipientId: caller,
      message: "Call rejected",
    });
    setCallRejected(true);
    setPeerConnection(null);
    localVideoRef.current = null;
    remoteVideoRef.current = null;
    setLocalStream(null);
    setIncomingCall(false);
    setCallAccepted(false);
  };

  const handleIncomingCall = async ({ offer, senderId }) => {
    if (peerConnection) {
      chatSocket.emit("call_status", {
        recipientId: caller,
        message: "on another call",
      });
      return;
    } else {
      setIncomingCall(true);
      setOfferDetails(offer);
      setCaller(senderId);
    }
  };

  const handleIceCandidate = async (data) => {
    const { candidate } = data;

    if (peerConnection) {
      if (peerConnection.remoteDescription) {
        const candidateData = new RTCIceCandidate(candidate);
        peerConnection
          .addIceCandidate(candidateData)
          .then(() => console.log("ICE candidate added"))
          .catch((error) =>
            console.error("Error adding ICE candidate:", error)
          );
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
      console.log("use-effect");
      chatSocket.on("newMessage", (arg) => {
        console.log("triggeres");

        dispatch(setUnreadMessages(arg));
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
    } else return;
  }, []);

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
    peerConnection,
    stopCamera,
    setPeerConnection,
    localStream,
    isCameraOn,
    setIsCameraOn,
    setAccepted,
  };
};

export default useChatSocket;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import chatSocket from "../features/utilities/Socket-io";
import { fetchUser } from "../features/user/userAsyncThunks";
import { useRecoilState } from "recoil";
import { ChatRoomMessages } from "../atoms/chatAtoms";
import { setStatus } from "../features/friends/friendsSlice";
import { useSnackbar } from "notistack";
import { setUnreadMessages } from "../features/chats/chatsSlice";
import SimplePeer from "simple-peer/simplepeer.min.js";

const iceCandidateBuffer = [];

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
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
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

  const handleAccept = async (e) => {
    console.log("handleAccept called", accepted);
    if (accepted) {
      return;
    }

    setAccepted(true);
    e.preventDefault();
    setCallAccepted(true);
    setIncomingCall(false);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;

    setLocalStream(stream);
    const p = new SimplePeer({
      initiator: false, // We are answering the call, not initiating
      stream,
      trickle: false,
    });

    p.on("signal", (answerSignal) => {
      const data = {
        recipientId: caller,
        answer: answerSignal,
      };
      chatSocket.emit("answer", data);
    });

    p.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    p.signal(offerDetails);

    setPeer(p);

    // if (!peerConnection) {
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //       video: true,
    //       audio: true,
    //     });
    //     const pc = new RTCPeerConnection(configuration);

    //     setIsCameraOn(true);
    //     localVideoRef.current.srcObject = stream;
    //     stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    //     setLocalStream(stream);
    //     pc.ontrack = (event) => {
    //       const remoteStream = event.streams[0];
    //       if (remoteVideoRef.current && remoteStream) {
    //         remoteVideoRef.current.srcObject = remoteStream;
    //       } else {
    //         console.log("setting remote video failed");
    //       }
    //     };

    //     pc.ongatheringstatechange = () => {
    //       console.log("ICE Gathering State: ", pc.iceGatheringState);
    //     };

    //     pc.oniceconnectionstatechange = () => {
    //       console.log("ICE Connection State: ", pc.iceConnectionState);
    //       if (
    //         pc.iceConnectionState === "disconnected" ||
    //         pc.iceConnectionState === "failed"
    //       ) {
    //         pc.restartIce();
    //         console.log(
    //           "Connection disconnected or failed, attempting to recover..."
    //         );
    //       }
    //     };

    //     pc.onsignalingstatechange = () => {
    //       console.log("Signaling State: ", pc.signalingState);
    //     };

    //     pc.onicecandidate = (event) => {
    //       if (event.candidate) {
    //         console.log("New ICE candidate:");
    //         chatSocket.emit("ice-candidate", {
    //           recipientId: caller,
    //           candidate: event.candidate,
    //           type: "reciever",
    //         });
    //       }
    //     };

    //     const offerDesc = new RTCSessionDescription(offerDetails);
    //     await pc.setRemoteDescription(offerDesc);
    //     const answer = await pc.createAnswer();
    //     await pc.setLocalDescription(answer);

    //     for (const candidate of iceCandidateBuffer) {
    //       try {
    //         await pc.addIceCandidate(new RTCIceCandidate(candidate));
    //         console.log("Buffered ICE candidate added:", candidate);
    //       } catch (error) {
    //         console.error("Error adding buffered ICE candidate:", error);
    //       }
    //     }
    //     iceCandidateBuffer.length = 0;

    //     setPeerConnection(pc);

    //     const data = {
    //       recipientId: caller,
    //       answer,
    //     };

    //     chatSocket.emit("answer", data);
    //   } catch (error) {
    //     console.error("Error during WebRTC setup:", error);
    //   }
    //   // finally {
    //   //   setTimeout(async () => {
    //   //     await setIceCandidates();
    //   //   }, 2000);
    //   // }
    // }
  };

  const handleReject = async () => {
    chatSocket.emit("call_status", {
      recipientId: caller,
      message: "Call rejected",
    });
    if (peer) peer.destroy();
    setPeer(null);
    stopCamera();
    setCallRejected(true);
    setPeerConnection(null);
    localVideoRef.current = null;
    remoteVideoRef.current = null;
    setLocalStream(null);
    setIncomingCall(false);
    setCallAccepted(false);
  };

  const handleIncomingCall = async ({ offer, senderId }) => {
    console.log(offer);

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

  const handleIceCandidate = (data) => {
    if (peerConnection && peerConnection.remoteDescription) {
      try {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log("ICE candidate added");
      } catch (error) {
        console.error("Error adding received ICE candidate", error);
      }
    } else {
      console.log("Buffering ICE candidate");
      iceCandidateBuffer.push(data.candidate);
    }
  };

  // const setIceCandidates = async () => {
  //   if (peerConnection) {
  //     for (const candidate of iceCandidateBuffer) {
  //       try {
  //         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  //         console.log("Buffered ICE candidate added:", candidate);
  //       } catch (error) {
  //         console.error("Error adding buffered ICE candidate:", error);
  //       }
  //     }
  //     iceCandidateBuffer.length = 0; // Clear buffer after adding all candidates
  //   } else {
  //     console.log(peerConnection);

  //     console.log("nadannilla");
  //   }
  // };

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
      chatSocket.on("ice-candidate-caller", handleIceCandidate);
      chatSocket.on("newMessage", (arg) => {
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
        chatSocket.off("ice-candidate-caller", handleIceCandidate);
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

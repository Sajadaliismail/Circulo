import React, { useEffect, useRef, useState } from "react";
import chatSocket from "../features/utilities/Socket-io";
import { Modal } from "@mui/material";

const VideoCall = ({ friend }) => {
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [offerDetails, setOfferDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const setupStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setCameraError(null);
    } catch (error) {
      console.error("Error accessing media devices.", error);
      setCameraError(
        "Error accessing media devices. Please enable camera permissions."
      );
    }
  };

  useEffect(() => {
    setupStream();

    chatSocket.on("offer", async (offer) => {
      console.log("Received offer");

      setIncomingCall(true);
      setOfferDetails(offer);

      if (!peerConnection) {
        const pc = new RTCPeerConnection(configuration);
        setPeerConnection(pc);

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            chatSocket.emit("ice-candidate", { candidate: event.candidate });
          }
        };
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      chatSocket.emit("answer", { recipientId: offer.senderId, answer });
    });

    chatSocket.on("answer", async (answer) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    chatSocket.on("ice-candidate", (candidate) => {
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      chatSocket.off("offer");
      chatSocket.off("answer");
      chatSocket.off("ice-candidate");
    };
  }, [peerConnection]);

  const startCall = async (recipientId) => {
    if (!localStream) {
      alert("Unable to start the call. Please check camera permissions.");
      return;
    }

    const pc = new RTCPeerConnection(configuration);
    setPeerConnection(pc);

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

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

    setIsCalling(true);
  };

  const handleAcceptCall = () => {
    if (offerDetails) {
      startCall(offerDetails.senderId);
      setIncomingCall(false);
      setOfferDetails(null);
    }
  };

  const handleRejectCall = () => {
    setIncomingCall(false);
    setOfferDetails(null);
  };

  const handleCancelCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      setIsCalling(false);
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={() => {
          setOpen(true);
          startCall(friend);
        }}
        disabled={isCalling}
        className={`px-4 py-2 rounded ${
          isCalling ? "bg-gray-400" : "bg-blue-500"
        } text-white font-semibold transition duration-300 ease-in-out hover:bg-blue-600`}
      >
        {isCalling ? "Calling..." : "Start Call"}
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            {cameraError && <p className="text-red-600 mb-4">{cameraError}</p>}
            {isCalling && (
              <div className="flex flex-col items-center">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-72 mb-4 border-2 border-gray-300"
                />
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  className="w-72 border-2 border-gray-300"
                />
                <button
                  onClick={handleCancelCall}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out"
                >
                  Hang Up
                </button>
              </div>
            )}
            {incomingCall && !isCalling && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">Incoming Call</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAcceptCall}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleRejectCall}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoCall;

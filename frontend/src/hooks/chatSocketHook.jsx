// src/hooks/useChatSocket.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import chatSocket from "../features/utilities/Socket-io";

const useChatSocket = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [socketConnected, setSocketConnected] = useState(false);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (isLoggedIn && user) {
      const id = user._id;
      chatSocket.emit("authenticate", id);

      setSocketConnected(true);

      const handleSocketEvents = () => {
        chatSocket.on("disconnect", () => console.log("Socket disconnected"));

        // chatSocket.on("newMessageNotification", (data) => {
        // });

        // chatSocket.on("emoji_recieved", ({ id, emoji }) => {
        // });

        return () => {
          chatSocket.off("connect");
          chatSocket.off("disconnect");
          chatSocket.off("newMessageNotification");
          chatSocket.off("emoji_recieved");
        };
      };

      handleSocketEvents();
    } else {
      if (socketConnected) {
        chatSocket.disconnect();
        setSocketConnected(false);
      }
    }
  }, [isLoggedIn, socketConnected]);

  return chatSocket;
};

export default useChatSocket;

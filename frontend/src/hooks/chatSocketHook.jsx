import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import chatSocket from "../features/utilities/Socket-io";
import { fetchUser } from "../features/user/userAsyncThunks";
import { useRecoilState } from "recoil";
import { ChatRoomMessages } from "../atoms/chatAtoms";
import { setStatus } from "../features/friends/friendsSlice";
import { useSnackbar } from "notistack";

const useChatSocket = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [chatMessages, setChatMessages] = useRecoilState(ChatRoomMessages);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn && user?._id) {
      dispatch(fetchUser());

      chatSocket.connect();
      console.log("Socket connected");

      const id = user._id;

      chatSocket.emit("authenticate", id, (response) => {
        if (response.status === "ok") {
          console.log("Authentication acknowledged by server.");
        } else {
          console.log("Authentication failed:", response.error);
        }
      });

      chatSocket.on("newMessageNotification", (arg) => {
        const { roomId, senderId, message, type, _id } = arg;

        dispatch(setStatus(senderId));

        setChatMessages((prevChats) => {
          const prevRoom = prevChats[roomId] || { messages: [] };
          const chatMessages = prevRoom.messages;

          const isDuplicate = chatMessages.some((msg) => msg._id === _id);
          if (isDuplicate) return prevChats;

          const newMessage =
            type === "image"
              ? { imageUrl: message, timestamp: Date.now(), senderId, _id }
              : { message, timestamp: Date.now(), senderId, _id };

          return {
            ...prevChats,
            [roomId]: {
              ...prevRoom,
              messages: [...chatMessages, newMessage],
            },
          };
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

      chatSocket.on("newMessage", (arg) => {
        enqueueSnackbar("You have one new message", { variant: "success" });
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

      chatSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Cleanup event listeners and socket connection
      return () => {
        chatSocket.off("newMessageNotification");
        chatSocket.off("emoji_recieved");
        chatSocket.off("newMessage");
        chatSocket.off("typingAlert");
        chatSocket.off("disconnect");
        chatSocket.disconnect();
      };
    }
  }, [isLoggedIn, user?._id]);

  useEffect(() => {
    const handleCleanup = () => {
      chatSocket.emit("logout");
      chatSocket.disconnect();
    };

    window.addEventListener("beforeunload", handleCleanup);
    window.addEventListener("unload", handleCleanup);

    return () => {
      window.removeEventListener("beforeunload", handleCleanup);
      window.removeEventListener("unload", handleCleanup);
    };
  }, []);
};

export default useChatSocket;

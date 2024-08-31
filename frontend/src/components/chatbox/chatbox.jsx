// useEffect(() => {
//   const id = user._id;
//   chatSocket.emit("authenticate", id);

//   chatSocket.on(
//     "newMessageNotification",
//     ({ senderId, roomId, hasOpened, message, timestamp, type, _id }) => {
//       dispatch(
//         setChats({
//           senderId,
//           roomId,
//           hasOpened,
//           message,
//           timestamp,
//           type,
//           _id,
//         })
//       );
//       // dispatch(
//       //   setReceivedChats({
//       //     senderId,
//       //     roomId,
//       //     hasOpened,
//       //     message,
//       //     timestamp,
//       //     type,
//       //     _id,
//       //   })
//       // );
//       // dispatch(setUnreadMessages({ senderId }));
//     }
//   );

//   chatSocket.on("emoji_recieved", ({ id, emoji }) => {
//     dispatch(setEmoji({ id, emoji }));
//   });
//   const receiveMessageHandler = ({
//     senderId,
//     roomId,
//     hasOpened,
//     message,
//     timestamp,
//     type,
//     _id,
//   }) => {
//     console.log({
//       senderId,
//       roomId,
//       hasOpened,
//       message,
//       timestamp,
//       type,
//       _id,
//     });
//     dispatch(setReadMessages(senderId));

//     dispatch(
//       setChats({ senderId, roomId, hasOpened, message, timestamp, type })
//     );
//   };

//   if (friendRef.current._id) {
//     chatSocket.on("emoji_recieved", (arg) => {
//       console.log(arg);
//     });
//   }
//   chatSocket.on("receiveMessage", receiveMessageHandler);

//   return () => {
//     chatSocket.off("newMessageNotification");
//     chatSocket.off("emoji_recieved");
//     chatSocket.off("receiveMessage", receiveMessageHandler);
//   };
// }, [user._id, dispatch]);
import React, {
  lazy,
  useEffect,
  useMemo,
  useState,
  Suspense,
  useRef,
} from "react";
import chatSocket from "../../features/utilities/Socket-io";

import OnlinePeopleAccordion from "./online";
import ChatBoxHeader from "./chatboxheade";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatBox,
  setChats,
  setClosed,
  setEmoji,
  setMinimize,
  setOpen,
  setReadMessages,
  setReceivedChats,
  setSentMessages,
  setUnreadMessages,
} from "../../features/chats/chatsSlice";
import { fetchchats } from "../../features/chats/chatsAsycnThunks";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";
import useChatSocket from "../../hooks/chatSocketHook";

const ChatBox = lazy(() => import("./chatboxinterface"));

function ChatApp({ fetchUserData, msg, setmsg }) {
  const dispatch = useDispatch();
  const { chats, roomId } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.friends);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [friend, setFriend] = useState({});
  const friendRef = useRef(friend);

  useEffect(() => {
    dispatch(setChatBox());
  }, []);

  const chatSocketHook = useChatSocket();

  useEffect(() => {
    if (!chatSocketHook) return;

    const handleNewMessage = ({
      senderId,
      roomId,
      hasOpened,
      message,
      timestamp,
      type,
      _id,
    }) => {
      dispatch(
        setChats({ senderId, roomId, hasOpened, message, timestamp, type, _id })
      );
    };

    const handleEmojiReceived = ({ id, emoji }) => {
      dispatch(setEmoji({ id, emoji }));
    };

    chatSocketHook.on("newMessageNotification", handleNewMessage);
    chatSocketHook.on("emoji_recieved", handleEmojiReceived);

    return () => {
      chatSocketHook.off("newMessageNotification", handleNewMessage);
      chatSocketHook.off("emoji_recieved", handleEmojiReceived);
    };
  }, [chatSocketHook, dispatch]);

  const conversation = useMemo(() => {
    const chatArray = Object.values(chats);
    return chatArray;
  }, [chats]);

  const handleChat = async (id, roomId) => {
    console.log(id);
    const fetchChatmsg = async (id) => {
      const response = await fetch(
        `http://localhost:3008/chats/fetchchat?id=${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const { chat } = await response.json();
        setmsg((prevChats) => ({
          ...prevChats,
          [chat.roomId]: {
            messages: chat.messages,
            user1: chat.user1,
            user2: chat.user2,
            roomId: chat.roomId,
            unreadCount: chat.unreadCount,
            chatBoxOpen: true,
            minimize: false,
          },
        }));
      }
    };

    fetchChatmsg(id);
    console.log(msg);

    // await dispatch(fetchchats(id));
    // await dispatch(setReadMessages(id));
    // openConversation(id);
    setFriend(friend);
    friendRef.current = friend;
    setMessage("");
    chatSocket.emit("join_room", { userId: id });
  };

  const handleClose = (id) => {
    dispatch(setClosed(id));
  };

  const handleMinimize = (id) => {
    dispatch(setMinimize(id));
  };

  // const openConversation = async (id) => {
  //   const userId = user._id;
  //   const roomId = [userId, id].sort().join("");
  //   await dispatch(fetchchats(id));
  //   await dispatch(setOpen(roomId));
  // };

  const onSubmit = (id, message) => {
    if (message.trim()) {
      chatSocket.emit("message", { userId: id, message, type: "text" });
      dispatch(
        setSentMessages({ message, timestamp: Date.now(), type: "text" })
      );
      setMessage("");
    }
  };

  const onRemove = (conversationId, messageId) => {};

  const onLoadPrevious = (conversationId) => {};

  return (
    <div className="fixed bottom-0 right-80">
      <Suspense fallback={<div>Loading...</div>}>
        <div
          className=" gap-3"
          style={{
            height: "max-content",
            display: "flex",
            alignItems: "end",
          }}
        >
          {Object.keys(msg).map((roomId) => {
            const chat = msg[roomId];
            return chat?.chatBoxOpen ? (
              chat.minimize ? (
                <ChatBoxHeader
                  key={roomId}
                  data={chat}
                  onClose={() => handleClose(roomId)}
                  onMinimize={() => handleMinimize(roomId)}
                />
              ) : (
                <ChatBox
                  key={roomId}
                  roomId={roomId}
                  title={chat.name}
                  data={chat}
                  conversations={chat.messages}
                  chatBoxOpen={chat.chatBoxOpen}
                  onClose={() => handleClose(roomId)}
                  onMinimize={() => handleMinimize(roomId)}
                  onSubmit={onSubmit}
                  onLoadPrevious={onLoadPrevious}
                  onRemove={onRemove}
                />
              )
            ) : null;
          })}
        </div>

        <OnlinePeopleAccordion
          fetchUserData={fetchUserData}
          conversationsOpened={conversation}
          handleChat={handleChat}
        />
      </Suspense>
    </div>
  );
}

export default ChatApp;

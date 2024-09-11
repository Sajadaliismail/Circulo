import React, { lazy, useMemo, useState, Suspense, useRef } from "react";
import chatSocket from "../../features/utilities/Socket-io";

import OnlinePeopleAccordion from "./online";
import ChatBoxHeader from "./chatboxheade";
import { useSelector } from "react-redux";

import { ChatRoomMessages } from "../../atoms/chatAtoms";
import { useRecoilState } from "recoil";
const CHAT_BACKEND = process.env.REACT_APP_CHAT_BACKEND;

const ChatBox = lazy(() => import("./chatboxinterface"));

function ChatApp({ fetchUserData, msg, setmsg }) {
  // const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chats);
  // const { userData } = useSelector((state) => state.friends);
  const [message, setMessage] = useState("");
  // const [image, setImage] = useState(null);
  // const [imageUrl, setImageUrl] = useState("");
  const [friend, setFriend] = useState({});
  const friendRef = useRef(friend);

  const [chatMessages, setChatMessages] = useRecoilState(ChatRoomMessages);

  const conversation = useMemo(() => {
    const chatArray = Object.values(chats);
    return chatArray;
  }, [chats]);

  const handleChat = async (id, roomId) => {
    console.log(roomId, chatMessages);

    console.log(id);
    const fetchChatmsg = async (id) => {
      const response = await fetch(`${CHAT_BACKEND}/chats/fetchchat?id=${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const { chat } = await response.json();
        setChatMessages((prevChats) => ({
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

    setFriend(friend);
    friendRef.current = friend;
    setMessage("");
    chatSocket.emit("join_room", { userId: id });
  };

  const handleClose = (id) => {
    setChatMessages((prevChats) => {
      console.log(prevChats);

      const curr = { ...prevChats[id] };
      curr.chatBoxOpen = false;
      return { ...prevChats, [id]: curr };
    });
  };

  const handleMinimize = (id) => {
    setChatMessages((prevChats) => {
      console.log(prevChats);

      const curr = { ...prevChats[id] };
      curr.minimize = !curr.minimize;
      return { ...prevChats, [id]: curr };
    });
  };

  const onSubmit = (id, message) => {
    if (message.trim()) {
      chatSocket.emit("message", { userId: id, message, type: "text" });

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
          {Object.keys(chatMessages).map((roomId) => {
            const chat = chatMessages[roomId];

            return chat?.chatBoxOpen ? (
              chat.minimize ? (
                <ChatBoxHeader
                  key={`chatbox-${roomId}`}
                  data={chat}
                  onClose={() => handleClose(roomId)}
                  onMinimize={() => handleMinimize(roomId)}
                />
              ) : (
                <ChatBox
                  key={`header-${roomId}`}
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

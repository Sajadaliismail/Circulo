import React, {
  lazy,
  useEffect,
  useMemo,
  useState,
  Suspense,
  useRef,
} from "react";
import chatSocket from "../../features/utilities/Socket-io";

import { sampleData } from "./sample";
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
  setUnreadMessages,
} from "../../features/chats/chatsSlice";
import { fetchchats } from "../../features/chats/chatsAsycnThunks";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";

const ChatBox = lazy(() => import("./chatboxinterface"));
const AvatarWithUsername = lazy(() => import("./withusername"));

function ChatApp() {
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
  useEffect(() => {
    const id = user._id;
    chatSocket.emit("authenticate", id);

    chatSocket.on(
      "newMessageNotification",
      ({ senderId, roomId, hasOpened, message, timestamp, type, _id }) => {
        dispatch(
          setChats({
            senderId,
            roomId,
            hasOpened,
            message,
            timestamp,
            type,
            _id,
          })
        );
        // dispatch(setReceivedChats(data));
        // const { senderId } = data;
        dispatch(setUnreadMessages({ senderId }));
      }
    );

    chatSocket.on("emoji_recieved", ({ id, emoji }) => {
      dispatch(setEmoji({ id, emoji }));
    });
    const receiveMessageHandler = ({
      senderId,
      roomId,
      hasOpened,
      message,
      timestamp,
      type,
      _id,
    }) => {
      // console.log(senderId, roomId, hasOpened, message, timestamp, type, _id);
      dispatch(setReadMessages(senderId));

      // dispatch(
      //   setChats({ senderId, roomId, hasOpened, message, timestamp, type })
      // );
    };

    if (friendRef.current._id) {
      chatSocket.on("emoji_recieved", (arg) => {
        console.log(arg);
      });
    }
    chatSocket.on("receiveMessage", receiveMessageHandler);

    return () => {
      chatSocket.off("newMessageNotification");
      chatSocket.off("emoji_recieved");
      chatSocket.off("receiveMessage", receiveMessageHandler);
    };
  }, [user._id, dispatch]);

  const conversation = useMemo(() => {
    const chatArray = Object.values(chats);

    return chatArray;
  }, [chats]);

  const handleChat = async (friend) => {
    const id = friend.id;
    if (!userData[id]) {
      dispatch(fetchUserDetails(id));
    }
    await dispatch(fetchchats(id));
    await dispatch(setReadMessages(id));
    openConversation(id);
    setFriend(friend);
    friendRef.current = friend;
    setMessage("");
    chatSocket.emit("join_room", { userId: id });
  };

  const onClose = (id) => {
    dispatch(setClosed(id));
  };

  const onMinimize = (id) => {
    dispatch(setMinimize(id));
  };

  const openConversation = async (id) => {
    const userId = user._id;
    const roomId = [userId, id].sort().join("");
    await dispatch(fetchchats(id));

    await dispatch(setOpen(roomId));
    let totalOpened = 0;

    if (totalOpened === 2) {
    }
    // if (conversation.opened) {
    //   totalOpened += 1;
    // }
    // if (conversation.converSationId === id) {
    // }
    // return conversation;
  };

  const onSubmit = (conversationId, message) => {};

  const onRemove = (conversationId, messageId) => {};

  const onLoadPrevious = (conversationId) => {};

  return (
    <div className="fixed bottom-0 right-80">
      <Suspense fallback={<div>Loading...</div>}>
        <div
          className=" gap-3"
          style={{ height: "max-content", display: "flex", alignItems: "end" }}
        >
          {conversation &&
            conversation?.map((conversation, index) =>
              conversation?.chatBoxOpen && !conversation.minimized ? (
                <ChatBox
                  conversationId={conversation?.roomId}
                  key={conversation?.roomId}
                  title={conversation?.name}
                  data={conversation}
                  avatar={conversation?.avatar}
                  conversations={conversation?.messages}
                  chatBoxOpen={conversation?.chatBoxOpen}
                  onClose={() => onClose(conversation?.roomId)}
                  onMinimize={() => onMinimize(conversation?.roomId)}
                  onSubmit={onSubmit}
                  onLoadPrevious={onLoadPrevious}
                  onRemove={onRemove}
                />
              ) : conversation?.minimized ? (
                <ChatBoxHeader
                  title={conversation?.name}
                  key={conversation?.roomId}
                  onClose={() => onClose(conversation?.roomId)}
                  onMinimize={() => onMinimize(conversation?.roomId)}
                />
              ) : null
            )}
        </div>

        <OnlinePeopleAccordion
          conversationsOpened={conversation}
          // openConversation={openConversation}
          handleChat={handleChat}
        />
      </Suspense>
    </div>
  );
}

export default ChatApp;

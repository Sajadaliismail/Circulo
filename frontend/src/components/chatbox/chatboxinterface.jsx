import { useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import ChatBoxHeader from "./chatboxheade";
import ChatBoxFooter from "./chatboxfooter";
import ChatBoxMessage from "./chatboxmessage";
import { useSelector } from "react-redux";

const ChatBox = ({
  conversations,
  roomId,
  onClose,
  onMinimize,
  onSubmit,
  onLoadPrevious,
  onRemove,
  data,
  isTyping,
}) => {
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  // const { userData } = useSelector((state) => state.friends);
  const [friendId, setFriendId] = useState("");

  useEffect(() => {
    if (data.user1 === user._id) setFriendId(data.user2);
    else setFriendId(data.user1);
  }, []);

  useEffect(() => {
    scrollToBottom();

    const conversation = document.getElementById(`conversation-${roomId}`);

    conversation?.addEventListener("scroll", (e) => {
      const el = e.target;

      if (el.scrollTop === 0) {
        onLoadPrevious(roomId);
      }
    });

    return () => {
      conversation?.removeEventListener("scroll", (e) => {
        const el = e.target;

        if (el.scrollTop === 0) {
          onLoadPrevious(roomId);
        }
      });
    };
  }, [conversations]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onSubmitMessage = (message) => {
    onSubmit(friendId, message, roomId);
    scrollToBottom();
  };

  return (
    <Card
      variant="outlined"
      className="w-80 md:w-96"
      sx={{
        borderRadius: 2,
        width: 350,
      }}
    >
      <ChatBoxHeader
        data={data}
        onClose={() => onClose(roomId)}
        onMinimize={() => onMinimize(roomId)}
      />
      <div
        className="p-2 h-96 overflow-auto scrollbar-none"
        id={`conversation-${roomId}`}
      >
        {conversations &&
          conversations?.map((conversation) => (
            <>
              {/* {console.log(conversation)} */}
              <ChatBoxMessage
                key={`conver-${conversation?._id}`}
                messageId={conversation?._id}
                message={conversation?.message}
                imageUrl={conversation?.imageUrl}
                voiceUrl={conversation?.voiceUrl}
                data={conversation}
                emoji={conversation?.emoji}
                author={conversation?.senderId}
                avatar={conversation?.avatar}
                roomId={roomId}
                onRemove={(messageId) => onRemove(roomId, messageId)}
              />
            </>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatBoxFooter
        onSubmit={onSubmitMessage}
        roomId={roomId}
        friend={friendId}
        isTyping={isTyping}
      />
    </Card>
  );
};

export default ChatBox;

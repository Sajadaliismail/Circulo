import { useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import ChatBoxHeader from "./chatboxheade";
import ChatBoxFooter from "./chatboxfooter";
import ChatBoxMessage from "./chatboxmessage";
import { useSelector } from "react-redux";

const ChatBox = ({
  conversations,
  conversationId,
  onClose,
  onMinimize,
  onSubmit,
  onLoadPrevious,
  onRemove,
  data,
}) => {
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.friends);
  const [friendId, setFriendId] = useState("");

  useEffect(() => {
    if (data.user1 == user._id) setFriendId(data.user2);
    else setFriendId(data.user1);
  }, []);

  useEffect(() => {
    scrollToBottom();

    const conversation = document.getElementById(
      `conversation-${conversationId}`
    );

    conversation?.addEventListener("scroll", (e) => {
      const el = e.target;

      if (el.scrollTop === 0) {
        onLoadPrevious(conversationId);
      }
    });

    return () => {
      conversation?.removeEventListener("scroll", (e) => {
        const el = e.target;

        if (el.scrollTop === 0) {
          onLoadPrevious(conversationId);
        }
      });
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onSubmitMessage = (message) => {
    onSubmit(friendId, message);
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
        onClose={() => onClose(conversationId)}
        onMinimize={() => onMinimize(conversationId)}
      />
      <div
        className="p-2 h-96 overflow-auto "
        id={`conversation-${conversationId}`}
      >
        {conversations &&
          conversations?.map((conversation) => (
            <ChatBoxMessage
              key={conversation?.messageId}
              messageId={conversation?.messageId}
              message={conversation?.message}
              data={conversation}
              author={conversation?.senderId}
              avatar={conversation?.avatar}
              onRemove={(messageId) => onRemove(conversationId, messageId)}
            />
          ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatBoxFooter onSubmit={onSubmitMessage} />
    </Card>
  );
};

export default ChatBox;

import { useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import ChatBoxHeader from './chatboxheade';
import ChatBoxFooter from './chatboxfooter';
import ChatBoxMessage from './chatboxmessage';

const ChatBox = ({
  avatar,
  conversations,
  conversationId,
  onClose,
  onMinimize,
  onSubmit,
  onLoadPrevious,
  onRemove,
  title,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log(conversations);
    scrollToBottom();

    const conversation = document.getElementById(`conversation-${conversationId}`);

    conversation?.addEventListener('scroll', (e) => {
      const el = e.target;

      if (el.scrollTop === 0) {
        onLoadPrevious(conversationId);
      }
    });

    return () => {
      conversation?.removeEventListener('scroll', (e) => {
        const el = e.target;

        if (el.scrollTop === 0) {
          onLoadPrevious(conversationId);
        }
      });
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onSubmitMessage = (message) => {
    onSubmit(conversationId, message);
    scrollToBottom();
  };

  return (
    <Card variant="outlined" className="w-80 md:w-96" sx={{ borderRadius: 5,  width:350  } }>
      <ChatBoxHeader
        title={title}
        onClose={() => onClose(conversationId)}
        onMinimize={() => onMinimize(conversationId)}
      />
      <div className="p-2 h-96 overflow-auto " id={`conversation-${conversationId}`}>
        { conversations.map((conversation) => (
          <ChatBoxMessage
            key={conversation.messageId}
            messageId={conversation.messageId}
            message={conversation.message}
            author={conversation.author}
            avatar={conversation.avatar}
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

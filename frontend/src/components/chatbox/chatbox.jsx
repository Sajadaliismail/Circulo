import React, { lazy, useEffect, useMemo, useState, Suspense } from 'react';

import { sampleData } from './sample';
import OnlinePeopleAccordion from './online';
import ChatBoxHeader from './chatboxheade';

const ChatBox = lazy(() => import('./chatboxinterface'));
const AvatarWithUsername = lazy(() => import('./withusername'));

function ChatAPp() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    setConversations(sampleData);
  }, []);

  const conversationsOpened = useMemo(() => {
    return conversations.filter((c) => c.opened);
  }, [conversations]);

  const onClose = (id) => {
    const newConversations = conversations.map((conversation) => {
      if (conversation.converSationId === id) {
        conversation.opened = false;
      }
      return conversation;
    });
    setConversations(newConversations);
  };

  const onMinimize = (id) => {
    const newConversations = conversations.map((conversation) => {
      if (conversation.converSationId === id) {
        conversation.minimized = !conversation.minimized;
      }
      return conversation;
    });
    setConversations(newConversations);
  };

  const openConversation = (id) => {
    let totalOpened = 0;
    const newConversations = conversations.map((conversation) => {
      if (totalOpened === 2) {
        conversation.opened = false;
      }
      if (conversation.opened) {
        totalOpened += 1;
      }
      if (conversation.converSationId === id) {
        conversation.opened = true;
        conversation.minimized = false;
      }
      return conversation;
    });
    setConversations(newConversations);
  };

  const onSubmit = (conversationId, message) => {
    const newConversations = [...conversations].map((conversation) => {
      if (conversation.converSationId === conversationId) {
        conversation.messages.push({
          messageId: '999',
          message,
        });
      }
      return conversation;
    });

    setConversations(newConversations);
  };

  const onRemove = (conversationId, messageId) => {
    const newConversations = [...conversations].map((conversation) => {
      if (conversation.converSationId === conversationId) {
        conversation.messages = [...conversation.messages].filter(
          (message) => message.messageId !== messageId
        );
      }
      return conversation;
    });

    setConversations(newConversations);
  };

  const onLoadPrevious = (conversationId) => {};

  return (
    <div className="fixed bottom-0 right-80">
      <div className=" gap-3" style={{ height: 'max-content' ,display:'flex',alignItems:'end'}}>
        {conversationsOpened && 
          conversationsOpened.map((conversation) =>
            !conversation.minimized ? (
              <ChatBox
                conversationId={conversation.converSationId}
                key={conversation.converSationId}
                title={conversation.name}
                avatar={conversation.avatar}
                conversations={conversation.messages}
                onClose={() => onClose(conversation.converSationId)} // Corrected usage
                onMinimize={() => onMinimize(conversation.converSationId)} // Corrected usage
                onSubmit={onSubmit}
                onLoadPrevious={onLoadPrevious}
                onRemove={onRemove}
              />
            ) : (
              <ChatBoxHeader
                title={conversation.name}
                key={conversation.converSationId}
                onClose={() => onClose(conversation.converSationId)} // Corrected usage
                onMinimize={() => onMinimize(conversation.converSationId)} // Corrected usage
              />
            )
          )}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <OnlinePeopleAccordion
          conversationsOpened={conversationsOpened}
          openConversation={openConversation}
        />
      </Suspense>
    </div>
  );
}

export default ChatAPp;

'use client';

import { Box } from '@mui/material';
import ConversationList from './ConversationList';
import Chat from './Chat';
import LoadingSpinner from './LoadingSpinner';
import useConversations from '../hooks/useConversations';

export default function ChatApp() {
  const {
    conversations,
    currentConversationId,
    loading,
    createConversation,
    deleteConversation,
    selectConversation,
    refreshConversations,
  } = useConversations();

  if (loading) {
    return <LoadingSpinner message="Chargement..." />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <ConversationList
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={createConversation}
        onDeleteConversation={deleteConversation}
      />
      <Chat
        conversationId={currentConversationId}
        onMessageSent={refreshConversations}
      />
    </Box>
  );
}

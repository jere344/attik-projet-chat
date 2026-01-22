'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import ConversationList from './ConversationList';
import Chat from './Chat';
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
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography color="text.secondary">Chargement...</Typography>
      </Box>
    );
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

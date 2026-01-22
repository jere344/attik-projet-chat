'use client';

import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import useChat from '../hooks/useChat';

export default function Chat({ conversationId, onMessageSent }) {
  const { messages, loading, error, sendMessage, deleteMessageAndFollowing } = useChat(conversationId);

  const handleSendMessage = async (content) => {
    await sendMessage(content);
    if (onMessageSent) {
      onMessageSent();
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}

      {!conversationId ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">
            Sélectionnez ou créez une conversation pour commencer
          </Typography>
        </Box>
      ) : (
        <>
          <MessageList messages={messages} onDeleteMessage={deleteMessageAndFollowing} />

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          <MessageInput onSend={handleSendMessage} disabled={loading} />
        </>
      )}
    </Paper>
  );
}

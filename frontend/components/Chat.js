'use client';

import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import useChat from '../hooks/useChat';

export default function Chat() {
  const { messages, loading, error, sendMessage } = useChat();

  return (
    <Paper sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}

      <MessageList messages={messages} />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <MessageInput onSend={sendMessage} disabled={loading} />
    </Paper>
  );
}

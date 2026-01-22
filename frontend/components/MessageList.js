'use client';

import { Box, Paper, Typography } from '@mui/material';

export default function MessageList({ messages }) {
  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            mb: 1,
          }}
        >
          <Paper
            sx={{
              p: 2,
              maxWidth: '70%',
              bgcolor: message.role === 'user' ? 'primary.main' : 'grey.200',
              color: message.role === 'user' ? 'white' : 'text.primary',
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

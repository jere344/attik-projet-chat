'use client';

import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, p: 2 }}>
      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écrivez votre message..."
        disabled={disabled}
        size="small"
      />
      <Button type="submit" variant="contained" disabled={disabled || !message.trim()}>
        <SendIcon />
      </Button>
    </Box>
  );
}

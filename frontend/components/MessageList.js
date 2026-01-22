'use client';

import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteButton = ({ onClick, placement, sx }) => (
  <Tooltip title="Supprimer ce message et les suivants" placement={placement}>
    <IconButton
      className="delete-button"
      size="small"
      onClick={onClick}
      sx={{ opacity: 0, transition: 'opacity 0.2s', alignSelf: 'center', ...sx }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Tooltip>
);

export default function MessageList({ messages, onDeleteMessage, isTyping }) {
  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              mb: 1,
              '&:hover .delete-button': { opacity: 1 },
            }}
          >
            {isUser && onDeleteMessage && (
              <DeleteButton onClick={() => onDeleteMessage(msg.id)} placement="left" sx={{ mr: 1 }} />
            )}
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: isUser ? 'primary.main' : 'grey.200',
                color: isUser ? 'white' : 'text.primary',
              }}
            >
              <Typography variant="body1">{msg.content}</Typography>
            </Paper>
            {!isUser && onDeleteMessage && (
              <DeleteButton onClick={() => onDeleteMessage(msg.id)} placement="right" sx={{ ml: 1 }} />
            )}
          </Box>
        );
      })}

        {isTyping && (
          <Box
            key="typing"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mb: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1,
                maxWidth: '40%',
                bgcolor: 'grey.200',
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                // dots animation
                '@keyframes dot': {
                  '0%': { transform: 'translateY(0)', opacity: 0.35 },
                  '50%': { transform: 'translateY(-4px)', opacity: 1 },
                  '100%': { transform: 'translateY(0)', opacity: 0.35 },
                },
                '& .dot': {
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'grey.500',
                  animation: 'dot 0.9s infinite ease-in-out',
                },
                '& .dot:nth-of-type(2)': { animationDelay: '0.12s' },
                '& .dot:nth-of-type(3)': { animationDelay: '0.24s' },
              }}
            >
              <Box sx={{ display: 'flex', gap: 0.5, px: 1 }} aria-hidden>
                <Box className="dot" />
                <Box className="dot" />
                <Box className="dot" />
              </Box>
            </Paper>
          </Box>
        )}
    </Box>
  );
}

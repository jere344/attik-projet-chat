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

export default function MessageList({ messages, onDeleteMessage }) {
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
    </Box>
  );
}

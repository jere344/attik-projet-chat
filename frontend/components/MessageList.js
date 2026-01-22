'use client';

import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';
import remarkGfh from 'remark-gfm';

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
                '& p': { m: 0, mb: 1, '&:last-child': { mb: 0 } },
                '& pre': { 
                  bgcolor: 'rgba(0,0,0,0.1)', 
                  p: 1, 
                  borderRadius: 1, 
                  overflow: 'auto',
                  my: 1
                },
                '& code': { 
                  bgcolor: 'rgba(0,0,0,0.1)', 
                  px: 0.5, 
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: '0.9em'
                },
                '& ul, & ol': { mt: 0, mb: 1, pl: 2 },
                '& li': { mb: 0.5 },
                '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 1, mb: 1 },
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfh]}>
                {msg.content}
              </ReactMarkdown>
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

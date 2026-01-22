'use client';

import { Box, List, ListItemButton, ListItemText, IconButton, Typography, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EmptyState from './EmptyState';

export default function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.100',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.dark',
          color: 'white',
        }}
      >
        <Typography variant="h6">Conversations</Typography>
        <IconButton color="inherit" onClick={onNewConversation} size="small">
          <AddIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Conversation list */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List disablePadding>
          {conversations?.length === 0 ? (
            <EmptyState
              message="Aucune conversation"
              subtitle="Cliquez sur + pour commencer"
            />
          ) : (
            conversations.map((conversation) => (
              <ListItemButton
                key={conversation.id}
                selected={conversation.id === currentConversationId}
                onClick={() => onSelectConversation(conversation.id)}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemText
                  primary={conversation.title}
                  secondary={formatDate(conversation.updatedAt)}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { fontWeight: conversation.id === currentConversationId ? 600 : 400 },
                  }}
                  secondaryTypographyProps={{
                    noWrap: true,
                    sx: { fontSize: '0.75rem' },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  sx={{ ml: 1, opacity: 0.6, '&:hover': { opacity: 1 } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            ))
          )}
        </List>
      </Box>
    </Box>
  );
}

'use client';

import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';

export default function AppSelector({ onSelectChat, onSelectCV }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: 'center',
          maxWidth: 600,
        }}
      >
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
          Bienvenue
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Choisissez une application pour commencer
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<ChatIcon />}
            onClick={onSelectChat}
            sx={{
              py: 3,
              px: 5,
              fontSize: '1.1rem',
              borderRadius: 3,
              textTransform: 'none',
            }}
          >
            Chat Général
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<DescriptionIcon />}
            onClick={onSelectCV}
            sx={{
              py: 3,
              px: 5,
              fontSize: '1.1rem',
              borderRadius: 3,
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': { borderWidth: 2 },
            }}
          >
            Générateur CV
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

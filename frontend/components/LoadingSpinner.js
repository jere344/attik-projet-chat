'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ message = 'Loading...', size = 48 }) {
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
      <CircularProgress size={size} />
      {message && <Typography color="text.secondary">{message}</Typography>}
    </Box>
  );
}

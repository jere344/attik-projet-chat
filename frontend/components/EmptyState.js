'use client';

import { Box, Typography } from '@mui/material';

export default function EmptyState({ message, subtitle }) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <Typography variant="body2">{message}</Typography>
      {subtitle && <Typography variant="caption">{subtitle}</Typography>}
    </Box>
  );
}

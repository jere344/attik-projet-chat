'use client';

import { useEffect } from 'react';
import AuthForm from './AuthForm';
import ChatApp from './ChatApp';
import useAuth from '../hooks/useAuth';
import { Box, Button, AppBar, Toolbar, Typography } from '@mui/material';

export default function AppShell() {
  const auth = useAuth();

  // ensure client-side render after hydration
  useEffect(() => {}, []);

  const token = auth?.token;

  if (!token) {
    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Chat IA
            </Typography>
          </Toolbar>
        </AppBar>
        <AuthForm />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chat IA
          </Typography>
          <Button color="inherit" onClick={() => auth.logout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <ChatApp />
      </Box>
    </Box>
  );
}

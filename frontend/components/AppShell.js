'use client';

import AuthForm from './AuthForm';
import ChatApp from './ChatApp';
import LoadingSpinner from './LoadingSpinner';
import useAuth from '../hooks/useAuth';
import { Box, Button, AppBar, Toolbar, Typography } from '@mui/material';

export default function AppShell() {
  const { token, loading, logout } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

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
          <Button color="inherit" onClick={logout}>
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

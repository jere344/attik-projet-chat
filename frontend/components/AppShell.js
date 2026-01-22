'use client';

import { useEffect } from 'react';
import AuthForm from './AuthForm';
import Chat from './Chat';
import useAuth from '../hooks/useAuth';
import { Box, Button, AppBar, Toolbar, Typography } from '@mui/material';

export default function AppShell() {
  const auth = useAuth();

  // ensure client-side render after hydration
  useEffect(() => {}, []);

  const token = auth?.token;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chat IA
          </Typography>
          {token && (
            <Button color="inherit" onClick={() => auth.logout()}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {!token ? <AuthForm /> : <Chat />}
    </Box>
  );
}

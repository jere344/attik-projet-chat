'use client';

import { useState } from 'react';
import AuthForm from './AuthForm';
import ChatApp from './ChatApp';
import CVGenerator from './CVGenerator';
import AppSelector from './AppSelector';
import LoadingSpinner from './LoadingSpinner';
import useAuth from '../hooks/useAuth';
import { Box, Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AppShell() {
  const { token, loading, logout } = useAuth();
  const [currentApp, setCurrentApp] = useState(null); // null, 'chat', or 'cv'

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

  const handleBack = () => setCurrentApp(null);

  const getTitle = () => {
    if (currentApp === 'chat') return 'Chat IA';
    if (currentApp === 'cv') return 'Générateur de CV';
    return 'Accueil';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          {currentApp && (
            <IconButton color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {getTitle()}
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {!currentApp && (
          <AppSelector
            onSelectChat={() => setCurrentApp('chat')}
            onSelectCV={() => setCurrentApp('cv')}
          />
        )}
        {currentApp === 'chat' && <ChatApp />}
        {currentApp === 'cv' && <CVGenerator />}
      </Box>
    </Box>
  );
}

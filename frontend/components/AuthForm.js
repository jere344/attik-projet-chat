'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import useAuth from '../hooks/useAuth';

export default function AuthForm() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {mode === 'login' ? 'Se connecter' : "S'inscrire"}
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, v) => v && setMode(v)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="login">Login</ToggleButton>
        <ToggleButton value="register">Register</ToggleButton>
      </ToggleButtonGroup>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" fullWidth>
          {mode === 'login' ? 'Se connecter' : "S'inscrire"}
        </Button>
      </form>
    </Box>
  );
}

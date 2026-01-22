'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Collapse,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmptyState from './EmptyState';

export default function CVCenterPanel({
  company,
  onUpdateCompany,
  chatHistory,
  onSendMessage,
  onGenerateInitial,
  chatLoading,
  chatError,
}) {
  const [positionExpanded, setPositionExpanded] = useState(true);
  const [positionInfo, setPositionInfo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [hasPositionChanges, setHasPositionChanges] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync local state with company data
  useEffect(() => {
    if (company) {
      setPositionInfo(company.positionInfo || '');
      setCompanyName(company.name || '');
      setHasPositionChanges(false);
    }
  }, [company?.id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handlePositionChange = (field, value) => {
    if (field === 'positionInfo') {
      setPositionInfo(value);
    } else {
      setCompanyName(value);
    }
    setHasPositionChanges(true);
  };

  const handleSavePosition = async () => {
    await onUpdateCompany({ positionInfo, name: companyName });
    setHasPositionChanges(false);
    // Collapse position info after saving
    setPositionExpanded(false);
  };

  const handleGenerate = async () => {
    if (!positionInfo.trim()) return;
    // Save position first if there are changes
    if (hasPositionChanges) {
      await onUpdateCompany({ positionInfo, name: companyName });
      setHasPositionChanges(false);
    }
    setPositionExpanded(false);
    await onGenerateInitial();
  };

  const handleSendMessage = async () => {
    if (!message.trim() || chatLoading) return;
    const msg = message;
    setMessage('');
    await onSendMessage(msg);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canChat = company?.positionInfo?.trim();
  const hasGenerated = chatHistory.length > 0;

  if (!company) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState message="Sélectionnez ou créez une entreprise" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        minWidth: 350,
      }}
    >
      {/* Position Information Section */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'secondary.dark',
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => setPositionExpanded(!positionExpanded)}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Informations du poste
          </Typography>
          {positionExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>

        <Collapse in={positionExpanded}>
          <Box sx={{ p: 2 }}>
            <TextField
              label="Nom de l'entreprise"
              fullWidth
              size="small"
              value={companyName}
              onChange={(e) => handlePositionChange('name', e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              multiline
              rows={6}
              fullWidth
              placeholder="Collez ici l'offre d'emploi (description du poste, compétences requises, etc.)"
              value={positionInfo}
              onChange={(e) => handlePositionChange('positionInfo', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              {hasPositionChanges && (
                <Button variant="outlined" size="small" onClick={handleSavePosition}>
                  Enregistrer
                </Button>
              )}
              {positionInfo.trim() && !hasGenerated && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={handleGenerate}
                  disabled={chatLoading}
                >
                  Générer CV & Lettre
                </Button>
              )}
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Chat Section */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!canChat ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <EmptyState
              message="Remplissez les informations du poste"
              subtitle="Le chat sera disponible une fois l'offre d'emploi ajoutée"
            />
          </Box>
        ) : (
          <>
            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
              {chatHistory.length === 0 ? (
                <EmptyState
                  message="Prêt à générer"
                  subtitle="Cliquez sur 'Générer CV & Lettre' pour commencer"
                />
              ) : (
                <List>
                  {chatHistory.map((msg, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        px: 0,
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          maxWidth: '85%',
                          bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                          color: msg.role === 'user' ? 'white' : 'text.primary',
                          borderRadius: 2,
                        }}
                      >
                        <ListItemText
                          primary={msg.content}
                          primaryTypographyProps={{
                            sx: { whiteSpace: 'pre-wrap', fontSize: '0.9rem' },
                          }}
                        />
                      </Paper>
                    </ListItem>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              )}

              {chatLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>

            {/* Error display */}
            {chatError && (
              <Typography color="error" sx={{ px: 2, py: 1, fontSize: '0.85rem' }}>
                {chatError}
              </Typography>
            )}

            {/* Input */}
            {hasGenerated && (
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Demandez des modifications..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={chatLoading}
                    multiline
                    maxRows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || chatLoading}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

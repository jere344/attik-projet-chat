'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Collapse,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import EmptyState from './EmptyState';

export default function CVLeftPanel({
  profile,
  onUpdateProfile,
  profileSaving,
  companies,
  currentCompanyId,
  onSelectCompany,
  onCreateCompany,
  onDeleteCompany,
}) {
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [profileContent, setProfileContent] = useState(profile?.content || '');
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileChange = (e) => {
    setProfileContent(e.target.value);
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    await onUpdateProfile(profileContent);
    setHasChanges(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      // For PDF files, extract text using pdf.js
      try {
        const text = await extractPDFText(file);
        setProfileContent(text);
        setHasChanges(true);
      } catch {
        alert('Erreur lors de la lecture du PDF. Veuillez copier-coller le contenu manuellement.');
      }
    } else {
      // For text files
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileContent(event.target?.result || '');
        setHasChanges(true);
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        width: 300,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      {/* Profile Section */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.dark',
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => setProfileExpanded(!profileExpanded)}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Mon CV
          </Typography>
          {profileExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>

        <Collapse in={profileExpanded}>
          <Box sx={{ p: 2 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.txt,.doc,.docx"
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
              sx={{ mb: 2 }}
            >
              Importer un fichier
            </Button>

            <TextField
              multiline
              rows={8}
              fullWidth
              placeholder="Collez ici le contenu de votre CV (expériences, formation, compétences...)"
              value={profileContent}
              onChange={handleProfileChange}
              size="small"
              sx={{ mb: 1 }}
            />

            {hasChanges && (
              <Button
                variant="contained"
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                disabled={profileSaving}
                fullWidth
              >
                {profileSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* Companies Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Entreprises
        </Typography>
        <IconButton color="inherit" onClick={() => onCreateCompany()} size="small">
          <AddIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List disablePadding>
          {companies?.length === 0 ? (
            <EmptyState message="Aucune entreprise" subtitle="Cliquez sur + pour ajouter" />
          ) : (
            companies.map((company) => (
              <ListItemButton
                key={company.id}
                selected={company.id === currentCompanyId}
                onClick={() => onSelectCompany(company.id)}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    '&:hover': { bgcolor: 'primary.light' },
                  },
                }}
              >
                <ListItemText
                  primary={company.name}
                  secondary={formatDate(company.updatedAt)}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontWeight: company.id === currentCompanyId ? 600 : 400,
                  }}
                  secondaryTypographyProps={{ noWrap: true, fontSize: '0.75rem' }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCompany(company.id);
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

// PDF text extraction using pdf.js
async function extractPDFText(file) {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n';
  }
  
  return text.trim();
}

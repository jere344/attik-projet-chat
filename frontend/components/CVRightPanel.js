'use client';

import { useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { renderCV, templateList } from '../lib/cvTemplates';
import EmptyState from './EmptyState';

export default function CVRightPanel({ company, onUpdateTemplate }) {
  const cvRef = useRef(null);
  const letterRef = useRef(null);

  const cvData = company?.generatedCV || {};
  const letter = company?.generatedLetter || '';
  const selectedTemplate = company?.selectedTemplate || 'modern';

  const hasContent = Object.keys(cvData).length > 0 || letter;

  const handleTemplateChange = (_, newTemplate) => {
    if (newTemplate) {
      onUpdateTemplate(newTemplate);
    }
  };

  const handleDownloadCV = () => {
    if (!cvRef.current) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CV - ${cvData.fullName || 'Mon CV'}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${cvRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadLetter = () => {
    if (!letter) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lettre de motivation - ${company?.name || 'Entreprise'}</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              max-width: 700px;
              margin: 40px auto;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            @media print {
              body { margin: 0; padding: 2cm; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${letter.replace(/\n/g, '<br>')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!company) {
    return (
      <Box sx={{ width: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
        <EmptyState message="Sélectionnez une entreprise" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 450,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
        overflow: 'hidden',
      }}
    >
      {!hasContent ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState
            message="CV & Lettre apparaîtront ici"
            subtitle="Remplissez les informations et générez"
          />
        </Box>
      ) : (
        <>
          {/* CV Section */}
          <Paper elevation={0} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'white',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                CV Généré
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ToggleButtonGroup
                  value={selectedTemplate}
                  exclusive
                  onChange={handleTemplateChange}
                  size="small"
                >
                  {templateList.map(({ key, name }) => (
                    <ToggleButton key={key} value={key} sx={{ py: 0.5, px: 1.5, fontSize: '0.75rem' }}>
                      {name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadCV}
                  disabled={!Object.keys(cvData).length}
                >
                  PDF
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                bgcolor: '#e0e0e0',
                p: 2,
              }}
            >
              <Paper
                ref={cvRef}
                elevation={2}
                sx={{
                  minHeight: '100%',
                  bgcolor: 'white',
                  '& > div': { minHeight: '100%' },
                }}
                dangerouslySetInnerHTML={{ __html: renderCV(selectedTemplate, cvData) }}
              />
            </Box>
          </Paper>

          <Divider />

          {/* Letter Section */}
          <Paper elevation={0} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'white',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                Lettre de Motivation
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadLetter}
                disabled={!letter}
              >
                PDF
              </Button>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                bgcolor: '#e0e0e0',
                p: 2,
              }}
            >
              <Paper
                ref={letterRef}
                elevation={2}
                sx={{
                  p: 4,
                  minHeight: '100%',
                  bgcolor: 'white',
                  fontFamily: '"Times New Roman", Times, serif',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  color: '#333',
                }}
              >
                {letter || 'La lettre de motivation apparaîtra ici...'}
              </Paper>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}

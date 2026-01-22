'use client';

import { Box } from '@mui/material';
import CVLeftPanel from './CVLeftPanel';
import CVCenterPanel from './CVCenterPanel';
import CVRightPanel from './CVRightPanel';
import LoadingSpinner from './LoadingSpinner';
import useCVProfile from '../hooks/useCVProfile';
import useCVCompanies from '../hooks/useCVCompanies';
import useCVChat from '../hooks/useCVChat';

export default function CVGenerator() {
  const { profile, loading: profileLoading, saving: profileSaving, updateProfile } = useCVProfile();
  const {
    companies,
    currentCompanyId,
    currentCompany,
    loading: companiesLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    selectCompany,
    refreshCurrentCompany,
    updateCurrentCompanyLocally,
  } = useCVCompanies();

  const handleChatUpdate = (result) => {
    // Update current company state immediately with data from chat response
    if (result) {
      updateCurrentCompanyLocally({
        chatHistory: result.chatHistory,
        generatedLetter: result.letter,
        generatedCV: result.cvData,
      });
    }
  };

  const { loading: chatLoading, error: chatError, sendMessage, generateInitial } = useCVChat(
    currentCompanyId,
    handleChatUpdate
  );

  if (profileLoading || companiesLoading) {
    return <LoadingSpinner message="Chargement..." />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left Column: Personal Info + Companies */}
      <CVLeftPanel
        profile={profile}
        onUpdateProfile={updateProfile}
        profileSaving={profileSaving}
        companies={companies}
        currentCompanyId={currentCompanyId}
        onSelectCompany={selectCompany}
        onCreateCompany={createCompany}
        onDeleteCompany={deleteCompany}
      />

      {/* Center Column: Position Info + Chat */}
      <CVCenterPanel
        company={currentCompany}
        onUpdateCompany={(data) => updateCompany(currentCompanyId, data)}
        chatHistory={currentCompany?.chatHistory || []}
        onSendMessage={sendMessage}
        onGenerateInitial={generateInitial}
        chatLoading={chatLoading}
        chatError={chatError}
      />

      {/* Right Column: Generated CV + Letter */}
      <CVRightPanel
        company={currentCompany}
        onUpdateTemplate={(template) => updateCompany(currentCompanyId, { selectedTemplate: template })}
      />
    </Box>
  );
}

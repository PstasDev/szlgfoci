'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as LiveIcon,
  Schedule as UpcomingIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

interface MatchesLayoutProps {
  children: React.ReactNode;
  activeTab: 'live' | 'upcoming' | 'recent';
  onTabChange: (tab: 'live' | 'upcoming' | 'recent') => void;
}

const MatchesLayout: React.FC<MatchesLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const tabs = [
    { id: 'live', label: 'Élő Meccsek', icon: <LiveIcon /> },
    { id: 'upcoming', label: 'Közelgő Meccsek', icon: <UpcomingIcon /> },
    { id: 'recent', label: 'Befejezett Meccsek', icon: <HistoryIcon /> },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue as 'live' | 'upcoming' | 'recent');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 0 }}>
        {/* Header Section */}
        <Box sx={{ pt: 4, pb: 2 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'center',
              mb: 1
            }}
          >
            Meccsek
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              mb: 3
            }}
          >
            SZLG Liga 24/25 - Élő, közelgő és befejezett meccsek
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Paper 
          elevation={1} 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'fullWidth' : 'standard'}
            centered={!isMobile}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                py: 2,
                minHeight: 64,
                textTransform: 'none',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content Area */}
        <Box sx={{ pb: 4 }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default MatchesLayout;

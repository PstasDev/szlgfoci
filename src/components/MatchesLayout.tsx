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
      <Container maxWidth="lg" sx={{ py: 0, px: { xs: 1, sm: 2 } }}>
        {/* Header Section */}
        <Box sx={{ pt: { xs: 2, sm: 3, md: 4 }, pb: 2 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'center',
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Meccsek
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1rem', sm: '1.25rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            SZLG Liga 24/25 - Élő, közelgő és befejezett meccsek
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Paper 
          elevation={1} 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            borderRadius: 2,
            overflow: 'hidden',
            mx: { xs: 0, sm: 0 }
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
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                py: { xs: 1.5, sm: 2 },
                minHeight: { xs: 56, sm: 64 },
                textTransform: 'none',
                px: { xs: 0.5, sm: 1, md: 2 }
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
                label={isMobile ? tab.label.replace(' Meccsek', '') : tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 0.5, sm: 1 }
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content Area */}
        <Box sx={{ pb: { xs: 3, sm: 4 } }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default MatchesLayout;

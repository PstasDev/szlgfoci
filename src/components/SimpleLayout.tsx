'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import ErrorDisplay from './ErrorDisplay';
import { useTournaments } from '@/hooks/useTournaments';
import { getErrorInfo } from '@/utils/errorUtils';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const [selectedSeason, setSelectedSeason] = React.useState('1'); // Default to tournament ID 1
  const [mounted, setMounted] = React.useState(false);
  
  const { tournaments, loading, error, refetch } = useTournaments();

  React.useEffect(() => {
    // Load selected season from localStorage
    const saved = localStorage.getItem('szlg-selected-season');
    if (saved) {
      setSelectedSeason(saved);
    }
    setMounted(true);
  }, []);

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    localStorage.setItem('szlg-selected-season', season);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted || loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
        <Header />
        <Box sx={{ pt: 8, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ color: '#e8eaed', textAlign: 'center', py: 4 }}>
            Betöltés...
          </Box>
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    const errorInfo = getErrorInfo('tournaments', error);
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
        <Header />
        <Box sx={{ pt: 8, px: { xs: 2, sm: 3 } }}>
          <ErrorDisplay 
            errorInfo={errorInfo}
            onRetry={refetch}
            variant="box"
          />
        </Box>
      </Box>
    );
  }

  // Find current tournament
  const currentTournament = tournaments.find(tournament => 
    tournament.id && tournament.id.toString() === selectedSeason
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
      
      <Box sx={{ 
        pt: { xs: 7, sm: 8 }, // Account for AppBar height
        px: { xs: 0, sm: 0 }, // Remove padding as children components handle their own
        minHeight: 'calc(100vh - 64px)'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default SimpleLayout;

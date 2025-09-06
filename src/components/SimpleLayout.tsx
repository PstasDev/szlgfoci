'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import UpcomingSeason from './UpcomingSeason';
import { leagueSeasons } from '@/data/mockData';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [mounted, setMounted] = React.useState(false);

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
  if (!mounted) {
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

  // Show upcoming season page if 2025-26 is selected
  const currentSeason = leagueSeasons.find(season => season.id === selectedSeason);
  const showUpcomingSeason = selectedSeason === '2025-26' || !currentSeason?.active;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
      
      <Box sx={{ 
        pt: { xs: 7, sm: 8 }, // Account for AppBar height
        px: { xs: 0, sm: 0 }, // Remove padding as children components handle their own
        minHeight: 'calc(100vh - 64px)'
      }}>
        {showUpcomingSeason ? (
          <UpcomingSeason season={currentSeason} />
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

export default SimpleLayout;

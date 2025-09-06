'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import Header from '@/components/Header';
import LiveMatches from '@/components/LiveMatches';
import UpcomingSeason from '@/components/UpcomingSeason';

export default function Home() {
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
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
      </Box>
    );
  }

  // Show upcoming season view if 25/26 is selected
  if (selectedSeason === '2025-26') {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
        <UpcomingSeason />
      </Box>
    );
  }

  // Show current season data for 24/25
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Page Title */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1
              }}
            >
              SZLG FOCI - Labdarúgó Bajnokság 2024/25
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              SZLG Liga 24/25 - Élő eredmények és tabella
            </Typography>
          </Box>

          <Divider />

          {/* Class Color Legend Section
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              Osztály Színkódok
            </Typography>
            <ClassColorLegend />
          </Box>

          <Divider />

          {/* Live Matches Section */}
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              Élő Meccsek & Eredmények
            </Typography>
            <LiveMatches />
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', py: 4, mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 SZLG - Labdarúgó Bajnokság
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

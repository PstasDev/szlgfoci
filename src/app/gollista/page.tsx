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
import GoalScorersList from '@/components/GoalScorersList';

export default function GoalScorersPage() {
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

  // Show message for upcoming season
  if (selectedSeason === '2025-26') {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" color="primary.main" gutterBottom>
            Góllövőlista
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A SZLG Liga 25/26 góllövőlista elérhető lesz a szezon kezdete után.
            <br />
            Kezdés: 2025. október 15.
          </Typography>
        </Container>
      </Box>
    );
  }

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
              Góllövőlista
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              SZLG Liga 24/25 - Top góllövők
            </Typography>
          </Box>

          <Divider />

          {/* Goal Scorers Section */}
          <Box>
            <GoalScorersList />
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

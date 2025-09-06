'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';
import Header from '@/components/Header';
import MatchesLayout from '@/components/MatchesLayout';
import LiveMatches from '@/components/LiveMatches';
import { getLiveMatches, getUpcomingMatches, getRecentMatches } from '@/data/mockData';

export default function MatchesPage() {
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [activeTab, setActiveTab] = React.useState<'live' | 'upcoming' | 'recent'>('live');
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
        <MatchesLayout activeTab={activeTab} onTabChange={setActiveTab}>
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" gutterBottom>
              SZLG Liga 25/26 Meccsek
            </Typography>
            <Typography variant="h6" color="text.secondary">
              A meccsek részletei elérhető lesznek a szezon kezdete után.
              <br />
              Kezdés: 2025. október 15.
            </Typography>
          </Box>
        </MatchesLayout>
      </Box>
    );
  }

  const renderMatchContent = () => {
    switch (activeTab) {
      case 'live':
        const liveMatches = getLiveMatches();
        return (
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 600 }}>
              🔴 Élő Meccsek ({liveMatches.length})
            </Typography>
            {liveMatches.length > 0 ? (
              <LiveMatches />
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  Jelenleg nincs élő mérkőzés
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  A következő meccseket a "Közelgő Meccsek" fülön találja
                </Typography>
              </Box>
            )}
          </Stack>
        );
      
      case 'upcoming':
        const upcomingMatches = getUpcomingMatches(10);
        return (
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ color: 'info.main', fontWeight: 600 }}>
              📅 Közelgő Meccsek ({upcomingMatches.length})
            </Typography>
            <LiveMatches />
          </Stack>
        );
      
      case 'recent':
        const recentMatches = getRecentMatches(10);
        return (
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              ✅ Befejezett Meccsek ({recentMatches.length})
            </Typography>
            <LiveMatches />
          </Stack>
        );
      
      default:
        return <LiveMatches />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
      
      <MatchesLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderMatchContent()}
      </MatchesLayout>
    </Box>
  );
}

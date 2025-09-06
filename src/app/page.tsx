'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import SimpleLayout from '@/components/SimpleLayout';
import MatchCard from '@/components/MatchCard';
import MatchesList from '@/components/MatchesList';
import LeagueTable from '@/components/LeagueTable';
import { getLiveMatches, getUpcomingMatches, getRecentMatches } from '@/data/mockData';

export default function Home() {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [mounted, setMounted] = React.useState(false);

  const liveMatches = getLiveMatches();
  const upcomingMatches = getUpcomingMatches(3);
  const recentMatches = getRecentMatches(3);

  React.useEffect(() => {
    // Load selected season from localStorage
    const saved = localStorage.getItem('szlg-selected-season');
    if (saved) {
      setSelectedSeason(saved);
    }
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
        <Typography variant="h6" sx={{ color: '#e8eaed', p: 2 }}>
          Betöltés...
        </Typography>
      </Box>
    );
  }

  // Get featured match
  const featuredMatch = liveMatches[0] || recentMatches[0] || upcomingMatches[0];

  return (
    <SimpleLayout>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 3, sm: 4 }}>
          {/* Featured Match */}
          {featuredMatch && (
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#e8eaed',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Kiemelt mérkőzés
              </Typography>
              <MatchCard match={featuredMatch} variant="detailed" />
            </Box>
          )}

          {/* League Table */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#e8eaed',
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Liga tabella
            </Typography>
            <LeagueTable />
          </Box>

          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <MatchesList
              matches={liveMatches}
              title="Élő mérkőzések"
              variant="compact"
              layout="grid"
            />
          )}

          {/* Matches Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
            gap: { xs: 3, sm: 4 }
          }}>
            {/* Upcoming Matches */}
            <MatchesList
              matches={upcomingMatches}
              title="Következő mérkőzések"
              variant="compact"
              layout="list"
            />

            {/* Recent Results */}
            <MatchesList
              matches={recentMatches}
              title="Legutóbbi eredmények"
              variant="compact"
              layout="list"
            />
          </Box>
        </Stack>
      </Box>
    </SimpleLayout>
  );
}

'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';
import SimpleLayout from '@/components/SimpleLayout';
import MatchesLayout from '@/components/MatchesLayout';
import MatchesList from '@/components/MatchesList';
import LiveMatches from '@/components/LiveMatches';
import { getLiveMatches, getUpcomingMatches, getRecentMatches } from '@/data/mockData';

export default function MatchesPage() {
  const [activeTab, setActiveTab] = React.useState<'live' | 'upcoming' | 'recent'>('live');

  const renderMatchContent = () => {
    switch (activeTab) {
      case 'live':
        const liveMatches = getLiveMatches();
        return (
          <Stack spacing={3}>
            {liveMatches.length > 0 ? (
              <MatchesList
                matches={liveMatches}
                title="🔴 Élő Mérkőzések"
                variant="detailed"
                layout="list"
              />
            ) : (
              <Box sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
                backgroundColor: '#2d2d2d',
                borderRadius: '16px',
                border: '1px solid #404040',
                maxWidth: '600px',
                mx: 'auto'
              }}>
                <Typography variant="h3" sx={{ color: '#9aa0a6', mb: 3, fontSize: '3rem' }}>
                  📺
                </Typography>
                <Typography variant="h5" sx={{ color: '#e8eaed', mb: 2, fontWeight: 600 }}>
                  Jelenleg nincs élő mérkőzés
                </Typography>
                <Typography variant="body1" sx={{ color: '#9aa0a6', fontSize: '1.1rem' }}>
                  A következő meccseket a "Közelgő Meccsek" fülön találja
                </Typography>
              </Box>
            )}
          </Stack>
        );
      
      case 'upcoming':
        const upcomingMatches = getUpcomingMatches(10);
        return (
          <MatchesList
            matches={upcomingMatches}
            title="📅 Közelgő Mérkőzések"
            variant="detailed"
            layout="list"
            emptyMessage="Nincsenek tervezett mérkőzések a közeljövőben."
          />
        );
      
      case 'recent':
        const recentMatches = getRecentMatches(10);
        return (
          <MatchesList
            matches={recentMatches}
            title="✅ Befejezett Mérkőzések"
            variant="compact"
            layout="list"
            emptyMessage="Nincsenek befejezett mérkőzések."
          />
        );
      
      default:
        return (
          <MatchesList
            matches={getLiveMatches()}
            title="Mérkőzések"
            variant="detailed"
            layout="list"
          />
        );
    }
  };

  return (
    <SimpleLayout>
      <Box sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
        <MatchesLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderMatchContent()}
        </MatchesLayout>
      </Box>
    </SimpleLayout>
  );
}

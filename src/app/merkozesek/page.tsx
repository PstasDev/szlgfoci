'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import SimpleLayout from '@/components/SimpleLayout';
import MatchesLayout from '@/components/MatchesLayout';
import MatchesList from '@/components/MatchesList';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { useMatchesByStatus } from '@/hooks/useTournamentData';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';
import { hasTournamentStarted } from '@/utils/dataUtils';

export default function MatchesPage() {
  const [activeTab, setActiveTab] = React.useState<'live' | 'upcoming' | 'recent'>('live');
  const { matches, tournament, loading, error, refetch } = useTournamentContext();
  const { liveMatches, upcomingMatches, recentMatches } = useMatchesByStatus(matches);

  if (loading) {
    return (
      <SimpleLayout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <CircularProgress sx={{ color: '#42a5f5' }} />
        </Box>
      </SimpleLayout>
    );
  }

  // Check if tournament has started
  if (tournament && !hasTournamentStarted(tournament)) {
    return (
      <SimpleLayout>
        <Stack spacing={4} sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            A torna még nem kezdődött el
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            {tournament.name}
          </Typography>
          {tournament.start_date && (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Kezdés dátuma: {new Date(tournament.start_date).toLocaleDateString('hu-HU')}
            </Typography>
          )}
          {tournament.registration_by_link ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                Regisztráció a tornára:
              </Typography>
              <a 
                href={tournament.registration_by_link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#42a5f5', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Regisztrálok a tornára
              </a>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 4 }}>
              A regisztráció hamarosan elérhető lesz
            </Typography>
          )}
        </Stack>
      </SimpleLayout>
    );
  }

  if (error || (isEmptyDataError(matches) && !loading)) {
    const errorInfo = getErrorInfo('matches', error ? { message: error } : undefined);
    return (
      <SimpleLayout>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
          <ErrorDisplay 
            errorInfo={errorInfo}
            onRetry={refetch}
            fullPage
          />
        </Box>
      </SimpleLayout>
    );
  }

  const renderMatchContent = () => {
    switch (activeTab) {
      case 'live':
        return (
          <Stack spacing={3}>
            {liveMatches.length > 0 ? (
              <MatchesList
                matches={liveMatches}
                title="� Élő Mérkőzések"
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
                  A következő meccseket a &ldquo;Közelgő Meccsek&rdquo; fülön találja
                </Typography>
              </Box>
            )}
          </Stack>
        );
      
      case 'upcoming':
        return (
          <MatchesList
            matches={upcomingMatches.slice(0, 10)}
            title="📅 Közelgő Mérkőzések"
            variant="detailed"
            layout="list"
            emptyMessage="Nincsenek tervezett mérkőzések a közeljövőben."
          />
        );
      
      case 'recent':
        return (
          <MatchesList
            matches={recentMatches.slice(0, 10)}
            title="✅ Befejezett Mérkőzések"
            variant="compact"
            layout="list"
            emptyMessage="Nincsenek befejezett mérkőzések."
          />
        );
      
      default:
        return (
          <MatchesList
            matches={liveMatches}
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

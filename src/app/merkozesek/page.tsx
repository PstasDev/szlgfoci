'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Container,
} from '@mui/material';
import SimpleLayout from '@/components/SimpleLayout';
import MatchesTable from '@/components/MatchesTable';
import MatchInsights from '@/components/MatchInsights';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';
import { hasTournamentStarted } from '@/utils/dataUtils';

export default function MatchesPage() {
  const { matches, tournament, loading, error, refetch } = useTournamentContext();

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

  return (
    <SimpleLayout>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ py: 0, px: { xs: 1, sm: 2 } }}>
          {/* Header Section */}
          <Box sx={{ pt: { xs: 2, sm: 3, md: 4 }, pb: 3 }}>
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
              Mérkőzések
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                textAlign: 'center',
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              {tournament?.name || 'Torna'} - Minden mérkőzés egy helyen
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ pb: { xs: 3, sm: 4 } }}>
            {/* Insights Section */}
            <MatchInsights matches={matches} />
            
            {/* Matches Table */}
            <MatchesTable matches={matches} />
          </Box>
        </Container>
      </Box>
    </SimpleLayout>
  );
}
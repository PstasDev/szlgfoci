'use client';

import React from 'react';
import {
  Typography,
  Box,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import SimpleLayout from '@/components/SimpleLayout';
import LeagueTable from '@/components/LeagueTable';
import ClassColorLegend from '@/components/ClassColorLegend';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { hasTournamentStarted } from '@/utils/dataUtils';

export default function TablePage() {
  const { tournament, loading, error } = useTournamentContext();

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

  if (error) {
    return (
      <SimpleLayout>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
          <Alert severity="error" sx={{ backgroundColor: '#d32f2f', color: '#fff' }}>
            {error}
          </Alert>
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

  return (
    <SimpleLayout>
      <Stack spacing={4}>
        {/* Page Title */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#e8eaed',
              mb: 1
            }}
          >
            Liga Tabella
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#9aa0a6',
              mb: 2 
            }}
          >
            {tournament?.name || 'SZLG Liga'} - Aktuális állás
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Class Color Legend Section */}
        <Box>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              color: '#e8eaed',
              mb: 3
            }}
          >
            Osztály Színkódok
          </Typography>
          <ClassColorLegend />
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* League Table Section */}
        <Box>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              color: '#e8eaed',
              mb: 3
            }}
          >
            Tabella
          </Typography>
          <LeagueTable />
        </Box>
      </Stack>
    </SimpleLayout>
  );
}

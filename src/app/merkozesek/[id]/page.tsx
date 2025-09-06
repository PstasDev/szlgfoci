'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import MatchDetailView from '@/components/MatchDetailView';
import { matches, Match } from '@/data/mockData';

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [mounted, setMounted] = React.useState(false);

  const matchId = parseInt(params.id as string);
  const match = matches.find(m => m.id === matchId);

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

  if (!match) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" color="error.main" gutterBottom>
            Mérkőzés nem található
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            A keresett mérkőzés nem létezik vagy törölve lett.
          </Typography>
          <Button
            variant="contained"
            startIcon={<BackIcon />}
            onClick={() => router.push('/merkozesek')}
          >
            Vissza a meccsekhez
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Back Button */}
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.back()}
            sx={{ alignSelf: 'flex-start' }}
          >
            Vissza
          </Button>

          {/* Match Detail */}
          <MatchDetailView match={match} />

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

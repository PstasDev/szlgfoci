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
import SimpleLayout from '@/components/SimpleLayout';
import MatchDetailView from '@/components/MatchDetailView';
import { matches, Match } from '@/data/mockData';

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  const matchId = parseInt(params.id as string);
  const match = matches.find(m => m.id === matchId);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <SimpleLayout>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Typography variant="h6" sx={{ color: '#e8eaed' }}>
            Betöltés...
          </Typography>
        </Container>
      </SimpleLayout>
    );
  }

  if (!match) {
    return (
      <SimpleLayout>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
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
              sx={{
                bgcolor: '#4285f4',
                '&:hover': { bgcolor: '#1976d2' }
              }}
            >
              Vissza a meccsekhez
            </Button>
          </Stack>
        </Container>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          {/* Back Button */}
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.back()}
            sx={{ 
              alignSelf: 'flex-start',
              color: '#9aa0a6',
              '&:hover': {
                backgroundColor: 'rgba(154, 160, 166, 0.08)',
              }
            }}
          >
            Vissza
          </Button>

          {/* Match Detail */}
          <MatchDetailView match={match} />
        </Stack>
      </Container>
    </SimpleLayout>
  );
}

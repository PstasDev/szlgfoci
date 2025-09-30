'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import SimpleLayout from '@/components/SimpleLayout';
import BentoMatchDetail from '@/components/BentoMatchDetail';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTournamentData } from '@/hooks/useTournamentData';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const { matches, loading, error, refetch } = useTournamentData();

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

  // Show loading state
  if (loading) {
    return (
      <SimpleLayout>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress sx={{ color: '#42a5f5' }} />
          </Box>
        </Container>
      </SimpleLayout>
    );
  }

  // Show error state
  if (error || (isEmptyDataError(matches) && !loading)) {
    const errorInfo = getErrorInfo('matches', error ? { message: error } : undefined);
    return (
      <SimpleLayout>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <ErrorDisplay 
            errorInfo={errorInfo}
            onRetry={refetch}
            fullPage
          />
        </Container>
      </SimpleLayout>
    );
  }

  if (!match) {
    const errorInfo = getErrorInfo('match');
    return (
      <SimpleLayout>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
          <ErrorDisplay 
            errorInfo={errorInfo}
            fullPage
          />
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
          <BentoMatchDetail match={match} />
        </Stack>
      </Container>
    </SimpleLayout>
  );
}

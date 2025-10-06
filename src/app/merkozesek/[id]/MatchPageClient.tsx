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
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import SimpleLayout from '@/components/SimpleLayout';
import BentoMatchDetail from '@/components/BentoMatchDetail';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useMatchData } from '@/hooks/useMatchData';
import { getErrorInfo } from '@/utils/errorUtils';

export default function MatchPageClient() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [copySnackbarOpen, setCopySnackbarOpen] = React.useState(false);
  
  const matchId = parseInt(params.id as string);
  const { match, loading, error, refetch } = useMatchData(matchId, {
    enableLiveUpdates: true,
    updateInterval: 2000 // 2 seconds for all matches
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle sharing by copying link to clipboard
  const handleShare = async () => {
    try {
      const url = window.location.href;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopySnackbarOpen(true);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // You could show an error message here if needed
    }
  };

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
  if (error) {
    const errorInfo = getErrorInfo('match', { message: error });
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
          {/* Header with Back Button and Share */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => router.back()}
              sx={{ 
                color: '#9aa0a6',
                '&:hover': {
                  backgroundColor: 'rgba(154, 160, 166, 0.08)',
                }
              }}
            >
              Vissza
            </Button>
            
            <Button
              startIcon={<ShareIcon />}
              onClick={handleShare}
              sx={{
                color: '#42a5f5',
                border: '1px solid #42a5f5',
                '&:hover': {
                  backgroundColor: 'rgba(66, 165, 245, 0.08)',
                },
              }}
            >
              Megosztás
            </Button>
          </Box>

          {/* Match Detail */}
          <BentoMatchDetail match={match} />
        </Stack>

        {/* Copy Success Snackbar */}
        <Snackbar
          open={copySnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setCopySnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setCopySnackbarOpen(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            Link vágólapra másolva!
          </Alert>
        </Snackbar>
      </Container>
    </SimpleLayout>
  );
}
'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import ErrorDisplay from './ErrorDisplay';
import { tournamentService } from '@/services/apiService';
import { getErrorInfo } from '@/utils/errorUtils';
import type { Tournament } from '@/types/api';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

// Simplified context for current tournament only
export const TournamentContext = React.createContext<{
  currentTournament: Tournament | null;
  loading: boolean;
  error: string | null;
}>({
  currentTournament: null,
  loading: true,
  error: null
});

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const [currentTournament, setCurrentTournament] = React.useState<Tournament | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Load current tournament data
    const loadCurrentTournament = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('� SimpleLayout: Loading current tournament...');
        
        const tournament = await tournamentService.getCurrent();
        console.log('✅ SimpleLayout: Loaded current tournament:', tournament);
        setCurrentTournament(tournament);
      } catch (err) {
        console.error('❌ SimpleLayout: Error loading current tournament:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load current tournament';
        setError(errorMessage);
      } finally {
        setLoading(false);
        setMounted(true);
      }
    };

    loadCurrentTournament();
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted || loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
        <Header />
        <Box sx={{ pt: 8, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ color: '#e8eaed', textAlign: 'center', py: 4 }}>
            Betöltés...
          </Box>
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    const errorInfo = getErrorInfo('tournaments', error);
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
        <Header />
        <Box sx={{ pt: 8, px: { xs: 2, sm: 3 } }}>
          <ErrorDisplay 
            errorInfo={errorInfo}
            onRetry={() => window.location.reload()}
            variant="box"
          />
        </Box>
      </Box>
    );
  }

  console.log(`🎯 SimpleLayout context values:`, {
    currentTournament: currentTournament?.name,
    loading,
    error
  });

  return (
    <TournamentContext.Provider value={{ 
      currentTournament,
      loading,
      error
    }}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
        <Header />
        
        <Box sx={{ 
          pt: { xs: 7, sm: 8 }, // Account for AppBar height
          px: { xs: 0, sm: 0 }, // Remove padding as children components handle their own
          minHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </Box>
      </Box>
    </TournamentContext.Provider>
  );
};

export default SimpleLayout;

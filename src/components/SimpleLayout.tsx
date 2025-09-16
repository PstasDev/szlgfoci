'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import ErrorDisplay from './ErrorDisplay';
import { useTournaments } from '@/hooks/useTournaments';
import { getErrorInfo } from '@/utils/errorUtils';
import { hasTournamentStarted, selectMostRelevantTournament } from '@/utils/dataUtils';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

// Create a context to pass tournament ID to child components
export const TournamentContext = React.createContext<{
  selectedTournamentId: number | null;
  selectedTournament: any;
  setSelectedTournamentId: (id: number) => void;
  isReady: boolean; // Indicates if tournament selection is complete
}>({
  selectedTournamentId: null, // Start with null - no tournament selected yet
  selectedTournament: null,
  setSelectedTournamentId: () => {},
  isReady: false
});

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const [selectedSeason, setSelectedSeason] = React.useState<string | null>(null); // Start with null to detect first load
  const [mounted, setMounted] = React.useState(false);
  
  const { tournaments, loading, error, refetch } = useTournaments();

  // Clear localStorage on first mount if it contains invalid values
  React.useEffect(() => {
    const saved = localStorage.getItem('szlg-selected-season');
    if (saved && (isNaN(parseInt(saved)) || parseInt(saved) <= 0)) {
      console.log(`🧹 Clearing invalid localStorage value: ${saved}`);
      localStorage.removeItem('szlg-selected-season');
    }
  }, []);

  React.useEffect(() => {
    // Load selected season from localStorage or auto-select
    const saved = localStorage.getItem('szlg-selected-season');
    
    console.log(`🔍 SimpleLayout: Loading from localStorage: ${saved}`);
    console.log(`🔍 SimpleLayout: Available tournaments:`, tournaments.map(t => ({ id: t.id, name: t.name })));
    
    if (saved && tournaments.length > 0) {
      // Check if saved tournament ID still exists and is valid
      const savedId = parseInt(saved);
      const savedTournamentExists = tournaments.some(t => t.id === savedId);
      if (savedTournamentExists && savedId > 0) {
        console.log(`📱 Loading saved tournament ID from localStorage: ${saved}`);
        setSelectedSeason(saved);
        return;
      } else {
        console.log(`⚠️ Saved tournament ID ${saved} no longer exists or is invalid, will auto-select`);
        localStorage.removeItem('szlg-selected-season');
      }
    }
    
    if (tournaments.length > 0 && selectedSeason === null) {
      // First time loading or saved tournament doesn't exist - auto-select the most relevant tournament
      const selectedTournament = selectMostRelevantTournament(tournaments);
      if (selectedTournament?.id) {
        const tournamentId = selectedTournament.id.toString();
        console.log(`🎯 Auto-selecting most relevant tournament: ${selectedTournament.name} (ID: ${tournamentId})`);
        setSelectedSeason(tournamentId);
        localStorage.setItem('szlg-selected-season', tournamentId);
      } else {
        // Fallback to first available tournament if no smart selection is possible
        const firstTournament = tournaments[0];
        if (firstTournament?.id) {
          const fallbackId = firstTournament.id.toString();
          console.log(`⚠️ Could not auto-select tournament, falling back to first tournament ID: ${fallbackId}`);
          setSelectedSeason(fallbackId);
          localStorage.setItem('szlg-selected-season', fallbackId);
        }
      }
    } else if (tournaments.length === 0 && selectedSeason === null) {
      // No tournaments available - don't set any default, wait for tournaments to load
      console.log(`⚠️ No tournaments available yet, waiting for data`);
    }
    
    setMounted(true);
  }, [tournaments, selectedSeason]);

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    localStorage.setItem('szlg-selected-season', season);
  };

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
            onRetry={refetch}
            variant="box"
          />
        </Box>
      </Box>
    );
  }

  // If we still don't have a selected season after mounting and tournaments are loaded, 
  // wait a bit more or try auto-selection again
  if (selectedSeason === null && tournaments.length > 0) {
    console.log(`⚠️ No tournament selected but tournaments are available, triggering auto-selection`);
    const selectedTournament = selectMostRelevantTournament(tournaments);
    if (selectedTournament?.id) {
      const tournamentId = selectedTournament.id.toString();
      setSelectedSeason(tournamentId);
      localStorage.setItem('szlg-selected-season', tournamentId);
    }
    
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
        <Header />
        <Box sx={{ pt: 8, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ color: '#e8eaed', textAlign: 'center', py: 4 }}>
            Torna kiválasztása...
          </Box>
        </Box>
      </Box>
    );
  }

  // Find current tournament
  const currentTournament = tournaments.find(tournament => 
    tournament.id && tournament.id.toString() === selectedSeason
  );

  const selectedTournamentId = selectedSeason ? parseInt(selectedSeason) : null;
  const isReady = selectedSeason !== null && mounted && tournaments.length > 0;

  console.log(`🎯 SimpleLayout context values:`, {
    selectedSeason,
    selectedTournamentId,
    isReady,
    mounted,
    tournamentsCount: tournaments.length,
    currentTournament: currentTournament?.name
  });

  const setSelectedTournamentId = (id: number) => {
    console.log(`🔄 SimpleLayout: setSelectedTournamentId called with ID: ${id}`);
    const newSeason = id.toString();
    setSelectedSeason(newSeason);
    localStorage.setItem('szlg-selected-season', newSeason);
  };

  return (
    <TournamentContext.Provider value={{ 
      selectedTournamentId, 
      selectedTournament: currentTournament,
      setSelectedTournamentId,
      isReady
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

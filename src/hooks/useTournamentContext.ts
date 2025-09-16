'use client';

import { useContext } from 'react';
import { TournamentContext } from '@/components/SimpleLayout';
import { useTournamentData as useBaseTournamentData } from './useTournamentData';

// Hook that uses the selected tournament from context
export function useTournamentContext() {
  const { selectedTournamentId, selectedTournament, isReady } = useContext(TournamentContext);
  
  console.log(`🎪 useTournamentContext: Using tournament ID ${selectedTournamentId} from context (ready: ${isReady})`);
  
  // Always call the hook, but pass a valid ID or fallback
  const tournamentIdToUse = (isReady && selectedTournamentId !== null && selectedTournamentId > 0) 
    ? selectedTournamentId 
    : 2; // Use a valid fallback ID from your data
  
  // Always call the hook - this is required by React hooks rules
  const hookData = useBaseTournamentData(tournamentIdToUse);
  
  // If not ready, return loading state but still call the hook
  if (!isReady || selectedTournamentId === null || selectedTournamentId <= 0) {
    console.log(`🎪 useTournamentContext: Tournament selection not ready yet (ID: ${selectedTournamentId}, ready: ${isReady})`);
    return {
      matches: [],
      teams: [],
      standings: [],
      topScorers: [],
      tournament: null,
      loading: true,
      error: null,
      refetch: hookData.refetch
    };
  }
  
  console.log(`🎪 useTournamentContext: Hook returned tournament:`, hookData.tournament?.name, `(ID: ${hookData.tournament?.id})`);
  
  // If we have a tournament from context and it matches the hook's tournament ID, use context tournament
  // but keep the other data from the hook
  if (selectedTournament && hookData.tournament && selectedTournament.id === hookData.tournament.id) {
    console.log(`🎪 useTournamentContext: Using tournament from context with hook data`);
    return {
      ...hookData,
      tournament: selectedTournament
    };
  }
  
  // Otherwise use the hook data completely
  console.log(`🎪 useTournamentContext: Using full hook data`);
  return hookData;
}

// Hook for accessing tournament context values directly
export function useTournamentSelection() {
  return useContext(TournamentContext);
}

// Export the context for direct access if needed
export { TournamentContext };

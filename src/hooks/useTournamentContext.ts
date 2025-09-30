'use client';

import { useContext } from 'react';
import { TournamentContext } from '@/components/SimpleLayout';
import { useTournamentData as useBaseTournamentData } from './useTournamentData';

// Hook that uses current tournament data - no longer needs tournament selection
export function useTournamentContext() {
  console.log(`🎪 useTournamentContext: Using current tournament from context`);
  
  // Use the base hook that fetches current tournament data
  const hookData = useBaseTournamentData();
  
  console.log(`🎪 useTournamentContext: Hook returned tournament:`, hookData.tournament?.name, `(ID: ${hookData.tournament?.id})`);
  
  return hookData;
}

// Hook for accessing tournament context values directly (simplified)
export function useTournamentSelection() {
  return useContext(TournamentContext);
}

// Export the context for direct access if needed
export { TournamentContext };

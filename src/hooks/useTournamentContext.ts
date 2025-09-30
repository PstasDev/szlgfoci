'use client';

import { useContext } from 'react';
import { TournamentContext } from '@/components/SimpleLayout';
import { useTournamentData } from '@/contexts/TournamentDataContext';

// Hook that uses current tournament data - no longer needs tournament selection
export function useTournamentContext() {
  console.log(`🎪 useTournamentContext: Using current tournament from new context`);
  
  // Use the new centralized hook that fetches current tournament data
  const hookData = useTournamentData();
  
  console.log(`🎪 useTournamentContext: Hook returned tournament:`, hookData.tournament?.name, `(ID: ${hookData.tournament?.id})`);
  
  return hookData;
}

// Hook for accessing tournament context values directly (simplified, legacy)
export function useTournamentSelection() {
  return useContext(TournamentContext);
}

// Export the context for direct access if needed
export { TournamentContext };

'use client';

import { useState, useEffect } from 'react';
import { tournamentService } from '@/services/apiService';
import type { Tournament } from '@/types/api';

interface UseTournamentsReturn {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTournaments(): UseTournamentsReturn {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    try {
      console.log('🔄 useTournaments: Starting to fetch tournaments...');
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching tournaments from API...');
      const tournamentsData = await tournamentService.getAll();
      console.log('✅ Successfully fetched tournaments:', tournamentsData);
      setTournaments(tournamentsData);
    } catch (err) {
      console.error('❌ Error fetching tournaments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tournaments';
      console.error('❌ Error details:', {
        message: errorMessage,
        error: err,
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(errorMessage);
      setTournaments([]); // Set empty array on error
    } finally {
      setLoading(false);
      console.log('🔄 useTournaments: Finished fetching (loading set to false)');
    }
  };

  useEffect(() => {
    console.log('🔄 useTournaments: useEffect triggered, calling fetchTournaments...');
    fetchTournaments();
  }, []);

  console.log('🔄 useTournaments: Returning state:', { tournamentsCount: tournaments.length, loading, error });

  return {
    tournaments,
    loading,
    error,
    refetch: fetchTournaments
  };
}

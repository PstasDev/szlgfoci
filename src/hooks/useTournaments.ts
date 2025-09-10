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
      setLoading(true);
      setError(null);
      
      const tournamentsData = await tournamentService.getAll();
      setTournaments(tournamentsData);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return {
    tournaments,
    loading,
    error,
    refetch: fetchTournaments
  };
}

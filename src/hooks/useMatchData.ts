'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { tournamentService } from '@/services/apiService';
import { formatMatch } from '@/utils/dataUtils';
import type { Match, Team } from '@/types/api';

interface UseMatchDataOptions {
  enableLiveUpdates?: boolean;
  updateInterval?: number;
}

interface UseMatchDataReturn {
  match: Match | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isLive: boolean;
}

export function useMatchData(
  matchId: number, 
  options: UseMatchDataOptions = {}
): UseMatchDataReturn {
  const {
    enableLiveUpdates = true,
    updateInterval = 5000 // 5 seconds default
  } = options;

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMatchData = useCallback(async (showLoading = true) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      // Fetch match data and teams in parallel
      const [matchesData, teamsData] = await Promise.all([
        tournamentService.getMatches(),
        tournamentService.getTeams()
      ]);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      // Find the specific match
      const apiMatch = matchesData.find(m => m.id === matchId);
      
      if (!apiMatch) {
        setError(`Match with ID ${matchId} not found`);
        setMatch(null);
        return;
      }

      // Format the match data
      const formattedMatch = formatMatch(apiMatch, teamsData);
      
      setMatch(formattedMatch);
      setError(null);

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }

      console.error('❌ Failed to fetch match data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load match data');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [matchId]);

  // Manual refetch function
  const refetch = useCallback(async () => {
    await fetchMatchData(true);
  }, [fetchMatchData]);

  // Determine if match is live
  const isLive = match?.status === 'live';

  // Setup automatic updates for live matches
  useEffect(() => {
    // Initial fetch
    fetchMatchData(true);

    // Setup interval for live updates
    if (enableLiveUpdates && isLive) {
      intervalRef.current = setInterval(() => {
        fetchMatchData(false); // Background update without loading state
      }, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMatchData, enableLiveUpdates, isLive, updateInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    match,
    loading,
    error,
    refetch,
    isLive
  };
}
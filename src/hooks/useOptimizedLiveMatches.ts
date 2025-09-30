import { useState, useEffect, useCallback, useRef } from 'react';
import { tournamentService } from '@/services/apiService';
import { formatMatch, getLiveMatches, Match, Team } from '@/utils/dataUtils';

interface LiveMatchesState {
  liveMatches: Match[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

interface UseOptimizedLiveMatchesOptions {
  refreshInterval?: number; // milliseconds
  maxRetries?: number;
  enabled?: boolean;
}

export const useOptimizedLiveMatches = (
  teams: Team[] = [],
  options: UseOptimizedLiveMatchesOptions = {}
) => {
  const {
    refreshInterval = 30000, // 30 seconds for live matches
    maxRetries = 3,
    enabled = true
  } = options;

  const [state, setState] = useState<LiveMatchesState>({
    liveMatches: [],
    loading: false,
    error: null,
    lastUpdated: 0
  });

  const retryCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLiveMatches = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Fetch only matches (more efficient than fetching all data)
      const allMatches = await tournamentService.getMatches();
      
      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      // Format matches and filter for live ones
      const formattedMatches = allMatches.map(match => formatMatch(match, teams));
      const liveMatches = getLiveMatches(formattedMatches);

      setState(prev => ({
        ...prev,
        liveMatches,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      }));

      retryCountRef.current = 0; // Reset retry count on success

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }

      console.error('❌ Failed to fetch live matches:', error);
      
      retryCountRef.current += 1;
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Failed to fetch live matches (attempt ${retryCountRef.current}/${maxRetries})`
      }));

      // Retry logic with exponential backoff
      if (retryCountRef.current < maxRetries) {
        const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 10000);
        setTimeout(() => {
          if (enabled) {
            fetchLiveMatches();
          }
        }, retryDelay);
      }
    }
  }, [teams, maxRetries, enabled]);

  const manualRefresh = useCallback(() => {
    retryCountRef.current = 0; // Reset retry count for manual refresh
    fetchLiveMatches();
  }, [fetchLiveMatches]);

  // Setup automatic refresh for live matches
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial fetch
    fetchLiveMatches();

    // Only set up interval if there might be live matches
    const setupInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        fetchLiveMatches();
      }, refreshInterval);
    };

    setupInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchLiveMatches, refreshInterval, enabled]);

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
    liveMatches: state.liveMatches,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refresh: manualRefresh,
    hasLiveMatches: state.liveMatches.length > 0
  };
};
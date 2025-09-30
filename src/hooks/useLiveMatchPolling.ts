'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { liveMatchService, timeService } from '@/services/apiService';
import type { LiveMatch, TimeSyncSchema } from '@/types/api';

interface UseLiveMatchPollingOptions {
  pollingInterval?: number; // in milliseconds, default 1000 (1 second)
  enablePolling?: boolean;
  autoStart?: boolean;
}

interface LiveMatchData {
  matches: LiveMatch[];
  serverTime: TimeSyncSchema | null;
  lastUpdated: string;
  isPolling: boolean;
  error: string | null;
}

export const useLiveMatchPolling = (options: UseLiveMatchPollingOptions = {}) => {
  const {
    pollingInterval = 1000, // 1 second for accurate live timing
    enablePolling = true,
    autoStart = true
  } = options;

  const [data, setData] = useState<LiveMatchData>({
    matches: [],
    serverTime: null,
    lastUpdated: '',
    isPolling: false,
    error: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);

  // Calculate current match time based on match_start event and server time
  const calculateMatchTime = useCallback((match: LiveMatch): string => {
    // For now, use the existing time field from the match
    // Later this can be enhanced with proper event-based calculations
    if (match.time) {
      return match.time;
    }

    // Fallback
    return '0\'';
  }, []);

  // Fetch live matches and server time
  const fetchLiveData = useCallback(async () => {
    if (!isComponentMounted.current) return;

    try {
      setData(prev => ({ ...prev, error: null }));

      // Fetch both live matches and server time in parallel
      const [matchesData, timeData] = await Promise.all([
        liveMatchService.getLiveMatches(),
        timeService.getServerTime()
      ]);

      if (!isComponentMounted.current) return;

      // Update matches with calculated times
      const updatedMatches = matchesData.map(match => ({
        ...match,
        display_time: calculateMatchTime(match)
      }));

      setData(prev => ({
        ...prev,
        matches: updatedMatches,
        serverTime: timeData,
        lastUpdated: new Date().toISOString(),
        error: null
      }));

    } catch (error) {
      if (!isComponentMounted.current) return;
      
      console.error('Error fetching live match data:', error);
      setData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch live data'
      }));
    }
  }, [calculateMatchTime]);

  // Start polling
  const startPolling = useCallback(() => {
    if (!enablePolling || intervalRef.current) return;

    setData(prev => ({ ...prev, isPolling: true }));
    
    // Fetch immediately
    fetchLiveData();

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      fetchLiveData();
    }, pollingInterval);

    console.log(`🔴 Started live match polling every ${pollingInterval}ms`);
  }, [enablePolling, fetchLiveData, pollingInterval]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setData(prev => ({ ...prev, isPolling: false }));
    console.log('🔴 Stopped live match polling');
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Auto-start polling on mount
  useEffect(() => {
    if (autoStart && enablePolling) {
      startPolling();
    }

    return () => {
      isComponentMounted.current = false;
      stopPolling();
    };
  }, [autoStart, enablePolling, startPolling, stopPolling]);

  return {
    liveMatches: data.matches,
    serverTime: data.serverTime,
    lastUpdated: data.lastUpdated,
    isPolling: data.isPolling,
    error: data.error,
    startPolling,
    stopPolling,
    refresh
  };
};

export default useLiveMatchPolling;
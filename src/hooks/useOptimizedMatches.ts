// Optimized React hooks for live match data and performance monitoring
import { useState, useEffect, useCallback, useRef } from 'react';
import { optimizedApiService, liveMatchWebSocket } from '@/services/optimizedApiService';
import type {
  LiveMatch,
  OptimizedMatch,
  LiveMatchesBulk,
  MatchPerformance,
  LiveUpdatePayload
} from '@/types/api';

// Hook for live matches with automatic updates
export function useLiveMatches(options: {
  autoRefresh?: boolean;
  refreshInterval?: number;
  useCache?: boolean;
} = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    useCache = true
  } = options;

  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLiveMatches = useCallback(async () => {
    try {
      setError(null);
      const matches = await optimizedApiService.getLiveMatches(useCache);
      setLiveMatches(matches);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch live matches');
      console.error('Error fetching live matches:', err);
    } finally {
      setLoading(false);
    }
  }, [useCache]);

  // Setup auto-refresh
  useEffect(() => {
    fetchLiveMatches();

    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLiveMatches, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchLiveMatches, autoRefresh, refreshInterval]);

  // Setup WebSocket for real-time updates
  useEffect(() => {
    if (!liveMatchWebSocket.isConnected()) {
      liveMatchWebSocket.connect();
    }

    const unsubscribe = liveMatchWebSocket.subscribe('all', (update: LiveUpdatePayload) => {
      if (update.type === 'event' || update.type === 'score' || update.type === 'status') {
        // Refresh live matches when updates occur
        fetchLiveMatches();
      }
    });

    return unsubscribe;
  }, [fetchLiveMatches]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchLiveMatches();
  }, [fetchLiveMatches]);

  return {
    liveMatches,
    loading,
    error,
    lastUpdated,
    refresh,
    hasLiveMatches: liveMatches.length > 0
  };
}

// Hook for optimized match details
export function useOptimizedMatch(matchId: number | null, options: {
  autoRefresh?: boolean;
  refreshInterval?: number;
  useCache?: boolean;
} = {}) {
  const {
    autoRefresh = false,
    refreshInterval = 60000, // 1 minute
    useCache = true
  } = options;

  const [match, setMatch] = useState<OptimizedMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMatch = useCallback(async () => {
    if (!matchId) {
      setMatch(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const matchData = await optimizedApiService.getOptimizedMatch(matchId, useCache);
      setMatch(matchData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch match');
      console.error('Error fetching match:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId, useCache]);

  // Setup auto-refresh
  useEffect(() => {
    if (matchId) {
      fetchMatch();

      if (autoRefresh) {
        intervalRef.current = setInterval(fetchMatch, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchMatch, autoRefresh, refreshInterval, matchId]);

  // Setup WebSocket for real-time updates specific to this match
  useEffect(() => {
    if (!matchId) return;

    if (!liveMatchWebSocket.isConnected()) {
      liveMatchWebSocket.connect();
    }

    const unsubscribe = liveMatchWebSocket.subscribe(`match_${matchId}`, (update: LiveUpdatePayload) => {
      if (update.match_id === matchId) {
        // Refresh match when updates occur
        fetchMatch();
      }
    });

    return unsubscribe;
  }, [matchId, fetchMatch]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchMatch();
  }, [fetchMatch]);

  return {
    match,
    loading,
    error,
    lastUpdated,
    refresh,
    isLive: match?.status === 'live'
  };
}

// Hook for bulk live matches data
export function useLiveMatchesBulk(options: {
  autoRefresh?: boolean;
  refreshInterval?: number;
  useCache?: boolean;
} = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 20000, // 20 seconds
    useCache = true
  } = options;

  const [bulkData, setBulkData] = useState<LiveMatchesBulk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBulkData = useCallback(async () => {
    try {
      setError(null);
      const data = await optimizedApiService.getLiveMatchesBulk(useCache);
      setBulkData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bulk live data');
      console.error('Error fetching bulk live data:', err);
    } finally {
      setLoading(false);
    }
  }, [useCache]);

  useEffect(() => {
    fetchBulkData();

    if (autoRefresh) {
      intervalRef.current = setInterval(fetchBulkData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchBulkData, autoRefresh, refreshInterval]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchBulkData();
  }, [fetchBulkData]);

  return {
    bulkData,
    loading,
    error,
    refresh,
    totalLiveMatches: bulkData?.total_live_matches || 0,
    lastUpdated: bulkData?.last_updated
  };
}

// Hook for performance monitoring
export function useMatchPerformance(matchId: number | null) {
  const [performance, setPerformance] = useState<MatchPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = useCallback(async () => {
    if (!matchId) return;

    setLoading(true);
    try {
      setError(null);
      const data = await optimizedApiService.getMatchPerformance(matchId);
      setPerformance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
      console.error('Error fetching performance data:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    if (matchId) {
      fetchPerformance();
    }
  }, [fetchPerformance, matchId]);

  return {
    performance,
    loading,
    error,
    refresh: fetchPerformance
  };
}

// Hook for cache management
export function useCacheManager() {
  const [isClearing, setIsClearing] = useState(false);
  const [lastClearTime, setLastClearTime] = useState<Date | null>(null);

  const refreshMatchCache = useCallback(async (matchId: number) => {
    try {
      const result = await optimizedApiService.refreshMatchCache(matchId);
      console.log('Cache refreshed:', result);
      return result;
    } catch (error) {
      console.error('Error refreshing cache:', error);
      throw error;
    }
  }, []);

  const clearAllCaches = useCallback(async () => {
    setIsClearing(true);
    try {
      const result = await optimizedApiService.clearAllCaches();
      setLastClearTime(new Date());
      console.log('All caches cleared:', result);
      return result;
    } catch (error) {
      console.error('Error clearing caches:', error);
      throw error;
    } finally {
      setIsClearing(false);
    }
  }, []);

  const getLocalCacheStats = useCallback(() => {
    return optimizedApiService.cache.stats();
  }, []);

  const clearLocalCache = useCallback(() => {
    optimizedApiService.cache.clear();
  }, []);

  const invalidateLocalCache = useCallback((pattern: string) => {
    optimizedApiService.cache.invalidate(pattern);
  }, []);

  return {
    refreshMatchCache,
    clearAllCaches,
    clearLocalCache,
    invalidateLocalCache,
    getLocalCacheStats,
    isClearing,
    lastClearTime
  };
}

// Hook for WebSocket connection management
export function useWebSocketConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    // Monitor connection status
    const checkConnection = () => {
      const connected = liveMatchWebSocket.isConnected();
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
    };

    // Check immediately
    checkConnection();

    // Check periodically
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  const connect = useCallback(() => {
    setConnectionStatus('connecting');
    liveMatchWebSocket.connect();
  }, []);

  const disconnect = useCallback(() => {
    liveMatchWebSocket.disconnect();
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect
  };
}

// Hook for featured matches
export function useFeaturedMatches(options: {
  useCache?: boolean;
} = {}) {
  const { useCache = true } = options;

  const [featuredMatches, setFeaturedMatches] = useState<OptimizedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedMatches = useCallback(async () => {
    try {
      setError(null);
      const matches = await optimizedApiService.getFeaturedMatches(useCache);
      setFeaturedMatches(matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured matches');
      console.error('Error fetching featured matches:', err);
    } finally {
      setLoading(false);
    }
  }, [useCache]);

  useEffect(() => {
    fetchFeaturedMatches();
  }, [fetchFeaturedMatches]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchFeaturedMatches();
  }, [fetchFeaturedMatches]);

  return {
    featuredMatches,
    loading,
    error,
    refresh,
    hasFeaturedMatches: featuredMatches.length > 0
  };
}

// Custom hook for performance statistics
export function usePerformanceStats() {
  const [stats, setStats] = useState<Record<string, any>>({});

  const refreshStats = useCallback(() => {
    const performanceStats = optimizedApiService.performance.getStats();
    setStats(performanceStats);
  }, []);

  useEffect(() => {
    refreshStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    
    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    stats,
    refresh: refreshStats
  };
}
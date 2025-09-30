import { useMemo } from 'react';
import { Match } from '@/utils/dataUtils';

interface PerformanceOptimizedMatchesByStatus {
  liveMatches: Match[];
  upcomingMatches: Match[];
  recentMatches: Match[];
  hasLiveMatches: boolean;
  hasUpcomingMatches: boolean;
  hasRecentMatches: boolean;
}

interface UsePerformanceOptimizedMatchesOptions {
  upcomingLimit?: number;
  recentLimit?: number;
}

/**
 * Optimized hook for filtering matches by status with performance improvements:
 * - Uses single pass filtering for better performance
 * - Memoizes results to prevent unnecessary recalculations
 * - Provides existence checks to avoid rendering empty sections
 * - Limits results to prevent excessive DOM rendering
 */
export const usePerformanceOptimizedMatches = (
  matches: Match[] = [],
  options: UsePerformanceOptimizedMatchesOptions = {}
): PerformanceOptimizedMatchesByStatus => {
  const {
    upcomingLimit = 5,
    recentLimit = 5
  } = options;

  return useMemo(() => {
    // Early return for empty matches
    if (!matches || matches.length === 0) {
      return {
        liveMatches: [],
        upcomingMatches: [],
        recentMatches: [],
        hasLiveMatches: false,
        hasUpcomingMatches: false,
        hasRecentMatches: false
      };
    }

    // Single pass filtering for better performance
    const liveMatches: Match[] = [];
    const upcomingMatches: Match[] = [];
    const finishedMatches: Match[] = [];

    for (const match of matches) {
      switch (match.status) {
        case 'live':
          liveMatches.push(match);
          break;
        case 'upcoming':
          if (upcomingMatches.length < upcomingLimit) {
            upcomingMatches.push(match);
          }
          break;
        case 'finished':
          if (finishedMatches.length < recentLimit) {
            finishedMatches.push(match);
          }
          break;
      }
    }

    // Sort finished matches by date (most recent first) if we have more than needed
    const recentMatches = finishedMatches.length > recentLimit 
      ? finishedMatches
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, recentLimit)
      : finishedMatches;

    return {
      liveMatches,
      upcomingMatches,
      recentMatches,
      hasLiveMatches: liveMatches.length > 0,
      hasUpcomingMatches: upcomingMatches.length > 0,
      hasRecentMatches: recentMatches.length > 0
    };
  }, [matches, upcomingLimit, recentLimit]);
};
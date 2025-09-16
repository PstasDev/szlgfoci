import { useMemo } from 'react';
import { Match, getLiveMatches, getUpcomingMatches, getRecentMatches } from '@/utils/dataUtils';

interface MatchesByStatus {
  liveMatches: Match[];
  upcomingMatches: Match[];
  recentMatches: Match[];
}

export const useMatchesByStatus = (matches: Match[] = []): MatchesByStatus => {
  return useMemo(() => {
    return {
      liveMatches: getLiveMatches(matches),
      upcomingMatches: getUpcomingMatches(matches, 5),
      recentMatches: getRecentMatches(matches, 5)
    };
  }, [matches]);
};
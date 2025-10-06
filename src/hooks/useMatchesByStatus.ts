import { useMemo } from 'react';
import { Match, getLiveMatches, getUpcomingMatches, getRecentMatches, getUpcomingMatchesForHomepage } from '@/utils/dataUtils';

interface MatchesByStatus {
  liveMatches: Match[];
  upcomingMatches: Match[];
  recentMatches: Match[];
  homepageUpcoming: {
    matches: Match[];
    hasMore: boolean;
  };
}

export const useMatchesByStatus = (matches: Match[] = []): MatchesByStatus => {
  return useMemo(() => {
    return {
      liveMatches: getLiveMatches(matches),
      upcomingMatches: getUpcomingMatches(matches, 5),
      recentMatches: getRecentMatches(matches, 3), // Limit to 3 for homepage
      homepageUpcoming: getUpcomingMatchesForHomepage(matches)
    };
  }, [matches]);
};
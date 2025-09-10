'use client';

import { useState, useEffect } from 'react';
import { tournamentService } from '@/services/apiService';
import { 
  formatMatch, 
  getLiveMatches, 
  getUpcomingMatches, 
  getRecentMatches, 
  convertStandingSchemaToStanding,
  convertTopScorerSchemaToTopScorer,
  DEFAULT_TOURNAMENT_ID 
} from '@/utils/dataUtils';
import type { Match, Team, Standing, ApiMatch, TopScorer, StandingSchema, TopScorerSchema } from '@/types/api';

interface UseTournamentDataReturn {
  matches: Match[];
  teams: Team[];
  standings: Standing[];
  topScorers: TopScorer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTournamentData(tournamentId: number = DEFAULT_TOURNAMENT_ID): UseTournamentDataReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [matchesData, teamsData, standingsData, topScorersData] = await Promise.all([
        tournamentService.getMatches(tournamentId),
        tournamentService.getTeams(tournamentId),
        tournamentService.getStandings(tournamentId),
        tournamentService.getTopScorers(tournamentId)
      ]);

      const formattedMatches = matchesData.map(match => formatMatch(match, teamsData));
      const formattedStandings = standingsData.map(convertStandingSchemaToStanding);
      const formattedTopScorers = topScorersData.map((scorer, index) => 
        convertTopScorerSchemaToTopScorer(scorer, `Team ${scorer.id}`)
      );
      
      setMatches(formattedMatches);
      setTeams(teamsData);
      setStandings(formattedStandings);
      setTopScorers(formattedTopScorers);
    } catch (err) {
      console.error('Error fetching tournament data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  return {
    matches,
    teams,
    standings,
    topScorers,
    loading,
    error,
    refetch: fetchData
  };
}

export function useMatchesByStatus(matches: Match[]) {
  return {
    liveMatches: getLiveMatches(matches),
    upcomingMatches: getUpcomingMatches(matches, 3),
    recentMatches: getRecentMatches(matches, 3)
  };
}

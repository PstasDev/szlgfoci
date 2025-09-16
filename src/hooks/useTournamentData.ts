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
  DEFAULT_TOURNAMENT_ID,
  hasTournamentStarted
} from '@/utils/dataUtils';
import type { Match, Team, Standing, ApiMatch, TopScorer, StandingSchema, TopScorerSchema, Tournament } from '@/types/api';

interface UseTournamentDataReturn {
  matches: Match[];
  teams: Team[];
  standings: Standing[];
  topScorers: TopScorer[];
  tournament: Tournament | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTournamentData(tournamentId: number = DEFAULT_TOURNAMENT_ID): UseTournamentDataReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Loading tournament data for ID: ${tournamentId}`);
      
      // Validate tournament ID - must be a positive number
      if (!tournamentId || tournamentId <= 0 || !Number.isInteger(tournamentId)) {
        console.error(`❌ Invalid tournament ID: ${tournamentId}`);
        setError(`Invalid tournament ID: ${tournamentId}. Please select a valid tournament.`);
        setLoading(false);
        return;
      }
      
      // First, fetch only the tournament data to check if it exists and has started
      let tournamentData;
      try {
        tournamentData = await tournamentService.getById(tournamentId);
        console.log(`📊 Fetched tournament:`, tournamentData);
      } catch (err) {
        console.error(`❌ Tournament ID ${tournamentId} not found or inaccessible:`, err);
        setError(`Tournament with ID ${tournamentId} was not found. Please select a different tournament.`);
        setLoading(false);
        return;
      }
      
      setTournament(tournamentData);

      // Check if tournament has started
      const hasStarted = hasTournamentStarted(tournamentData);
      const hasEnded = tournamentData.end_date ? new Date() > new Date(tournamentData.end_date) : false;
      console.log(`⏰ Tournament "${tournamentData.name}" has started: ${hasStarted}, has ended: ${hasEnded}`);
      
      if (tournamentData.start_date) {
        const startDate = new Date(tournamentData.start_date);
        const now = new Date();
        console.log(`📅 Start date: ${tournamentData.start_date} (${startDate.toLocaleDateString()})`);
        console.log(`📅 Current date: ${now.toLocaleDateString()}`);
        if (tournamentData.end_date) {
          const endDate = new Date(tournamentData.end_date);
          console.log(`📅 End date: ${tournamentData.end_date} (${endDate.toLocaleDateString()})`);
        }
      }

      // Fetch data if tournament has started (even if it has ended)
      if (!hasStarted) {
        console.log(`⚠️ Tournament hasn't started yet - showing "tournament not started" screen`);
        setMatches([]);
        setTeams([]);
        setStandings([]);
        setTopScorers([]);
        setLoading(false);
        return;
      }

      console.log(`✅ Tournament has started - fetching match/standings/goals data...`);
      
      // Fetch data for started tournaments (including ended ones)
      try {
        const [matchesData, teamsData, standingsData, topScorersData] = await Promise.all([
          tournamentService.getMatches(tournamentId).catch(err => {
            console.warn(`⚠️ Failed to fetch matches for tournament ${tournamentId}:`, err);
            return [];
          }),
          tournamentService.getTeams(tournamentId).catch(err => {
            console.warn(`⚠️ Failed to fetch teams for tournament ${tournamentId}:`, err);
            return [];
          }),
          tournamentService.getStandings(tournamentId).catch(err => {
            console.warn(`⚠️ Failed to fetch standings for tournament ${tournamentId}:`, err);
            return [];
          }),
          tournamentService.getTopScorers(tournamentId).catch(err => {
            console.warn(`⚠️ Failed to fetch top scorers for tournament ${tournamentId}:`, err);
            return [];
          })
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
        
        console.log(`✅ Successfully loaded all data for tournament "${tournamentData.name}"`);
        console.log(`📊 Data summary: ${formattedMatches.length} matches, ${teamsData.length} teams, ${formattedStandings.length} standings, ${formattedTopScorers.length} top scorers`);
      } catch (err) {
        console.error(`❌ Error fetching tournament data details:`, err);
        // Don't fail completely, just log the error and continue with what we have
      }
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
    tournament,
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

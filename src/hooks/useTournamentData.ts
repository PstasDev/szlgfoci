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
  hasTournamentStarted
} from '@/utils/dataUtils';
import type { Match, Team, Standing, TopScorer, Tournament } from '@/types/api';

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

export function useTournamentData(): UseTournamentDataReturn {
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
      
      console.log(`🔄 Loading current tournament data...`);
      
      // First, fetch the current tournament to check if it exists and has started
      let tournamentData;
      try {
        tournamentData = await tournamentService.getCurrent();
        console.log(`📊 Fetched current tournament:`, tournamentData);
      } catch (err) {
        console.error(`❌ Current tournament not found or inaccessible:`, err);
        setError(`Current tournament was not found. The tournament may not be set up yet.`);
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
          tournamentService.getMatches().catch(err => {
            console.warn(`⚠️ Failed to fetch matches for current tournament:`, err);
            return [];
          }),
          tournamentService.getTeams().catch(err => {
            console.warn(`⚠️ Failed to fetch teams for current tournament:`, err);
            return [];
          }),
          tournamentService.getStandings().catch(err => {
            console.warn(`⚠️ Failed to fetch standings for current tournament:`, err);
            return [];
          }),
          tournamentService.getTopScorers().catch(err => {
            console.warn(`⚠️ Failed to fetch top scorers for current tournament:`, err);
            return [];
          })
        ]);

        console.log('🔍 Teams data received:', teamsData);
        console.log('🔍 First team structure:', teamsData[0]);

        const formattedMatches = matchesData.map(match => formatMatch(match, teamsData));
        const formattedStandings = standingsData.map(convertStandingSchemaToStanding);
        const formattedTopScorers = topScorersData.map((scorer) => 
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
  }, []);

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

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { tournamentService, announcementService, userService } from '@/services/apiService';
import { 
  formatMatch, 
  convertStandingSchemaToStanding,
  convertTopScorerSchemaToTopScorer,
  hasTournamentStarted
} from '@/utils/dataUtils';
import type { Match, Team, Standing, TopScorer, Tournament, Announcement } from '@/types/api';

interface OptimizedTournamentDataContextType {
  matches: Match[];
  teams: Team[];
  standings: Standing[];
  topScorers: TopScorer[];
  tournament: Tournament | null;
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshMatches: () => Promise<void>;
  lastFetchTime: number;
  dataFreshness: {
    matches: number;
    teams: number;
    standings: number;
    topScorers: number;
    announcements: number;
  };
}

const OptimizedTournamentDataContext = createContext<OptimizedTournamentDataContextType | null>(null);

interface OptimizedTournamentDataProviderProps {
  children: ReactNode;
}

// Different cache durations for different data types
const CACHE_DURATIONS = {
  tournament: 300000, // 5 minutes - rarely changes
  teams: 300000, // 5 minutes - rarely changes
  standings: 120000, // 2 minutes - updates after matches
  topScorers: 120000, // 2 minutes - updates after matches
  matches: 60000, // 1 minute - for live match updates
  announcements: 180000, // 3 minutes - moderate update frequency
};

export function OptimizedTournamentDataProvider({ children }: OptimizedTournamentDataProviderProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [dataFreshness, setDataFreshness] = useState({
    matches: 0,
    teams: 0,
    standings: 0,
    topScorers: 0,
    announcements: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchingRef = useRef(false);

  // Check if data needs refresh based on cache duration
  const needsRefresh = useCallback((dataType: keyof typeof CACHE_DURATIONS) => {
    const lastFetch = dataFreshness[dataType as keyof typeof dataFreshness] || 0;
    const cacheDuration = CACHE_DURATIONS[dataType];
    return Date.now() - lastFetch > cacheDuration;
  }, [dataFreshness]);

  // Optimized function to fetch only matches (for live updates)
  const refreshMatches = useCallback(async () => {
    if (!tournament || fetchingRef.current) return;

    try {
      console.log('🔄 Refreshing matches only...');
      const freshMatches = await tournamentService.getMatches();
      const formattedMatches = freshMatches.map(match => formatMatch(match, teams));
      
      setMatches(formattedMatches);
      setDataFreshness(prev => ({ ...prev, matches: Date.now() }));
      console.log(`✅ Refreshed ${formattedMatches.length} matches`);
      
    } catch (err) {
      console.error('❌ Failed to refresh matches:', err);
      // Don't set error state for match-only refresh failures
    }
  }, [tournament, teams]);

  // Selective data fetching based on what needs updating
  const fetchData = useCallback(async (force = false) => {
    if (fetchingRef.current && !force) {
      console.log('🔄 Fetch already in progress, skipping...');
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    fetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Starting optimized data fetch...');
      
      // Always fetch tournament first to determine what else to fetch
      let tournamentData;
      try {
        if (force || !tournament || needsRefresh('tournament')) {
          tournamentData = await tournamentService.getCurrent();
          setTournament(tournamentData);
          console.log(`📊 Fetched tournament: ${tournamentData.name}`);
        } else {
          tournamentData = tournament;
          console.log('📊 Using cached tournament data');
        }
      } catch (err) {
        console.error('❌ Tournament fetch failed:', err);
        setError('Tournament not found');
        setLoading(false);
        return;
      }

      // Check if tournament has started
      const hasStarted = hasTournamentStarted(tournamentData);
      
      if (!hasStarted) {
        console.log('⚠️ Tournament not started - limited data fetch');
        
        // Only fetch announcements for pre-tournament
        if (force || needsRefresh('announcements')) {
          try {
            const announcementsData = await announcementService.getActive();
            const formattedAnnouncements = await Promise.all(
              announcementsData.map(async (announcement) => {
                if (announcement.author?.user) {
                  try {
                    // Ensure user ID is a number, not an object
                    const userId = typeof announcement.author.user === 'number' 
                      ? announcement.author.user 
                      : (announcement.author.user as any).id || announcement.author.user;
                    
                    if (typeof userId !== 'number') {
                      console.warn(`⚠️ Invalid user ID type for announcement ${announcement.id}:`, typeof userId, userId);
                      return announcement;
                    }
                    
                    const userData = await userService.getById(userId);
                    return { ...announcement, author: { ...announcement.author, user_details: userData } };
                  } catch {
                    return announcement;
                  }
                }
                return announcement;
              })
            );
            setAnnouncements(formattedAnnouncements);
            setDataFreshness(prev => ({ ...prev, announcements: Date.now() }));
          } catch (err) {
            console.warn('⚠️ Failed to fetch announcements:', err);
          }
        }
        
        setMatches([]);
        setTeams([]);
        setStandings([]);
        setTopScorers([]);
        setLoading(false);
        return;
      }

      // Determine what data to fetch based on cache freshness
      const fetchTasks: Promise<any>[] = [];
      const taskTypes: string[] = [];

      if (force || needsRefresh('matches')) {
        fetchTasks.push(tournamentService.getMatches());
        taskTypes.push('matches');
      }

      if (force || needsRefresh('teams') || teams.length === 0) {
        fetchTasks.push(tournamentService.getTeams());
        taskTypes.push('teams');
      }

      if (force || needsRefresh('standings')) {
        fetchTasks.push(tournamentService.getStandings());
        taskTypes.push('standings');
      }

      if (force || needsRefresh('topScorers')) {
        fetchTasks.push(tournamentService.getTopScorers());
        taskTypes.push('topScorers');
      }

      if (force || needsRefresh('announcements')) {
        fetchTasks.push(announcementService.getActive());
        taskTypes.push('announcements');
      }

      if (fetchTasks.length === 0) {
        console.log('✅ All data is fresh, skipping fetch');
        setLoading(false);
        return;
      }

      console.log(`🔄 Fetching: ${taskTypes.join(', ')}`);

      // Execute only the necessary fetches
      const results = await Promise.allSettled(fetchTasks);
      const now = Date.now();

      // Process results in order
      let resultIndex = 0;
      
      for (const taskType of taskTypes) {
        const result = results[resultIndex];
        
        if (result.status === 'fulfilled') {
          switch (taskType) {
            case 'matches':
              const formattedMatches = result.value.map((match: any) => formatMatch(match, teams));
              setMatches(formattedMatches);
              setDataFreshness(prev => ({ ...prev, matches: now }));
              console.log(`✅ Updated ${formattedMatches.length} matches`);
              break;
              
            case 'teams':
              setTeams(result.value);
              setDataFreshness(prev => ({ ...prev, teams: now }));
              console.log(`✅ Updated ${result.value.length} teams`);
              break;
              
            case 'standings':
              const formattedStandings = result.value.map(convertStandingSchemaToStanding);
              setStandings(formattedStandings);
              setDataFreshness(prev => ({ ...prev, standings: now }));
              console.log(`✅ Updated ${formattedStandings.length} standings`);
              break;
              
            case 'topScorers':
              const playerTeamMap = new Map<number, string>();
              teams.forEach(team => {
                team.players?.forEach(player => {
                  if (player.id) {
                    const teamName = team.name?.trim() || `${team.start_year}${team.tagozat}`;
                    playerTeamMap.set(player.id, teamName);
                  }
                });
              });
              
              const formattedTopScorers = result.value.map((scorer: any) => {
                const teamName = playerTeamMap.get(scorer.id) || `Team ${scorer.id}`;
                return convertTopScorerSchemaToTopScorer(scorer, teamName);
              });
              setTopScorers(formattedTopScorers);
              setDataFreshness(prev => ({ ...prev, topScorers: now }));
              console.log(`✅ Updated ${formattedTopScorers.length} top scorers`);
              break;
              
            case 'announcements':
              const formattedAnnouncements = await Promise.all(
                result.value.map(async (announcement: any) => {
                  if (announcement.author?.user) {
                    try {
                      // Ensure user ID is a number, not an object
                      const userId = typeof announcement.author.user === 'number' 
                        ? announcement.author.user 
                        : (announcement.author.user as any).id || announcement.author.user;
                      
                      if (typeof userId !== 'number') {
                        console.warn(`⚠️ Invalid user ID type for announcement ${announcement.id}:`, typeof userId, userId);
                        return announcement;
                      }
                      
                      const userData = await userService.getById(userId);
                      return { ...announcement, author: { ...announcement.author, user_details: userData } };
                    } catch {
                      return announcement;
                    }
                  }
                  return announcement;
                })
              );
              setAnnouncements(formattedAnnouncements);
              setDataFreshness(prev => ({ ...prev, announcements: now }));
              console.log(`✅ Updated ${formattedAnnouncements.length} announcements`);
              break;
          }
        } else {
          console.warn(`⚠️ Failed to fetch ${taskType}:`, result.reason);
        }
        
        resultIndex++;
      }
      
      setLastFetchTime(now);
      console.log('✅ Optimized data fetch completed');
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🚫 Data fetch aborted');
        return;
      }
      
      console.error('❌ Error in optimized data fetch:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [tournament, teams, needsRefresh]);

  // Force refresh all data
  const refetch = useCallback(async () => {
    console.log('🔄 Force refreshing all data...');
    await fetchData(true);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const contextValue: OptimizedTournamentDataContextType = {
    matches,
    teams,
    standings,
    topScorers,
    tournament,
    announcements,
    loading,
    error,
    refetch,
    refreshMatches,
    lastFetchTime,
    dataFreshness
  };

  return (
    <OptimizedTournamentDataContext.Provider value={contextValue}>
      {children}
    </OptimizedTournamentDataContext.Provider>
  );
}

export function useOptimizedTournamentData() {
  const context = useContext(OptimizedTournamentDataContext);
  if (!context) {
    throw new Error('useOptimizedTournamentData must be used within an OptimizedTournamentDataProvider');
  }
  return context;
}
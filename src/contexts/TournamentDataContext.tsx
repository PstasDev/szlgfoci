'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tournamentService, announcementService, userService } from '@/services/apiService';
import { 
  formatMatch, 
  convertStandingSchemaToStanding,
  convertTopScorerSchemaToTopScorer,
  hasTournamentStarted
} from '@/utils/dataUtils';
import type { Match, Team, Standing, TopScorer, Tournament, Announcement } from '@/types/api';

interface TournamentDataContextType {
  matches: Match[];
  teams: Team[];
  standings: Standing[];
  topScorers: TopScorer[];
  tournament: Tournament | null;
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  // Cached data to avoid re-calculations
  _cache: {
    lastFetchTime: number;
    formattedMatches?: Match[];
    liveMatches?: Match[];
    upcomingMatches?: Match[];
    recentMatches?: Match[];
  };
}

const TournamentDataContext = createContext<TournamentDataContextType | null>(null);

interface TournamentDataProviderProps {
  children: ReactNode;
}

const CACHE_DURATION = 30000; // 30 seconds cache

export function TournamentDataProvider({ children }: TournamentDataProviderProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<TournamentDataContextType['_cache']>({
    lastFetchTime: 0
  });

  const fetchData = async (force = false) => {
    const now = Date.now();
    
    // Use cache if available and not expired (unless forced)
    if (!force && cache.lastFetchTime && (now - cache.lastFetchTime) < CACHE_DURATION) {
      console.log('🚀 Using cached tournament data');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Fetching fresh tournament data...`);
      
      // Fetch current tournament first
      let tournamentData;
      try {
        tournamentData = await tournamentService.getCurrent();
        console.log(`📊 Fetched current tournament:`, tournamentData);
      } catch (err) {
        console.error(`❌ Current tournament not found:`, err);
        setError(`Current tournament was not found. The tournament may not be set up yet.`);
        setLoading(false);
        return;
      }
      
      setTournament(tournamentData);

      // Check if tournament has started
      const hasStarted = hasTournamentStarted(tournamentData);
      console.log(`⏰ Tournament "${tournamentData.name}" has started: ${hasStarted}`);
      
      if (!hasStarted) {
        console.log(`⚠️ Tournament hasn't started yet - fetching announcements only`);
        
        // Even if tournament hasn't started, still fetch announcements
        try {
          const announcementsData = await announcementService.getActive();
          console.log('📢 TournamentDataContext - Raw announcements data:', announcementsData);
          
          // Process announcements and fetch user data for authors
          const formattedAnnouncements = await Promise.all(
            announcementsData.map(async (announcement) => {
              if (announcement.author && announcement.author.user) {
                try {
                  const userData = await userService.getById(announcement.author.user);
                  return {
                    ...announcement,
                    author: {
                      ...announcement.author,
                      user_details: userData
                    }
                  };
                } catch (error) {
                  console.warn(`⚠️ Failed to fetch user ${announcement.author.user} for announcement ${announcement.id}:`, error);
                  return announcement;
                }
              }
              return announcement;
            })
          );
          
          setAnnouncements(formattedAnnouncements);
          console.log(`📢 Fetched ${formattedAnnouncements.length} announcements (pre-tournament)`);
          console.log('📢 Formatted announcements (pre-tournament):', formattedAnnouncements);
        } catch (err) {
          console.warn('⚠️ Failed to fetch announcements:', err);
          setAnnouncements([]);
        }
        
        setMatches([]);
        setTeams([]);
        setStandings([]);
        setTopScorers([]);
        setCache({ lastFetchTime: now });
        setLoading(false);
        return;
      }

      console.log(`✅ Tournament has started - fetching all data in parallel...`);
      
      // Fetch all data in parallel for better performance
      const [matchesData, teamsData, standingsData, topScorersData, announcementsData] = await Promise.allSettled([
        tournamentService.getMatches(),
        tournamentService.getTeams(),
        tournamentService.getStandings(),
        tournamentService.getTopScorers(),
        announcementService.getActive()
      ]);

      // Process results
      const processedMatches = matchesData.status === 'fulfilled' ? matchesData.value : [];
      const processedTeams = teamsData.status === 'fulfilled' ? teamsData.value : [];
      const processedStandings = standingsData.status === 'fulfilled' ? standingsData.value : [];
      const processedTopScorers = topScorersData.status === 'fulfilled' ? topScorersData.value : [];
      const processedAnnouncements = announcementsData.status === 'fulfilled' ? announcementsData.value : [];

      console.log('📢 TournamentDataContext - Raw announcements data (tournament started):', processedAnnouncements);

      // Log any failed requests
      if (matchesData.status === 'rejected') console.warn('⚠️ Failed to fetch matches:', matchesData.reason);
      if (teamsData.status === 'rejected') console.warn('⚠️ Failed to fetch teams:', teamsData.reason);
      if (standingsData.status === 'rejected') console.warn('⚠️ Failed to fetch standings:', standingsData.reason);
      if (topScorersData.status === 'rejected') console.warn('⚠️ Failed to fetch top scorers:', topScorersData.reason);
      if (announcementsData.status === 'rejected') console.warn('⚠️ Failed to fetch announcements:', announcementsData.reason);
      if (announcementsData.status === 'rejected') console.warn('⚠️ Failed to fetch announcements:', announcementsData.reason);

      // Format data
      const formattedMatches = processedMatches.map(match => formatMatch(match, processedTeams));
      const formattedStandings = processedStandings.map(convertStandingSchemaToStanding);
      const formattedTopScorers = processedTopScorers.map((scorer) => 
        convertTopScorerSchemaToTopScorer(scorer, `Team ${scorer.id}`)
      );
      
      // Process announcements and fetch user data for authors
      const formattedAnnouncements = await Promise.all(
        processedAnnouncements.map(async (announcement) => {
          if (announcement.author && announcement.author.user) {
            try {
              const userData = await userService.getById(announcement.author.user);
              return {
                ...announcement,
                author: {
                  ...announcement.author,
                  user_details: userData
                }
              };
            } catch (error) {
              console.warn(`⚠️ Failed to fetch user ${announcement.author.user} for announcement ${announcement.id}:`, error);
              return announcement; // Return announcement without user details if fetch fails
            }
          }
          return announcement;
        })
      );
      
      setMatches(formattedMatches);
      setTeams(processedTeams);
      setStandings(formattedStandings);
      setTopScorers(formattedTopScorers);
      setAnnouncements(formattedAnnouncements);
      
      console.log(`📢 Fetched ${formattedAnnouncements.length} announcements (tournament started)`);
      console.log('📢 Formatted announcements (tournament started):', formattedAnnouncements);
      
      // Update cache
      setCache({ lastFetchTime: now });
      
      console.log(`✅ Successfully loaded all data for tournament "${tournamentData.name}"`);
      console.log(`📊 Data summary: ${formattedMatches.length} matches, ${processedTeams.length} teams, ${formattedStandings.length} standings, ${formattedTopScorers.length} top scorers, ${processedAnnouncements.length} announcements`);
      
    } catch (err) {
      console.error(`❌ Error fetching tournament data:`, err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: TournamentDataContextType = {
    matches,
    teams,
    standings,
    topScorers,
    tournament,
    announcements,
    loading,
    error,
    refetch: () => fetchData(true),
    _cache: cache
  };

  return (
    <TournamentDataContext.Provider value={contextValue}>
      {children}
    </TournamentDataContext.Provider>
  );
}

export function useTournamentData() {
  const context = useContext(TournamentDataContext);
  if (!context) {
    throw new Error('useTournamentData must be used within a TournamentDataProvider');
  }
  return context;
}
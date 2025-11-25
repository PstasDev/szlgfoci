// API service functions for fetching data from the Django backend
import { api } from '@/lib/api';
import type {
  Tournament,
  Team,
  TeamExtendedSchema,
  TeamCreateSchema,
  TeamUpdateSchema,
  Player,
  PlayerExtendedSchema,
  ApiMatch,
  EventSchema,
  MatchEvent,
  Round,
  StandingSchema,
  TopScorerSchema,
  AllEventsSchema,
  AllEvents,
  Profile,
  Announcement,
  User,
  TimeSyncSchema,
  PhotoSchema,
  PhotoCreateSchema,
  PhotoUpdateSchema,
  KozlemenySchema,
  KozlemenyCreateSchema,
  KozlemenyUpdateSchema,
  LiveMatchStatus,
  LiveMatch,
  LiveUpdatePayload,
  SzankcioSchema,
  QuickGoalRequest,
  QuickOwnGoalRequest,
  QuickCardRequest,
  GeneralEventRequest,
  QuickGoalResponse,
  QuickCardResponse,
  GeneralEventResponse,
  MatchRecordResponse,
  MatchStatusChoice,
  MatchStatusUpdateRequest
} from '@/types/api';

// Tournament endpoints
export const tournamentService = {
  async getAll(): Promise<Tournament[]> {
    try {
      console.log('🔥 tournamentService.getAll() called');
      const result = await api.get<Tournament[]>('/tournaments');
      console.log('🔥 tournamentService.getAll() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 tournamentService.getAll() failed:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Tournament> {
    try {
      console.log(`🔥 tournamentService.getById(${id}) called`);
      const result = await api.get<Tournament>(`/tournaments/${id}`);
      console.log(`🔥 tournamentService.getById(${id}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔥 tournamentService.getById(${id}) failed:`, error);
      throw error;
    }
  },

  async getCurrent(): Promise<Tournament> {
    try {
      console.log('🔥 tournamentService.getCurrent() called');
      const result = await api.get<Tournament>('/tournament/current');
      console.log('🔥 tournamentService.getCurrent() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 tournamentService.getCurrent() failed:', error);
      throw error;
    }
  },

  async getOpenForRegistration(): Promise<Tournament[]> {
    return api.get<Tournament[]>('/tournaments/open-for-registration');
  },

  // New simplified endpoints that work with the current tournament
  async getStandings(): Promise<StandingSchema[]> {
    try {
      console.log('🔥 tournamentService.getStandings() called');
      const result = await api.get<StandingSchema[]>('/standings');
      console.log('🔥 tournamentService.getStandings() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 tournamentService.getStandings() failed:', error);
      throw error;
    }
  },

  async getMatches(): Promise<ApiMatch[]> {
    try {
      console.log('🔥 tournamentService.getMatches() called');
      const result = await api.get<ApiMatch[]>('/matches');
      console.log('🔥 tournamentService.getMatches() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 tournamentService.getMatches() failed:', error);
      throw error;
    }
  },

  async getTeams(): Promise<Team[]> {
    try {
      console.log('🔥 tournamentService.getTeams() called');
      const result = await api.get<Team[]>('/teams');
      console.log('🔥 tournamentService.getTeams() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 tournamentService.getTeams() failed:', error);
      throw error;
    }
  },

  async getTeam(teamId: number): Promise<Team> {
    return api.get<Team>(`/teams/${teamId}`);
  },

  async getTeamPlayers(teamId: number): Promise<Player[]> {
    return api.get<Player[]>(`/teams/${teamId}/players`);
  },

  async getTeamMatches(teamId: number): Promise<ApiMatch[]> {
    return api.get<ApiMatch[]>(`/teams/${teamId}/matches`);
  },

  async getTopScorers(): Promise<TopScorerSchema[]> {
    try {
      console.log('🔥 tournamentService.getTopScorers() called');
      const result = await api.get<TopScorerSchema[]>('/topscorers');
      console.log('🔥 tournamentService.getTopScorers() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 tournamentService.getTopScorers() failed:', error);
      throw error;
    }
  },

  async getRounds(): Promise<Round[]> {
    return api.get<Round[]>('/rounds');
  },

  async getRound(roundNumber: number): Promise<Round> {
    return api.get<Round>(`/rounds/${roundNumber}`);
  },

  async getRoundMatches(roundNumber: number): Promise<ApiMatch[]> {
    return api.get<ApiMatch[]>(`/rounds/${roundNumber}/matches`);
  },

  async getGoals(): Promise<EventSchema[]> {
    return api.get<EventSchema[]>('/goals');
  },

  async getYellowCards(): Promise<EventSchema[]> {
    return api.get<EventSchema[]>('/yellow_cards');
  },

  async getRedCards(): Promise<EventSchema[]> {
    return api.get<EventSchema[]>('/red_cards');
  },

  async addGoal(data: { match: number; player: number; minute: number; team: number }): Promise<EventSchema> {
    return api.post<EventSchema>('/goals', data);
  },

  async addYellowCard(data: { match: number; player: number; minute: number; team: number }): Promise<EventSchema> {
    return api.post<EventSchema>('/yellow_cards', data);
  },

  async addRedCard(data: { match: number; player: number; minute: number; team: number }): Promise<EventSchema> {
    return api.post<EventSchema>('/red_cards', data);
  },

  async addSubstitution(data: { match: number; player: number; minute: number; team: number }): Promise<EventSchema> {
    return api.post<EventSchema>('/substitutions', data);
  },

  async getPlayers(): Promise<Player[]> {
    return api.get<Player[]>('/players');
  },

  async getPlayer(playerId: number): Promise<Player> {
    return api.get<Player>(`/players/${playerId}`);
  },

  async getPlayerEvents(playerId: number): Promise<AllEventsSchema> {
    return api.get<AllEventsSchema>(`/players/${playerId}/events`);
  },

  async getTeamEvents(teamId: number): Promise<AllEventsSchema> {
    return api.get<AllEventsSchema>(`/teams/${teamId}/events`);
  },

  async getTeamSanctions(teamId: number): Promise<SzankcioSchema[]> {
    try {
      console.log(`🚫 tournamentService.getTeamSanctions(${teamId}) called`);
      const result = await api.get<SzankcioSchema[]>(`/teams/${teamId}/sanctions`);
      console.log(`🚫 tournamentService.getTeamSanctions(${teamId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🚫 tournamentService.getTeamSanctions(${teamId}) failed:`, error);
      throw error;
    }
  }
};

// Team endpoints
export const teamService = {
  async getAll(): Promise<Team[]> {
    return api.get<Team[]>('/teams');
  },

  async getById(id: number): Promise<Team> {
    return api.get<Team>(`/teams/${id}`);
  },

  async getActive(): Promise<Team[]> {
    return api.get<Team[]>('/teams/active');
  },

  async getInactive(): Promise<Team[]> {
    return api.get<Team[]>('/teams/inactive');
  },

  async getPlayers(teamId: number): Promise<Player[]> {
    return api.get<Player[]>(`/teams/${teamId}/players`);
  }
};

// Player endpoints
export const playerService = {
  async getAll(): Promise<Player[]> {
    return api.get<Player[]>('/players');
  },

  async getById(id: number): Promise<Player> {
    return api.get<Player>(`/players/${id}`);
  },

  async getCaptains(): Promise<Player[]> {
    return api.get<Player[]>('/players/captains');
  },

  async getEvents(playerId: number): Promise<AllEvents> {
    return api.get<AllEvents>(`/players/${playerId}/events`);
  }
};

// Profile endpoints
export const profileService = {
  async getAll(): Promise<Profile[]> {
    return api.get<Profile[]>('/profiles');
  },

  async getById(id: number): Promise<Profile> {
    return api.get<Profile>(`/profiles/${id}`);
  },

  async getReferees(): Promise<Profile[]> {
    return api.get<Profile[]>('/profiles/referees');
  },

  async getMatches(profileId: number): Promise<ApiMatch[]> {
    return api.get<ApiMatch[]>(`/profiles/${profileId}/matches`);
  }
};

// Match endpoints
export const matchService = {
  async getAll(): Promise<ApiMatch[]> {
    return api.get<ApiMatch[]>('/matches');
  },

  async getById(id: number): Promise<ApiMatch> {
    return api.get<ApiMatch>(`/matches/${id}`);
  },

  async getGoals(matchId: number): Promise<MatchEvent[]> {
    return api.get<MatchEvent[]>(`/matches/${matchId}/goals`);
  },

  async getEvents(matchId: number): Promise<AllEvents> {
    return api.get<AllEvents>(`/matches/${matchId}/events`);
  },

  async getYellowCards(matchId: number): Promise<MatchEvent[]> {
    return api.get<MatchEvent[]>(`/matches/${matchId}/yellow_cards`);
  },

  async getRedCards(matchId: number): Promise<MatchEvent[]> {
    return api.get<MatchEvent[]>(`/matches/${matchId}/red_cards`);
  },

  // NEW: Get match status choices
  async getStatusChoices(): Promise<{ choices: MatchStatusChoice[] }> {
    try {
      console.log('🔥 matchService.getStatusChoices() called');
      const result = await api.get<{ choices: MatchStatusChoice[] }>('/match-status-choices');
      console.log('🔥 matchService.getStatusChoices() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 matchService.getStatusChoices() failed:', error);
      throw error;
    }
  },

  // NEW: Update match status (admin)
  async updateStatus(matchId: number, data: MatchStatusUpdateRequest, token: string): Promise<ApiMatch> {
    try {
      console.log(`🔥 matchService.updateStatus(${matchId}) called with:`, data);
      const result = await api.put<ApiMatch>(
        `/admin/matches/${matchId}`,
        data
      );
      console.log(`🔥 matchService.updateStatus(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔥 matchService.updateStatus(${matchId}) failed:`, error);
      throw error;
    }
  },

  // NEW: Update match status (referee/biro)
  async updateStatusReferee(matchId: number, data: MatchStatusUpdateRequest, token: string): Promise<ApiMatch> {
    try {
      console.log(`🔥 matchService.updateStatusReferee(${matchId}) called with:`, data);
      const result = await api.put<ApiMatch>(
        `/biro/matches/${matchId}`,
        data
      );
      console.log(`🔥 matchService.updateStatusReferee(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔥 matchService.updateStatusReferee(${matchId}) failed:`, error);
      throw error;
    }
  }
};

// Event endpoints
export const eventService = {
  async getAllGoals(): Promise<MatchEvent[]> {
    return api.get<MatchEvent[]>('/goals');
  },

  async getGoal(goalId: number): Promise<MatchEvent> {
    return api.get<MatchEvent>(`/goals/${goalId}`);
  },

  async getAllYellowCards(): Promise<MatchEvent[]> {
    return api.get<MatchEvent[]>('/yellow_cards');
  },

  async getYellowCard(cardId: number): Promise<MatchEvent> {
    return api.get<MatchEvent>(`/yellow_cards/${cardId}`);
  },

  async getAllRedCards(): Promise<MatchEvent[]> {
    return api.get<MatchEvent[]>('/red_cards');
  },

  async getRedCard(cardId: number): Promise<MatchEvent> {
    return api.get<MatchEvent>(`/red_cards/${cardId}`);
  }
};

// Round endpoints
export const roundService = {
  async getAll(): Promise<Round[]> {
    return api.get<Round[]>('/rounds');
  },

  async getById(id: number): Promise<Round> {
    return api.get<Round>(`/rounds/${id}`);
  }
};

// Announcement endpoints
export const announcementService = {
  async getActive(): Promise<Announcement[]> {
    try {
      console.log('🔥 announcementService.getActive() called');
      const result = await api.get<Announcement[]>('/kozlemenyek');
      console.log('🔥 announcementService.getActive() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 announcementService.getActive() failed:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Announcement> {
    try {
      console.log(`🔥 announcementService.getById(${id}) called`);
      const result = await api.get<Announcement>(`/kozlemenyek/${id}`);
      console.log(`🔥 announcementService.getById(${id}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔥 announcementService.getById(${id}) failed:`, error);
      throw error;
    }
  },

  async getByPriority(priority: 'low' | 'normal' | 'high' | 'urgent'): Promise<Announcement[]> {
    try {
      console.log(`🔥 announcementService.getByPriority(${priority}) called`);
      const result = await api.get<Announcement[]>(`/kozlemenyek/priority/${priority}`);
      console.log(`🔥 announcementService.getByPriority(${priority}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔥 announcementService.getByPriority(${priority}) failed:`, error);
      throw error;
    }
  }
};

// User endpoints
export const userService = {
  async getById(id: number): Promise<User> {
    try {
      console.log(`🔥 userService.getById(${id}) called`);
      const result = await api.get<User>(`/users/${id}`);
      console.log(`🔥 userService.getById(${id}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔥 userService.getById(${id}) failed:`, error);
      throw error;
    }
  }
};

// Time synchronization service
export const timeService = {
  async getServerTime(): Promise<TimeSyncSchema> {
    try {
      console.log('🕐 timeService.getServerTime() called');
      const result = await api.get<TimeSyncSchema>('/time');
      console.log('🕐 timeService.getServerTime() success:', result);
      return result;
    } catch (error) {
      console.error('🕐 timeService.getServerTime() failed:', error);
      throw error;
    }
  }
};

// NEW: Live match services for real-time updates
export const liveMatchService = {
  async getLiveMatches(): Promise<LiveMatch[]> {
    try {
      console.log('🔴 liveMatchService.getLiveMatches() called');
      // Use the matches endpoint and filter for live matches
      const allMatches = await api.get<ApiMatch[]>('/matches');
      
      // Import getMatchStatus from dataUtils for proper status checking
      const { getMatchStatus, getTeamDisplayName } = await import('@/utils/dataUtils');
      
      // Filter for live matches and convert to LiveMatch format
      const liveMatches: LiveMatch[] = allMatches
        .filter(match => {
          // Use the proper match status logic that checks for events
          const status = getMatchStatus(match);
          return status === 'live';
        })
        .map(match => {
          // Calculate current minute from match start
          const now = new Date();
          const matchStart = new Date(`${match.datetime}`);
          const minutesElapsed = Math.floor((now.getTime() - matchStart.getTime()) / (1000 * 60));
          const currentMinute = Math.max(0, Math.min(minutesElapsed, 120)); // Cap at 120 minutes
          
          return {
            id: match.id || 0,
            tournament: match.tournament?.id || 0,
            team1: match.team1?.id || 0,
            team2: match.team2?.id || 0,
            team1_score: null,
            team2_score: null,
            date: match.datetime.split('T')[0],
            venue: 'Helyszín',
            referee: match.referee?.id || null,
            round_obj: match.round_obj?.id || 0,
            homeTeam: getTeamDisplayName(match.team1 || null),
            awayTeam: getTeamDisplayName(match.team2 || null),
            homeTeamId: match.team1?.id || 0,
            awayTeamId: match.team2?.id || 0,
            homeScore: null,
            awayScore: null,
            time: match.datetime.split('T')[1].substring(0, 5),
            round: match.round_obj?.number ? `${match.round_obj.number}. forduló` : 'Forduló',
            events: match.events?.map(e => ({
              id: e.id || 0,
              match: match.id || 0,
              player: e.player?.id || 0,
              event_type: e.event_type as any,
              minute: e.minute,
              playerName: e.player?.name,
              team: Math.random() > 0.5 ? 'home' : 'away' // TODO: Determine correct team
            })) || [],
            homeTeamObj: match.team1,
            awayTeamObj: match.team2,
            live_status: {
              match_id: match.id || 0,
              status: currentMinute < 45 ? 'first_half' : currentMinute < 60 ? 'half_time' : 'second_half',
              current_minute: currentMinute,
              current_extra_time: Math.max(0, currentMinute - 90) > 0 ? Math.max(0, currentMinute - 90) : undefined,
              extra_time_minutes: Math.max(0, currentMinute - 90), // DEPRECATED but kept for compatibility
              formatted_time: currentMinute > 90 ? `90+${currentMinute - 90}'` : currentMinute > 45 ? `${Math.min(currentMinute, 90)}'` : `${currentMinute}'`,
              last_updated: new Date().toISOString(),
              goals_team1: 0,
              goals_team2: 0,
              is_live: true,
              is_finished: false
            },
            recent_events: [],
            is_featured: true,
            cache_priority: 1,
            display_time: `${Math.min(currentMinute, 90)}'${currentMinute > 90 ? `+${currentMinute - 90}` : ''}`
          } as LiveMatch;
        });
      
      console.log('🔴 liveMatchService.getLiveMatches() success:', liveMatches);
      return liveMatches;
    } catch (error) {
      console.error('🔴 liveMatchService.getLiveMatches() failed:', error);
      throw error;
    }
  },

  async getLiveMatchById(matchId: number): Promise<LiveMatch> {
    try {
      console.log(`🔴 liveMatchService.getLiveMatchById(${matchId}) called`);
      // Use the matches endpoint to get specific match
      const match = await api.get<ApiMatch>(`/matches/${matchId}`);
      
      // Import helper functions
      const { getTeamDisplayName } = await import('@/utils/dataUtils');
      
      // Calculate current minute from match start
      const now = new Date();
      const matchStart = new Date(`${match.datetime}`);
      const minutesElapsed = Math.floor((now.getTime() - matchStart.getTime()) / (1000 * 60));
      const currentMinute = Math.max(0, Math.min(minutesElapsed, 120)); // Cap at 120 minutes
      
      const liveMatch: LiveMatch = {
        id: match.id || 0,
        tournament: match.tournament?.id || 0,
        team1: match.team1?.id || 0,
        team2: match.team2?.id || 0,
        team1_score: null,
        team2_score: null,
        date: match.datetime.split('T')[0],
        venue: 'Helyszín',
        referee: match.referee?.id || null,
        round_obj: match.round_obj?.id || 0,
        homeTeam: getTeamDisplayName(match.team1 || null),
        awayTeam: getTeamDisplayName(match.team2 || null),
        homeTeamId: match.team1?.id || 0,
        awayTeamId: match.team2?.id || 0,
        homeScore: null,
        awayScore: null,
        time: match.datetime.split('T')[1].substring(0, 5),
        round: match.round_obj?.number ? `${match.round_obj.number}. forduló` : 'Forduló',
        events: match.events?.map(e => ({
          id: e.id || 0,
          match: match.id || 0,
          player: e.player?.id || 0,
          event_type: e.event_type as any,
          minute: e.minute,
          playerName: e.player?.name,
          team: Math.random() > 0.5 ? 'home' : 'away' // TODO: Determine correct team
        })) || [],
        homeTeamObj: match.team1,
        awayTeamObj: match.team2,
        live_status: {
          match_id: match.id || 0,
          status: currentMinute < 45 ? 'first_half' : currentMinute < 60 ? 'half_time' : 'second_half',
          current_minute: currentMinute,
          current_extra_time: Math.max(0, currentMinute - 90) > 0 ? Math.max(0, currentMinute - 90) : undefined,
          extra_time_minutes: Math.max(0, currentMinute - 90), // DEPRECATED but kept for compatibility
          formatted_time: currentMinute > 90 ? `90+${currentMinute - 90}'` : currentMinute > 45 ? `${Math.min(currentMinute, 90)}'` : `${currentMinute}'`,
          last_updated: new Date().toISOString(),
          goals_team1: 0,
          goals_team2: 0,
          is_live: true,
          is_finished: false
        },
        recent_events: [],
        is_featured: true,
        cache_priority: 1,
        display_time: `${Math.min(currentMinute, 90)}'${currentMinute > 90 ? `+${currentMinute - 90}` : ''}`
      };
      
      console.log(`🔴 liveMatchService.getLiveMatchById(${matchId}) success:`, liveMatch);
      return liveMatch;
    } catch (error) {
      console.error(`🔴 liveMatchService.getLiveMatchById(${matchId}) failed:`, error);
      throw error;
    }
  },

  async getLiveMatchStatus(matchId: number): Promise<LiveMatchStatus> {
    try {
      console.log(`🔴 liveMatchService.getLiveMatchStatus(${matchId}) called`);
      const result = await api.get<LiveMatchStatus>(`/live-matches/${matchId}/status`);
      console.log(`🔴 liveMatchService.getLiveMatchStatus(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔴 liveMatchService.getLiveMatchStatus(${matchId}) failed:`, error);
      throw error;
    }
  },

  async getMatchTiming(matchId: number): Promise<{ current_minute: number; current_extra_time?: number; status: string; formatted_time?: string }> {
    try {
      console.log(`⏱️ liveMatchService.getMatchTiming(${matchId}) called`);
      const result = await api.get<{ current_minute: number; current_extra_time?: number; status: string; formatted_time?: string }>(`/matches/${matchId}/timing`);
      console.log(`⏱️ liveMatchService.getMatchTiming(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`⏱️ liveMatchService.getMatchTiming(${matchId}) failed:`, error);
      throw error;
    }
  }
};

// NEW: Enhanced team service with logo support
export const enhancedTeamService = {
  async getTeamsWithLogos(): Promise<TeamExtendedSchema[]> {
    try {
      console.log('🏆 enhancedTeamService.getTeamsWithLogos() called');
      const result = await api.get<TeamExtendedSchema[]>('/teams/extended');
      console.log('🏆 enhancedTeamService.getTeamsWithLogos() success:', result);
      return result;
    } catch (error) {
      console.error('🏆 enhancedTeamService.getTeamsWithLogos() failed:', error);
      throw error;
    }
  },

  async createTeam(teamData: TeamCreateSchema): Promise<TeamExtendedSchema> {
    try {
      console.log('🏆 enhancedTeamService.createTeam() called', teamData);
      const result = await api.post<TeamExtendedSchema>('/teams', teamData);
      console.log('🏆 enhancedTeamService.createTeam() success:', result);
      return result;
    } catch (error) {
      console.error('🏆 enhancedTeamService.createTeam() failed:', error);
      throw error;
    }
  },

  async updateTeam(teamId: number, teamData: TeamUpdateSchema): Promise<TeamExtendedSchema> {
    try {
      console.log(`🏆 enhancedTeamService.updateTeam(${teamId}) called`, teamData);
      const result = await api.put<TeamExtendedSchema>(`/teams/${teamId}`, teamData);
      console.log(`🏆 enhancedTeamService.updateTeam(${teamId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🏆 enhancedTeamService.updateTeam(${teamId}) failed:`, error);
      throw error;
    }
  }
};

// NEW: Photo gallery service
export const photoService = {
  async getMatchPhotos(matchId: number): Promise<PhotoSchema[]> {
    try {
      console.log(`📸 photoService.getMatchPhotos(${matchId}) called`);
      const result = await api.get<PhotoSchema[]>(`/matches/${matchId}/photos`);
      console.log(`📸 photoService.getMatchPhotos(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`📸 photoService.getMatchPhotos(${matchId}) failed:`, error);
      throw error;
    }
  },

  async uploadPhoto(matchId: number, photoData: PhotoCreateSchema): Promise<PhotoSchema> {
    try {
      console.log(`📸 photoService.uploadPhoto(${matchId}) called`, photoData);
      const result = await api.post<PhotoSchema>(`/matches/${matchId}/photos`, photoData);
      console.log(`📸 photoService.uploadPhoto(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`📸 photoService.uploadPhoto(${matchId}) failed:`, error);
      throw error;
    }
  }
};

// NEW: Referee API service for enhanced event creation with extra time support
export const refereeService = {
  // Quick goal creation with extra time support
  async addQuickGoal(matchId: number, data: QuickGoalRequest): Promise<QuickGoalResponse> {
    try {
      console.log(`⚽ refereeService.addQuickGoal(${matchId}) called with raw data:`, data);
      
      // Only include minute_extra_time if provided and > 0
      const requestData: any = {
        player_id: data.player_id,
        minute: data.minute,
        half: data.half
      };
      
      if (data.minute_extra_time && data.minute_extra_time > 0) {
        requestData.minute_extra_time = data.minute_extra_time;
        console.log(`⚽ Including minute_extra_time: ${data.minute_extra_time}`);
      } else {
        console.log(`⚽ No extra time (minute_extra_time: ${data.minute_extra_time})`);
      }
      
      console.log(`⚽ Final request payload:`, requestData);
      
      const result = await api.post<QuickGoalResponse>(`/biro/matches/${matchId}/quick-goal`, requestData);
      console.log(`⚽ refereeService.addQuickGoal(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`⚽ refereeService.addQuickGoal(${matchId}) failed:`, error);
      throw error;
    }
  },

  // Quick own goal creation with extra time support
  async addQuickOwnGoal(matchId: number, data: QuickOwnGoalRequest): Promise<QuickGoalResponse> {
    try {
      console.log(`🔴 refereeService.addQuickOwnGoal(${matchId}) called with raw data:`, data);
      
      // Only include minute_extra_time if provided and > 0
      const requestData: any = {
        player_id: data.player_id,
        minute: data.minute,
        half: data.half
      };
      
      if (data.minute_extra_time && data.minute_extra_time > 0) {
        requestData.minute_extra_time = data.minute_extra_time;
        console.log(`🔴 Including minute_extra_time: ${data.minute_extra_time}`);
      } else {
        console.log(`🔴 No extra time (minute_extra_time: ${data.minute_extra_time})`);
      }
      
      console.log(`🔴 Final request payload:`, requestData);
      
      const result = await api.post<QuickGoalResponse>(`/biro/matches/${matchId}/quick-own-goal`, requestData);
      console.log(`🔴 refereeService.addQuickOwnGoal(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔴 refereeService.addQuickOwnGoal(${matchId}) failed:`, error);
      throw error;
    }
  },

  // Quick card creation with extra time support
  async addQuickCard(matchId: number, data: QuickCardRequest): Promise<QuickCardResponse> {
    try {
      console.log(`🟨 refereeService.addQuickCard(${matchId}) called`, data);
      
      // Only include minute_extra_time if provided and > 0
      const requestData: any = {
        player_id: data.player_id,
        minute: data.minute,
        card_type: data.card_type,
        half: data.half
      };
      
      if (data.minute_extra_time && data.minute_extra_time > 0) {
        requestData.minute_extra_time = data.minute_extra_time;
      }
      
      const result = await api.post<QuickCardResponse>(`/biro/matches/${matchId}/quick-card`, requestData);
      console.log(`🟨 refereeService.addQuickCard(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🟨 refereeService.addQuickCard(${matchId}) failed:`, error);
      throw error;
    }
  },

  // General event creation with extra time support
  async addEvent(matchId: number, data: GeneralEventRequest): Promise<GeneralEventResponse> {
    try {
      console.log(`📝 refereeService.addEvent(${matchId}) called`, data);
      
      // Only include minute_extra_time if provided and > 0
      const requestData: any = {
        event_type: data.event_type,
        minute: data.minute,
        half: data.half
      };
      
      if (data.minute_extra_time && data.minute_extra_time > 0) {
        requestData.minute_extra_time = data.minute_extra_time;
      }
      
      if (data.player_id) {
        requestData.player_id = data.player_id;
      }
      
      const result = await api.post<GeneralEventResponse>(`/biro/matches/${matchId}/events`, requestData);
      console.log(`📝 refereeService.addEvent(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`📝 refereeService.addEvent(${matchId}) failed:`, error);
      throw error;
    }
  },

  // Update existing event with extra time support
  async updateEvent(matchId: number, eventId: number, data: Partial<GeneralEventRequest>): Promise<GeneralEventResponse> {
    try {
      console.log(`✏️ refereeService.updateEvent(${matchId}, ${eventId}) called`, data);
      
      // Only include fields that are provided
      const requestData: any = {};
      
      if (data.minute !== undefined) {
        requestData.minute = data.minute;
      }
      
      if (data.minute_extra_time !== undefined) {
        requestData.minute_extra_time = data.minute_extra_time;
      }
      
      if (data.event_type !== undefined) {
        requestData.event_type = data.event_type;
      }
      
      if (data.half !== undefined) {
        requestData.half = data.half;
      }
      
      if (data.player_id !== undefined) {
        requestData.player_id = data.player_id;
      }
      
      const result = await api.put<GeneralEventResponse>(`/biro/matches/${matchId}/events/${eventId}`, requestData);
      console.log(`✏️ refereeService.updateEvent(${matchId}, ${eventId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`✏️ refereeService.updateEvent(${matchId}, ${eventId}) failed:`, error);
      throw error;
    }
  },

  // Get match record (jegyzőkönyv) with enhanced time formatting
  async getMatchRecord(matchId: number): Promise<MatchRecordResponse> {
    try {
      console.log(`📋 refereeService.getMatchRecord(${matchId}) called`);
      const result = await api.get<MatchRecordResponse>(`/biro/matches/${matchId}/jegyzokonyv`);
      console.log(`📋 refereeService.getMatchRecord(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`📋 refereeService.getMatchRecord(${matchId}) failed:`, error);
      throw error;
    }
  },

  // Delete an event
  async deleteEvent(matchId: number, eventId: number): Promise<{ message: string }> {
    try {
      console.log(`🗑️ refereeService.deleteEvent(${matchId}, ${eventId}) called`);
      const result = await api.delete<{ message: string }>(`/biro/matches/${matchId}/events/${eventId}`);
      console.log(`🗑️ refereeService.deleteEvent(${matchId}, ${eventId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🗑️ refereeService.deleteEvent(${matchId}, ${eventId}) failed:`, error);
      throw error;
    }
  }
};

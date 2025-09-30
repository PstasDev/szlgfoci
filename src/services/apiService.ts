// API service functions for fetching data from the Django backend
import { api } from '@/lib/api';
import type {
  Tournament,
  Team,
  Player,
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
  User
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
      const result = await api.get<Announcement[]>('/announcements');
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
      const result = await api.get<Announcement>(`/announcements/${id}`);
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
      const result = await api.get<Announcement[]>(`/announcements/priority/${priority}`);
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

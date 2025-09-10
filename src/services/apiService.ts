// API service functions for fetching data from the Django backend
import { api } from '@/lib/api';
import type {
  Tournament,
  Team,
  Player,
  ApiMatch,
  Match,
  EventSchema,
  MatchEvent,
  Round,
  StandingSchema,
  Standing,
  TopScorerSchema,
  TopScorer,
  AllEventsSchema,
  AllEvents,
  Profile
} from '@/types/api';

// Tournament endpoints
export const tournamentService = {
  async getAll(): Promise<Tournament[]> {
    return api.get<Tournament[]>('/tournaments');
  },

  async getById(id: number): Promise<Tournament> {
    return api.get<Tournament>(`/tournaments/${id}`);
  },

  async getOpenForRegistration(): Promise<Tournament[]> {
    return api.get<Tournament[]>('/tournaments/open-for-registration');
  },

  async getStandings(tournamentId: number): Promise<StandingSchema[]> {
    return api.get<StandingSchema[]>(`/tournaments/${tournamentId}/standings`);
  },

  async getMatches(tournamentId: number): Promise<ApiMatch[]> {
    return api.get<ApiMatch[]>(`/tournaments/${tournamentId}/matches`);
  },

  async getTeams(tournamentId: number): Promise<Team[]> {
    return api.get<Team[]>(`/tournaments/${tournamentId}/teams`);
  },

  async getTeam(tournamentId: number, teamId: number): Promise<Team> {
    return api.get<Team>(`/tournaments/${tournamentId}/teams/${teamId}`);
  },

  async getTeamPlayers(tournamentId: number, teamId: number): Promise<Player[]> {
    return api.get<Player[]>(`/tournaments/${tournamentId}/teams/${teamId}/players`);
  },

  async getTeamMatches(tournamentId: number, teamId: number): Promise<ApiMatch[]> {
    return api.get<ApiMatch[]>(`/tournaments/${tournamentId}/teams/${teamId}/matches`);
  },

  async getTopScorers(tournamentId: number): Promise<TopScorerSchema[]> {
    return api.get<TopScorerSchema[]>(`/tournaments/${tournamentId}/topscorers`);
  },

  async getRounds(tournamentId: number): Promise<Round[]> {
    return api.get<Round[]>(`/tournaments/${tournamentId}/rounds`);
  },

  async getRound(tournamentId: number, roundNumber: number): Promise<Round> {
    return api.get<Round>(`/tournaments/${tournamentId}/rounds/${roundNumber}`);
  },

  async getRoundMatches(tournamentId: number, roundNumber: number): Promise<ApiMatch[]> {
    return api.get<ApiMatch[]>(`/tournaments/${tournamentId}/rounds/${roundNumber}/matches`);
  },

  async getGoals(tournamentId: number): Promise<EventSchema[]> {
    return api.get<EventSchema[]>(`/tournaments/${tournamentId}/goals`);
  },

  async getYellowCards(tournamentId: number): Promise<EventSchema[]> {
    return api.get<EventSchema[]>(`/tournaments/${tournamentId}/yellow_cards`);
  },

  async getRedCards(tournamentId: number): Promise<EventSchema[]> {
    return api.get<EventSchema[]>(`/tournaments/${tournamentId}/red_cards`);
  },

  async getPlayers(tournamentId: number): Promise<Player[]> {
    return api.get<Player[]>(`/tournaments/${tournamentId}/players`);
  },

  async getPlayer(tournamentId: number, playerId: number): Promise<Player> {
    return api.get<Player>(`/tournaments/${tournamentId}/players/${playerId}`);
  },

  async getPlayerEvents(tournamentId: number, playerId: number): Promise<AllEventsSchema> {
    return api.get<AllEventsSchema>(`/tournaments/${tournamentId}/players/${playerId}/events`);
  },

  async getTeamEvents(tournamentId: number, teamId: number): Promise<AllEventsSchema> {
    return api.get<AllEventsSchema>(`/tournaments/${tournamentId}/teams/${teamId}/events`);
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

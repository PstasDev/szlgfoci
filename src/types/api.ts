// TypeScript interfaces for API responses based on OpenAPI schema

export interface Tournament {
  id?: number | null;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  registration_open?: boolean;
  registration_deadline?: string | null;
  registration_by_link?: string | null;
}

export interface Team {
  id?: number | null;
  start_year: number;
  tagozat: string;
  registration_time?: string | null;
  active?: boolean;
  tournament?: Tournament | null;
  players?: Player[];
  // Additional calculated fields for standings
  name?: string;
  className?: string;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  points?: number;
  position?: number;
}

export interface Player {
  id?: number | null;
  name: string;
  csk?: boolean; // captain
  // For display purposes
  teamName?: string;
  goals?: number;
  position?: number;
}

export interface Profile {
  id?: number | null;
  user: number;
  biro?: boolean; // referee
  player?: Player | null;
}

export interface ApiMatch {
  id?: number | null;
  datetime: string;
  team1?: Team | null;
  team2?: Team | null;
  tournament?: Tournament | null;
  round_obj?: Round | null;
  referee?: Profile | null;
  events?: EventSchema[];
}

export interface Match {
  id: number;
  tournament: number;
  team1: number;
  team2: number;
  team1_score: number | null;
  team2_score: number | null;
  date: string;
  venue: string;
  referee: number | null;
  round_obj: number;
  // For display purposes - guaranteed to be present after formatting
  homeTeam: string;
  awayTeam: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  time: string;
  round: string;
  status: 'upcoming' | 'live' | 'finished';
  events: MatchEvent[];
}

export interface EventSchema {
  id?: number | null;
  event_type: string;
  minute: number;
  exact_time?: string | null;
  extra_time?: number | null;
  player?: Player | null;
}

export interface MatchEvent {
  id: number;
  match: number;
  player: number;
  event_type: 'goal' | 'yellow_card' | 'red_card';
  minute: number;
  // For display purposes
  playerName?: string;
  team?: 'home' | 'away';
  type?: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
}

export interface Round {
  id?: number | null;
  number: number;
  tournament?: Tournament | null;
}

export interface StandingSchema {
  id: number;
  nev: string;
  meccsek: number;
  wins: number;
  ties: number;
  losses: number;
  lott: number;
  kapott: number;
  golarany: number;
  points: number;
}

export interface Standing {
  team_id: number;
  team_name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  position: number;
  // For compatibility with existing code
  id?: number;
  name?: string;
  className?: string;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
}

export interface TopScorerSchema {
  id: number;
  name: string;
  goals: number;
}

export interface TopScorer {
  player_id: number;
  player_name: string;
  team_name: string;
  goals: number;
  // For compatibility with existing code
  id?: number;
  name?: string;
  teamId?: number;
  teamName?: string;
  position?: number;
}

export interface AllEventsSchema {
  goals?: EventSchema[];
  yellow_cards?: EventSchema[];
  red_cards?: EventSchema[];
}

export interface AllEvents {
  goals: MatchEvent[];
  yellow_cards: MatchEvent[];
  red_cards: MatchEvent[];
}

// League season interface for frontend use
export interface LeagueSeason {
  id: string;
  name: string;
  displayName: string;
  active: boolean;
  startDate?: string;
  registrationOpen?: boolean;
  registrationLink?: string;
}

// Team roster interface (if needed for local display)
export interface TeamRoster {
  teamId: number;
  teamName: string;
  className: string;
  players: string[];
}

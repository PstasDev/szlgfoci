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
  color: string; // Team color from backend (e.g., "#5c6bc0")
  name?: string | null;
  logo_url?: string | null; // NEW: Logo URL support
  registration_time?: string | null;
  active?: boolean;
  tournament?: Tournament | null;
  players?: Player[];
  // Additional calculated fields for standings
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
  start_year?: number | null;
  tagozat?: string | null;
  // For display purposes
  teamName?: string;
  goals?: number;
  position?: number;
}

// NEW: Extended player schema with computed fields
export interface PlayerExtendedSchema {
  id: number;
  name: string;
  csk: boolean;
  start_year?: number | null;
  tagozat?: string | null;
  effective_start_year?: number | null; // From get_start_year()
  effective_tagozat?: string | null;     // From get_tagozat()
}

// NEW: Extended team schema with computed fields
export interface TeamExtendedSchema {
  id: number;
  name?: string | null;
  start_year: number;
  tagozat: string;
  color: string; // Always returns computed color from get_team_color()
  logo_url?: string | null;
  active: boolean;
  players: PlayerExtendedSchema[];
}

// NEW: Photo schemas for gallery support
export interface PhotoSchema {
  id?: number | null;
  url: string;
  title?: string | null;
  description?: string | null;
  uploaded_by?: Profile | null;
  uploaded_at?: string;
}

export interface PhotoCreateSchema {
  url: string;
  title?: string | null;
  description?: string | null;
}

export interface PhotoUpdateSchema {
  url?: string | null;
  title?: string | null;
  description?: string | null;
}

// NEW: Közlemény (announcement) schemas
export interface KozlemenySchema {
  id?: number | null;
  title: string;
  content: string;
  date_created?: string;
  date_updated?: string;
  active?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  author?: Profile | null;
}

export interface KozlemenyCreateSchema {
  title: string;
  content: string;
  active?: boolean;
  priority?: 'normal' | 'low' | 'high' | 'urgent';
}

export interface KozlemenyUpdateSchema {
  title?: string | null;
  content?: string | null;
  active?: boolean | null;
  priority?: string | null;
}

// NEW: Szankció (sanctions) schemas
export interface SzankcioSchema {
  id?: number | null;
  team?: Team | null;
  tournament?: Tournament | null;
  minus_points: number;
  reason?: string | null;
  date_created?: string;
  date_updated?: string;
}

export interface SzankcioCreateSchema {
  team_id: number;
  tournament_id: number;
  minus_points: number;
  reason?: string | null;
}

export interface SzankcioUpdateSchema {
  minus_points?: number | null;
  reason?: string | null;
}

export interface Profile {
  id?: number | null;
  user: number;
  biro?: boolean; // referee
  player?: Player | null;
  user_details?: User; // Populated user data
}

export interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string;
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
  photos?: PhotoSchema[]; // NEW: Photo gallery support
  status?: 'active' | 'cancelled_new_date' | 'cancelled_no_date' | null; // NEW: Match cancellation status
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
  // Team objects with full data including colors
  homeTeamObj?: Team | null;
  awayTeamObj?: Team | null;
  // Referee profile with full data
  refereeObj?: Profile | null;
  // Original datetime for more accurate sorting
  originalDateTime?: string;
  // NEW: Match cancellation status
  cancellationStatus?: 'active' | 'cancelled_new_date' | 'cancelled_no_date' | null;
}

export interface EventSchema {
  id?: number | null;
  event_type: string;
  minute: number;
  minute_extra_time?: number | null; // Extra time minutes (A in X+A format)
  formatted_time?: string; // Human-readable time format (e.g., "45+3'")
  exact_time?: string | null;
  extra_time?: number | null;
  player?: Player | null;
}

export interface MatchEvent {
  id: number;
  match: number;
  player: number;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'match_start' | 'half_time' | 'full_time' | 'match_end' | 'extra_time';
  minute: number;
  minute_extra_time?: number | null; // Support for extra time display (e.g., 3 for "45+3")
  formatted_time?: string; // Human-readable time format (e.g., "45+3'")
  // For display purposes
  playerName?: string;
  team?: 'home' | 'away';
  type?: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  // Additional timing fields for live timers (extended from EnhancedEventSchema)
  exact_time?: string | null;
  half?: number;
  extra_time?: number | null;
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

// Announcement interfaces
export interface Announcement {
  id: number;
  title: string;
  content: string;
  date_created: string;
  date_updated: string;
  active: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  author?: {
    id: number;
    user: number;
    biro?: boolean;
    player?: Player | null;
    user_details?: User; // Populated user data
  } | null;
}

// NEW: Live Match Status for real-time tracking
export interface LiveMatchStatus {
  match_id: number;
  status: 'not_started' | 'first_half' | 'half_time' | 'second_half' | 'extra_time' | 'finished' | 'postponed' | 'cancelled';
  current_minute: number;
  current_extra_time?: number; // NEW: Current extra time minutes (A in X+A format)
  extra_time_minutes: number; // DEPRECATED: Use current_extra_time instead
  formatted_time?: string; // NEW: Human-readable time format (e.g., "10+17'")
  last_updated: string;
  goals_team1: number;
  goals_team2: number;
  is_live: boolean;
  is_finished: boolean;
}

// NEW: Match status choice for UI selection
export interface MatchStatusChoice {
  value: 'active' | 'cancelled_new_date' | 'cancelled_no_date';
  label: string;
}

// NEW: Match status update request
export interface MatchStatusUpdateRequest {
  status: 'active' | 'cancelled_new_date' | 'cancelled_no_date';
  datetime?: string;
  referee_id?: number;
}

// NEW: Enhanced Live Match with real-time data
export interface LiveMatch extends Omit<Match, 'status'> {
  live_status: LiveMatchStatus;
  recent_events: MatchEvent[]; // Last 10 events
  is_featured: boolean;
  cache_priority: number;
  last_event_time?: string;
  display_time: string; // Formatted time like "45+2"
}

// NEW: Optimized Match with caching support
export interface OptimizedMatch extends Match {
  cache_metadata?: {
    last_updated: string;
    cache_version: number;
    is_valid: boolean;
    source: 'cache' | 'api' | 'live';
  };
  performance_data?: {
    load_time_ms: number;
    queries_count: number;
    cache_hit: boolean;
  };
  total_events: number;
  yellow_cards_count: number;
  red_cards_count: number;
}

// NEW: Bulk live matches response
export interface LiveMatchesBulk {
  matches: {
    match_id: number;
    team1_name: string;
    team2_name: string;
    status: LiveMatchStatus['status'];
    current_minute: number;
    goals_team1: number;
    goals_team2: number;
    recent_events: {
      id: number;
      type: string;
      minute: number;
      player?: string;
    }[];
  }[];
  total_live_matches: number;
  last_updated: string;
}

// NEW: Performance metrics
export interface MatchPerformance {
  match_id: number;
  total_api_calls: number;
  cache_hits: number;
  cache_misses: number;
  cache_hit_ratio: number;
  average_response_time_ms: number;
  last_24h_calls: number;
}

// NEW: Cache control interface
export interface CacheControl {
  key: string;
  ttl: number; // Time to live in seconds
  priority: 'low' | 'normal' | 'high' | 'critical';
  auto_refresh: boolean;
  last_refresh: string;
}

// NEW: Live match subscription data
export interface LiveMatchSubscription {
  match_id: number;
  user_id?: string;
  subscribed_at: string;
  notifications_enabled: boolean;
  event_types: ('goal' | 'card' | 'status_change')[];
}

// NEW: Match event with enhanced data
export interface EnhancedMatchEvent extends MatchEvent {
  timestamp: string;
  match_status: LiveMatchStatus['status'];
  team_name: string;
  formatted_time: string; // Required for enhanced events
  player_details?: {
    id: number;
    name: string;
    team_id: number;
    is_captain: boolean;
  };
  impact_score?: number; // 1-10 rating of event importance
}

// NEW: Real-time update payload
export interface LiveUpdatePayload {
  type: 'event' | 'status' | 'time' | 'score';
  match_id: number;
  timestamp: string;
  data: {
    event?: EnhancedMatchEvent;
    status?: LiveMatchStatus['status'];
    minute?: number;
    score?: {
      team1: number;
      team2: number;
    };
  };
}

// NEW: Enhanced API responses with caching
export interface CachedApiResponse<T> {
  data: T;
  meta: {
    cached: boolean;
    cache_key: string;
    expires_at: string;
    generated_at: string;
    version: number;
  };
  performance: {
    response_time_ms: number;
    db_queries: number;
    cache_operations: number;
  };
}

// NEW: Live matches dashboard data
export interface LiveMatchesDashboard {
  live_matches: LiveMatch[];
  featured_matches: OptimizedMatch[];
  recent_events: EnhancedMatchEvent[];
  standings_preview: Standing[];
  top_scorers_preview: TopScorer[];
  announcements: Announcement[];
  performance_summary: {
    total_matches_today: number;
    live_matches_count: number;
    total_events_today: number;
    cache_hit_rate: number;
  };
}

// NEW: Match filter and sort options
export interface MatchFilters {
  status?: ('upcoming' | 'live' | 'finished')[];
  teams?: number[];
  rounds?: number[];
  date_from?: string;
  date_to?: string;
  has_events?: boolean;
  is_featured?: boolean;
}

export interface MatchSortOptions {
  field: 'datetime' | 'status' | 'round' | 'cache_priority';
  direction: 'asc' | 'desc';
}

// NEW: Team creation and update schemas
export interface TeamCreateSchema {
  name?: string | null;
  start_year: number;
  tagozat: string;
  color?: string | null;
  logo_url?: string | null;
  active?: boolean;
}

export interface TeamUpdateSchema {
  name?: string | null;
  start_year?: number | null;
  tagozat?: string | null;
  color?: string | null;
  logo_url?: string | null;
  active?: boolean | null;
}

// NEW: Time synchronization for accurate match timing
export interface TimeSyncSchema {
  server_time: string; // ISO string
  timezone: string;
  timestamp: number; // Unix timestamp
}

// NEW: Time synchronization for accurate match timing
export interface TimeSyncSchema {
  server_time: string; // ISO string
  timezone: string;
  timestamp: number; // Unix timestamp
}

// NEW: Enhanced event with all supported types
export interface EnhancedEventSchema {
  id: number;
  player?: Player | null;
  match?: number | null;
  event_type: 'match_start' | 'goal' | 'yellow_card' | 'red_card' | 'half_time' | 'full_time' | 'extra_time' | 'match_end';
  half: number;
  minute: number;
  minute_extra_time?: number | null;
  formatted_time?: string; // Human-readable time format (e.g., "45+3'")
  exact_time?: string | null;
  extra_time?: number | null;
}

// NEW: Match timing information
export interface MatchTiming {
  current_minute: number;
  current_extra_time?: number; // NEW: Current extra time minutes (A in X+A format)
  current_half: number;
  status: 'not_started' | 'first_half' | 'half_time' | 'second_half' | 'extra_time' | 'finished';
  extra_time_minutes?: number; // DEPRECATED: Use current_extra_time instead
  formatted_time?: string; // NEW: Human-readable time format (e.g., "45+3'")
  is_live: boolean;
  last_event_time?: string;
}

// Optimized query parameters
export interface OptimizedQueryParams {
  include_cache?: boolean;
  include_performance?: boolean;
  prefetch_events?: boolean;
  live_only?: boolean;
  featured_only?: boolean;
  limit?: number;
  offset?: number;
  fields?: string[]; // Specific fields to return
}

// NEW: Referee quick event request types
export interface QuickGoalRequest {
  player_id: number;
  minute: number;
  minute_extra_time?: number | null; // Optional extra time support
  half: number;
}

export interface QuickCardRequest {
  player_id: number;
  minute: number;
  minute_extra_time?: number | null; // Optional extra time support
  card_type: 'yellow' | 'red';
  half: number;
}

export interface GeneralEventRequest {
  event_type: string;
  minute: number;
  minute_extra_time?: number | null; // Optional extra time support
  half: number;
  player_id?: number | null;
}

// NEW: Enhanced API response types for quick events
export interface QuickGoalResponse {
  message: string;
  event_id: number;
  player_name: string;
  minute: number;
  minute_extra_time?: number | null;
  formatted_time: string; // "45+3'" or "67'"
  new_score: [number, number]; // [home_score, away_score]
}

export interface QuickCardResponse {
  message: string;
  event_id: number;
  player_name: string;
  minute: number;
  minute_extra_time?: number | null;
  formatted_time: string; // "88+1'" or "23'"
  card_type: 'yellow' | 'red';
}

export interface GeneralEventResponse {
  message: string;
  event_id: number;
  event_type: string;
  minute: number;
  minute_extra_time?: number | null;
  formatted_time: string;
  player_name?: string;
}

// NEW: Match record (jegyzőkönyv) response with formatted times
export interface MatchRecordResponse {
  match_id: number;
  events: (EventSchema & { formatted_time: string })[];
  match_details: {
    datetime: string;
    team1: Team;
    team2: Team;
    referee?: Profile;
    status: string;
  };
  scores: {
    home: number;
    away: number;
  };
}

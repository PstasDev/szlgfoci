// Utility functions for data processing and formatting
import type { Team, Standing, ApiMatch, Match, TopScorer, LeagueSeason, MatchEvent, StandingSchema, TopScorerSchema } from '@/types/api';

// Re-export types for convenience
export type { Match, MatchEvent, Team, Standing, TopScorer, LeagueSeason } from '@/types/api';

// Class color coding system - optimized for dark mode with better contrast
export const getClassColor = (className: string): string => {
  const classLetter = className?.split(' ')[1] || className?.charAt(className.length - 1); // Gets the letter part (A, B, C, etc.)
  
  switch (classLetter) {
    case 'A': return '#66bb6a'; // Brighter green for better contrast
    case 'B': return '#ffca28'; // Brighter yellow for better contrast
    case 'C': return '#ba68c8'; // Brighter purple for better contrast
    case 'D': return '#ef5350'; // Brighter red for better contrast
    case 'E': return '#bdbdbd'; // Lighter gray for better contrast
    case 'F': return '#5c6bc0'; // Brighter navy blue for better contrast
    default: return '#42a5f5'; // Brighter default blue
  }
};

export const getClassColorLight = (className: string): string => {
  const classLetter = className?.split(' ')[1] || className?.charAt(className.length - 1);
  
  // Return darker variants for light backgrounds/accents in dark mode
  switch (classLetter) {
    case 'A': return 'rgba(102, 187, 106, 0.15)'; // Semi-transparent green
    case 'B': return 'rgba(255, 202, 40, 0.15)'; // Semi-transparent yellow
    case 'C': return 'rgba(186, 104, 200, 0.15)'; // Semi-transparent purple
    case 'D': return 'rgba(239, 83, 80, 0.15)'; // Semi-transparent red
    case 'E': return 'rgba(189, 189, 189, 0.15)'; // Semi-transparent gray
    case 'F': return 'rgba(92, 107, 192, 0.15)'; // Semi-transparent navy
    default: return 'rgba(66, 165, 245, 0.15)'; // Semi-transparent blue
  }
};

// Convert OpenAPI StandingSchema to display Standing format
export const convertStandingSchemaToStanding = (standingSchema: StandingSchema): Standing => {
  return {
    team_id: standingSchema.id,
    team_name: standingSchema.nev,
    played: standingSchema.meccsek,
    won: standingSchema.wins,
    drawn: standingSchema.ties,
    lost: standingSchema.losses,
    goals_for: standingSchema.lott,
    goals_against: standingSchema.kapott,
    goal_difference: standingSchema.golarany,
    points: standingSchema.points,
    position: 1, // Will be calculated later
    // For compatibility with existing code
    id: standingSchema.id,
    name: standingSchema.nev,
    className: standingSchema.nev,
    goalsFor: standingSchema.lott,
    goalsAgainst: standingSchema.kapott,
    goalDifference: standingSchema.golarany,
  };
};

// Convert OpenAPI TopScorerSchema to display TopScorer format
export const convertTopScorerSchemaToTopScorer = (topScorerSchema: TopScorerSchema, teamName: string = ''): TopScorer => {
  return {
    player_id: topScorerSchema.id,
    player_name: topScorerSchema.name,
    team_name: teamName,
    goals: topScorerSchema.goals,
    // For compatibility with existing code
    id: topScorerSchema.id,
    name: topScorerSchema.name,
    teamId: topScorerSchema.id, // Placeholder
    teamName: teamName,
    position: 1 // Will be calculated later
  };
};

// Convert API TopScorer to Player format for compatibility
export const convertTopScorerToPlayer = (topScorer: TopScorer, index: number): any => {
  return {
    id: topScorer.player_id,
    name: topScorer.player_name,
    teamId: topScorer.player_id, // Placeholder
    teamName: topScorer.team_name,
    goals: topScorer.goals,
    position: index + 1
  };
};

// Format match data for display from OpenAPI schema
export const formatMatch = (match: ApiMatch, teams: Team[] = []): Match => {
  const homeTeam = match.team1 ? (teams.find(t => t.id === match.team1?.id) || match.team1) : null;
  const awayTeam = match.team2 ? (teams.find(t => t.id === match.team2?.id) || match.team2) : null;
  
  return {
    id: match.id || 0,
    tournament: match.tournament?.id || 1,
    team1: match.team1?.id || 0,
    team2: match.team2?.id || 0,
    team1_score: null,
    team2_score: null,
    date: match.datetime,
    venue: 'SZLG Sportpálya',
    referee: match.referee?.id || null,
    round_obj: match.round_obj?.number || 1,
    homeTeam: homeTeam?.tagozat || homeTeam?.name || `Team ${match.team1?.id || 0}`,
    awayTeam: awayTeam?.tagozat || awayTeam?.name || `Team ${match.team2?.id || 0}`,
    homeTeamId: match.team1?.id || 0,
    awayTeamId: match.team2?.id || 0,
    homeScore: null,
    awayScore: null,
    status: getMatchStatus(match),
    time: formatTime(match.datetime) || '00:00',
    round: `${match.round_obj?.number || 1}. forduló`,
    events: []
  };
};

// Determine match status based on datetime
export const getMatchStatus = (match: ApiMatch): 'upcoming' | 'live' | 'finished' => {
  const matchDate = new Date(match.datetime);
  const now = new Date();
  const hoursDiff = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursDiff < -2) {
    return 'finished';
  } else if (hoursDiff < 2) {
    return 'live';
  } else {
    return 'upcoming';
  }
};

// Format time from datetime string
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('hu-HU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return '00:00';
  }
};

// Format date from date string
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  } catch {
    return dateString;
  }
};

// Filter matches by status - now using pre-determined status
export const getLiveMatches = (matches: Match[]): Match[] => {
  return matches.filter(match => match.status === 'live');
};

export const getUpcomingMatches = (matches: Match[], limit: number = 5): Match[] => {
  return matches
    .filter(match => match.status === 'upcoming')
    .slice(0, limit);
};

export const getRecentMatches = (matches: Match[], limit: number = 5): Match[] => {
  return matches
    .filter(match => match.status === 'finished')
    .slice(0, limit);
};

export const getMatchesByTeam = (matches: Match[], teamId: number): Match[] => {
  return matches.filter(match => 
    match.team1 === teamId || match.team2 === teamId
  );
};

// Helper function to get team by ID from standings
export const getTeamById = (standings: Standing[], id: number): Standing | undefined => {
  return standings.find(standing => standing.team_id === id);
};

// Helper function to get team by name from standings
export const getTeamByName = (standings: Standing[], name: string): Standing | undefined => {
  return standings.find(standing => standing.team_name === name);
};

// Convert match events for display
export const formatMatchEvent = (event: MatchEvent): any => {
  return {
    id: event.id,
    type: event.event_type,
    minute: event.minute,
    player: event.playerName || `Player ${event.player}`,
    team: event.team || 'home' // Default to home team
  };
};

// Default tournament ID - should be configurable
export const DEFAULT_TOURNAMENT_ID = 1;

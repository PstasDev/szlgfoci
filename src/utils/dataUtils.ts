// Utility functions for data processing and formatting
import type { Team, Standing, ApiMatch, Match, TopScorer, MatchEvent, StandingSchema, TopScorerSchema, Tournament, Player } from '@/types/api';

// Re-export types for convenience
export type { Match, MatchEvent, Team, Standing, TopScorer, Tournament } from '@/types/api';

// Get team color from the team object (backend provides the color)
export const getTeamColor = (team: Team | null | undefined): string => {
  if (team?.color) {
    return team.color;
  }
  // Fallback color if team or color is not available
  return '#42a5f5'; // Default blue
};

// Get team color with transparency for backgrounds
export const getTeamColorLight = (team: Team | null | undefined): string => {
  if (team?.color) {
    // Extract RGB from hex color and add transparency
    const hex = team.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }
  // Fallback color with transparency
  return 'rgba(66, 165, 245, 0.15)'; // Default blue with transparency
};

// DEPRECATED: Class color coding system - use getTeamColor instead
// These functions are kept for backward compatibility but should not be used
export const getClassColor = (className: string): string => {
  console.warn('getClassColor is deprecated. Use getTeamColor with team object instead.');
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
  console.warn('getClassColorLight is deprecated. Use getTeamColorLight with team object instead.');
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
export const convertTopScorerToPlayer = (topScorer: TopScorer, index: number): Player => {
  return {
    id: topScorer.player_id,
    name: topScorer.player_name,
    teamName: topScorer.team_name,
    goals: topScorer.goals,
    position: index + 1
  };
};

// Format match data for display from OpenAPI schema
export const formatMatch = (match: ApiMatch, teams: Team[] = []): Match => {
  const homeTeam = match.team1 ? (teams.find(t => t.id === match.team1?.id) || match.team1) : null;
  const awayTeam = match.team2 ? (teams.find(t => t.id === match.team2?.id) || match.team2) : null;

  // Calculate scores from events if available
  const events = match.events || [];
  const goalEvents = events.filter(event => event.event_type === 'goal');
  
  // Calculate scores based on goals
  let homeScore = null;
  let awayScore = null;
  
  if (goalEvents.length > 0) {
    // Count goals for each team
    const homeGoals = goalEvents.filter(goal => {
      // Check if the goal player belongs to home team
      if (homeTeam?.players && goal.player) {
        return homeTeam.players.some(player => player.id === goal.player?.id);
      }
      return false;
    }).length;
    
    const awayGoals = goalEvents.filter(goal => {
      // Check if the goal player belongs to away team
      if (awayTeam?.players && goal.player) {
        return awayTeam.players.some(player => player.id === goal.player?.id);
      }
      return false;
    }).length;
    
    homeScore = homeGoals;
    awayScore = awayGoals;
  }

  // Format events for display (preserve exact_time for live timers)
  const formattedEvents: MatchEvent[] = events.map(event => ({
    id: event.id || Math.random(),
    match: match.id || 0,
    player: event.player?.id || 0,
    event_type: event.event_type as 'goal' | 'yellow_card' | 'red_card' | 'match_start' | 'half_time' | 'full_time' | 'match_end' | 'extra_time',
    minute: event.minute,
    minute_extra_time: event.minute_extra_time || null, // Preserve minute_extra_time from API
    playerName: event.player?.name || 'Unknown Player',
    team: event.player && homeTeam?.players?.some(p => p.id === event.player?.id) ? 'home' as const : 'away' as const,
    type: event.event_type as 'goal' | 'yellow_card' | 'red_card' | 'substitution',
    // Preserve timing data for live timers
    exact_time: (event as any).exact_time || null,
    half: (event as any).half || 1,
    extra_time: (event as any).extra_time || null
  } as any));
  
  return {
    id: match.id || 0,
    tournament: match.tournament?.id || 1,
    team1: match.team1?.id || 0,
    team2: match.team2?.id || 0,
    team1_score: homeScore,
    team2_score: awayScore,
    date: formatDate(match.datetime),
    venue: 'SZLG Sportpálya',
    referee: match.referee?.id || null,
    round_obj: match.round_obj?.number || 1,
    homeTeam: getTeamDisplayName(homeTeam),
    awayTeam: getTeamDisplayName(awayTeam),
    homeTeamId: match.team1?.id || 0,
    awayTeamId: match.team2?.id || 0,
    homeScore: homeScore,
    awayScore: awayScore,
    status: getMatchStatus(match),
    time: formatTime(match.datetime) || '00:00',
    round: `${match.round_obj?.number || 1}. forduló`,
    events: formattedEvents,
    // Include full team objects for accessing colors and other data
    homeTeamObj: homeTeam,
    awayTeamObj: awayTeam,
    // Include full referee profile
    refereeObj: match.referee
  };
};

// Determine match status based on datetime and events
export const getMatchStatus = (match: ApiMatch): 'upcoming' | 'live' | 'finished' => {
  // First check for events that indicate match status
  const events = match.events || [];
  
  // If there's a full_time or match_end event, the match is finished
  const hasFullTimeEvent = events.some(e => e.event_type === 'full_time');
  const hasMatchEndEvent = events.some(e => e.event_type === 'match_end');
  
  if (hasFullTimeEvent || hasMatchEndEvent) {
    return 'finished';
  }
  
  // If there's a match_start event, the match has started
  const hasMatchStartEvent = events.some(e => e.event_type === 'match_start');
  
  // Fallback to datetime-based logic
  const matchDate = new Date(match.datetime);
  const now = new Date();
  const hoursDiff = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hasMatchStartEvent && hoursDiff < 2) {
    // Match has started and is within reasonable time window
    return 'live';
  } else if (hoursDiff < -2) {
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
    .sort((a, b) => {
      // Create datetime strings for comparison
      const dateTimeA = `${a.date}T${a.time}`;
      const dateTimeB = `${b.date}T${b.time}`;
      return new Date(dateTimeA).getTime() - new Date(dateTimeB).getTime();
    })
    .slice(0, limit);
};

export const getUpcomingMatchesForHomepage = (matches: Match[]): { matches: Match[], hasMore: boolean } => {
  const sortedUpcoming = matches
    .filter(match => match.status === 'upcoming')
    .sort((a, b) => {
      // Create datetime strings for comparison
      const dateTimeA = `${a.date}T${a.time}`;
      const dateTimeB = `${b.date}T${b.time}`;
      return new Date(dateTimeA).getTime() - new Date(dateTimeB).getTime();
    });
  
  return {
    matches: sortedUpcoming.slice(0, 3),
    hasMore: sortedUpcoming.length > 3
  };
};

export const getRecentMatches = (matches: Match[], limit: number = 5): Match[] => {
  return matches
    .filter(match => match.status === 'finished')
    .sort((a, b) => {
      // Create datetime strings for comparison
      const dateTimeA = `${a.date}T${a.time}`;
      const dateTimeB = `${b.date}T${b.time}`;
      // Sort by most recent first (descending order)
      return new Date(dateTimeB).getTime() - new Date(dateTimeA).getTime();
    })
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
export const formatMatchEvent = (event: MatchEvent): MatchEvent => {
  return {
    id: event.id,
    match: event.match,
    player: event.player,
    event_type: event.event_type,
    minute: event.minute,
    playerName: event.playerName || `Player ${event.player}`,
    team: event.team || 'home' // Default to home team
  };
};

// Convert Standing to Team format for compatibility with Google Sports layout
export const convertStandingToTeam = (standing: Standing, index: number): Team => {
  return {
    id: standing.team_id,
    start_year: new Date().getFullYear(), // Default to current year
    tagozat: standing.team_name,
    color: '#42a5f5', // Default color, should be provided by backend
    name: standing.team_name,
    className: standing.team_name,
    position: index + 1,
    played: standing.played,
    won: standing.won,
    drawn: standing.drawn,
    lost: standing.lost,
    goalsFor: standing.goals_for,
    goalsAgainst: standing.goals_against,
    goalDifference: standing.goal_difference,
    points: standing.points
  };
};

// Smart tournament selection logic
export const selectMostRelevantTournament = (tournaments: Tournament[]): Tournament | null => {
  if (!tournaments || tournaments.length === 0) {
    console.log('⚠️ No tournaments available');
    return null;
  }

  const now = new Date();
  console.log(`🎯 Selecting most relevant tournament from ${tournaments.length} tournaments`);
  console.log(`🎯 Available tournaments:`, tournaments.map(t => ({ id: t.id, name: t.name, start_date: t.start_date, end_date: t.end_date })));
  
  // 1. First priority: Currently active tournaments (started but not ended)
  const activeTournaments = tournaments.filter(tournament => {
    const hasStarted = hasTournamentStarted(tournament);
    const hasEnded = tournament.end_date ? now > new Date(tournament.end_date) : false;
    const isActive = hasStarted && !hasEnded;
    console.log(`🔍 Tournament ${tournament.name} (ID: ${tournament.id}): started=${hasStarted}, ended=${hasEnded}, active=${isActive}`);
    return isActive;
  });
  
  if (activeTournaments.length > 0) {
    // Sort by start date, most recent first
    const sorted = activeTournaments.sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
      const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    console.log(`✅ Found ${activeTournaments.length} active tournament(s), selecting: ${sorted[0].name} (ID: ${sorted[0].id})`);
    return sorted[0];
  }

  // 2. Second priority: Upcoming tournaments (not yet started)
  const upcomingTournaments = tournaments.filter(tournament => {
    const hasStarted = hasTournamentStarted(tournament);
    console.log(`🔍 Tournament ${tournament.name} (ID: ${tournament.id}): upcoming=${!hasStarted}`);
    return !hasStarted;
  });
  
  if (upcomingTournaments.length > 0) {
    // Sort by start date, nearest first
    const sorted = upcomingTournaments.sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date) : new Date(9999, 11, 31);
      const dateB = b.start_date ? new Date(b.start_date) : new Date(9999, 11, 31);
      return dateA.getTime() - dateB.getTime();
    });
    console.log(`✅ Found ${upcomingTournaments.length} upcoming tournament(s), selecting: ${sorted[0].name} (ID: ${sorted[0].id})`);
    return sorted[0];
  }

  // 3. Last priority: Recently ended tournaments
  const endedTournaments = tournaments.filter(tournament => {
    const hasStarted = hasTournamentStarted(tournament);
    const hasEnded = tournament.end_date ? now > new Date(tournament.end_date) : false;
    const isEnded = hasStarted && hasEnded;
    console.log(`🔍 Tournament ${tournament.name} (ID: ${tournament.id}): ended=${isEnded}`);
    return isEnded;
  });

  if (endedTournaments.length > 0) {
    // Sort by end date, most recent first
    const sorted = endedTournaments.sort((a, b) => {
      const dateA = a.end_date ? new Date(a.end_date) : new Date(0);
      const dateB = b.end_date ? new Date(b.end_date) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    console.log(`✅ Found ${endedTournaments.length} ended tournament(s), selecting most recent: ${sorted[0].name} (ID: ${sorted[0].id})`);
    return sorted[0];
  }

  // 4. Fallback: Just pick the first tournament
  console.log(`⚠️ No tournaments match criteria, falling back to first tournament: ${tournaments[0].name} (ID: ${tournaments[0].id})`);
  return tournaments[0];
};

// Default tournament ID is no longer used since we work with the current tournament
// Keeping for backward compatibility but no longer needed
export const DEFAULT_TOURNAMENT_ID = 1; // Deprecated - use getCurrentTournament() instead

// Check if tournament has started
export const hasTournamentStarted = (tournament: Tournament): boolean => {
  if (!tournament?.start_date) {
    console.log(`⚠️ No start_date found in tournament`);
    return false;
  }
  
  const startDate = new Date(tournament.start_date);
  const now = new Date();
  
  console.log(`📅 Tournament start date: ${tournament.start_date} (parsed: ${startDate.toISOString()})`);
  console.log(`📅 Current date: ${now.toISOString()}`);
  console.log(`📅 Now >= Start: ${now >= startDate}`);
  
  return now >= startDate;
};

// Get the display name for a team (custom name or generated from start_year + tagozat)
export const getTeamDisplayName = (team: Team | null): string => {
  if (!team) return 'Unknown Team';
  
  // Priority: custom name > generated name from start_year+tagozat > tagozat only > fallback
  if (team.name && team.name.trim() !== '') {
    return team.name;
  }
  
  // Generate name from start_year and tagozat if available
  if (team.start_year && team.tagozat) {
    return `${team.start_year}${team.tagozat}`;
  }
  
  // Fallback to just tagozat
  if (team.tagozat) {
    return team.tagozat;
  }
  
  // Last resort fallback
  return `Team ${team.id || 'Unknown'}`;
};

// Get the class identifier for a team (used for colors and identification)
export const getTeamClassName = (team: Team): string => {
  // Use tagozat as the class identifier for styling
  return team.tagozat;
};

// NEW: Get tagozat letter from team for display
export const getTeamTagozatLetter = (team: Team | Standing | { tagozat: string } | string): string => {
  // Handle string input (team name)
  if (typeof team === 'string') {
    const match = team.match(/([A-Z])$/);
    if (match) {
      return match[1];
    }
    return team.charAt(0).toUpperCase();
  }
  
  // For teams with direct tagozat field
  if ('tagozat' in team && team.tagozat) {
    return team.tagozat.toUpperCase();
  }
  
  // For standings data that might have team_name containing tagozat
  if ('team_name' in team && team.team_name) {
    // Extract the letter part (like "A" from "2025A" or just "A")
    const match = team.team_name.match(/([A-Z])$/);
    if (match) {
      return match[1];
    }
  }
  
  // Fallback for existing data structure
  if ('className' in team && team.className) {
    const match = team.className.match(/([A-Z])$/);
    if (match) {
      return match[1];
    }
  }
  
  return '?';
};

// NEW: Get theme color for team based on tagozat
export const getTagozatColor = (tagozatLetter: string): string => {
  switch (tagozatLetter.toUpperCase()) {
    case 'A': return '#66bb6a'; // Green
    case 'B': return '#ffca28'; // Yellow/Gold
    case 'C': return '#ba68c8'; // Purple
    case 'D': return '#ef5350'; // Red
    case 'E': return '#bdbdbd'; // Gray
    case 'F': return '#5c6bc0'; // Navy blue
    case 'G': return '#ff7043'; // Orange
    case 'H': return '#26c6da'; // Cyan
    default: return '#42a5f5'; // Default blue
  }
};

// Get tournament status message
export const getTournamentStatusMessage = (tournament: Tournament | null): string => {
  if (!tournament) return 'Nincs aktív torna';
  
  if (!hasTournamentStarted(tournament)) {
    return 'A torna még nem kezdődött el';
  }
  
  return 'A torna folyamatban van';
};

// Format referee name in "Vezetéknév Keresztnév" format
export const formatRefereeName = (referee: any): string => {
  if (!referee) return '';
  
  // Check if we have separate first_name and last_name fields
  if (referee.last_name && referee.first_name) {
    return `${referee.last_name} ${referee.first_name}`;
  }
  
  // Fallback to full_name if available
  if (referee.full_name) {
    return referee.full_name;
  }
  
  // Fallback to username or email if no proper name
  if (referee.username) {
    return referee.username;
  }
  
  if (referee.email) {
    return referee.email;
  }
  
  return `Bíró #${referee.id || 'Unknown'}`;
};

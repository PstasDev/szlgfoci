// SZLG Liga 24/25 Teams and Data
export interface Team {
  id: number;
  name: string;
  className: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

export interface Player {
  id: number;
  name: string;
  teamId: number;
  teamName: string;
  goals: number;
  position: number;
}

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  venue: string;
  round: string;
  status: 'upcoming' | 'live' | 'finished';
  events: MatchEvent[];
}

export interface MatchEvent {
  id: number;
  type: 'goal' | 'yellow_card' | 'red_card';
  minute: number;
  player: string;
  team: 'home' | 'away';
}

// SZLG Liga 24/25 League Table
export const teams: Team[] = [
  { id: 1, name: '24 C', className: '24 C', played: 16, won: 12, drawn: 4, lost: 0, goalsFor: 52, goalsAgainst: 9, goalDifference: 43, points: 40, position: 1 },
  { id: 2, name: '22 F', className: '22 F', played: 16, won: 11, drawn: 4, lost: 1, goalsFor: 63, goalsAgainst: 10, goalDifference: 53, points: 37, position: 2 },
  { id: 3, name: '21 F', className: '21 F', played: 16, won: 11, drawn: 3, lost: 2, goalsFor: 65, goalsAgainst: 10, goalDifference: 55, points: 36, position: 3 },
  { id: 4, name: '20 A', className: '20 A', played: 16, won: 10, drawn: 5, lost: 1, goalsFor: 44, goalsAgainst: 10, goalDifference: 34, points: 35, position: 4 },
  { id: 5, name: '21 C', className: '21 C', played: 16, won: 10, drawn: 4, lost: 2, goalsFor: 45, goalsAgainst: 16, goalDifference: 29, points: 34, position: 5 },
  { id: 6, name: '22 B', className: '22 B', played: 15, won: 9, drawn: 0, lost: 6, goalsFor: 47, goalsAgainst: 31, goalDifference: 16, points: 27, position: 6 },
  { id: 7, name: '21 A', className: '21 A', played: 16, won: 8, drawn: 3, lost: 5, goalsFor: 41, goalsAgainst: 29, goalDifference: 12, points: 27, position: 7 },
  { id: 8, name: '21 B', className: '21 B', played: 15, won: 7, drawn: 2, lost: 6, goalsFor: 26, goalsAgainst: 30, goalDifference: -4, points: 23, position: 8 },
  { id: 9, name: '20 F', className: '20 F', played: 16, won: 6, drawn: 1, lost: 9, goalsFor: 24, goalsAgainst: 45, goalDifference: -21, points: 19, position: 9 },
  { id: 10, name: '23 B', className: '23 B', played: 15, won: 5, drawn: 3, lost: 7, goalsFor: 31, goalsAgainst: 30, goalDifference: 1, points: 18, position: 10 },
  { id: 11, name: '21 E', className: '21 E', played: 15, won: 6, drawn: 0, lost: 9, goalsFor: 18, goalsAgainst: 22, goalDifference: -4, points: 18, position: 11 },
  { id: 12, name: '23 F', className: '23 F', played: 14, won: 5, drawn: 1, lost: 8, goalsFor: 28, goalsAgainst: 30, goalDifference: -2, points: 16, position: 12 },
  { id: 13, name: '22 E', className: '22 E', played: 15, won: 5, drawn: 1, lost: 9, goalsFor: 26, goalsAgainst: 31, goalDifference: -5, points: 16, position: 13 },
  { id: 14, name: '24 A', className: '24 A', played: 16, won: 4, drawn: 3, lost: 9, goalsFor: 17, goalsAgainst: 35, goalDifference: -18, points: 15, position: 14 },
  { id: 15, name: '24 D', className: '24 D', played: 14, won: 2, drawn: 2, lost: 10, goalsFor: 28, goalsAgainst: 53, goalDifference: -25, points: 8, position: 15 },
  { id: 16, name: '24 B', className: '24 B', played: 16, won: 1, drawn: 2, lost: 13, goalsFor: 19, goalsAgainst: 59, goalDifference: -40, points: 5, position: 16 },
  { id: 17, name: '24 F', className: '24 F', played: 15, won: 0, drawn: 0, lost: 15, goalsFor: 6, goalsAgainst: 130, goalDifference: -124, points: 0, position: 17 },
];

// SZLG Liga 24/25 Top Scorers
export const topScorers: Player[] = [
  { id: 1, name: 'Nagy Gergely', teamId: 3, teamName: '21 F', goals: 33, position: 1 },
  { id: 2, name: 'Vincze Dániel', teamId: 2, teamName: '22 F', goals: 30, position: 2 },
  { id: 3, name: 'Szabó Marcell Dénes', teamId: 7, teamName: '21 A', goals: 21, position: 3 },
  { id: 4, name: 'Fürész Mátyás', teamId: 15, teamName: '24 D', goals: 20, position: 4 },
  { id: 5, name: 'Szabadi Zalán', teamId: 1, teamName: '24 C', goals: 19, position: 5 },
  { id: 6, name: 'Varga Márk', teamId: 4, teamName: '20 A', goals: 16, position: 6 },
  { id: 7, name: 'Nguyen Nhat Duy', teamId: 5, teamName: '21 C', goals: 16, position: 6 },
  { id: 8, name: 'Kálmán Roland', teamId: 1, teamName: '24 C', goals: 15, position: 8 },
  { id: 9, name: 'Minkó Marcell Levente', teamId: 2, teamName: '22 F', goals: 15, position: 8 },
  { id: 10, name: 'Pelle Péter', teamId: 10, teamName: '23 B', goals: 15, position: 8 },
  { id: 11, name: 'Viniczei Viktor', teamId: 3, teamName: '21 F', goals: 13, position: 11 },
  { id: 12, name: 'Kátai Kornél', teamId: 12, teamName: '23 F', goals: 12, position: 12 },
  { id: 13, name: 'Garabics Dániel', teamId: 5, teamName: '21 C', goals: 12, position: 12 },
  { id: 14, name: 'Almási Attila István', teamId: 6, teamName: '22 B', goals: 11, position: 14 },
  { id: 15, name: 'Wootsch Gábor Tamás', teamId: 4, teamName: '20 A', goals: 10, position: 15 },
];

// Recent matches from SZLG Liga 24/25
export const matches: Match[] = [
  {
    id: 1,
    homeTeam: '24 C',
    awayTeam: '21 F',
    homeTeamId: 1,
    awayTeamId: 3,
    homeScore: 2,
    awayScore: 0,
    date: '2025.06.19',
    time: '14:00',
    venue: 'SZLG Sportpálya',
    round: '16. forduló',
    status: 'finished',
    events: []
  },
  {
    id: 2,
    homeTeam: '24 D',
    awayTeam: '21 F',
    homeTeamId: 15,
    awayTeamId: 3,
    homeScore: 1,
    awayScore: 6,
    date: '2025.06.17',
    time: '15:30',
    venue: 'SZLG Sportpálya',
    round: '14. forduló',
    status: 'finished',
    events: []
  },
  {
    id: 3,
    homeTeam: '24 B',
    awayTeam: '21 F',
    homeTeamId: 16,
    awayTeamId: 3,
    homeScore: 1,
    awayScore: 7,
    date: '2025.06.17',
    time: '13:00',
    venue: 'SZLG Sportpálya',
    round: '16. forduló',
    status: 'finished',
    events: []
  },
  {
    id: 4,
    homeTeam: '22 F',
    awayTeam: '20 A',
    homeTeamId: 2,
    awayTeamId: 4,
    homeScore: null,
    awayScore: null,
    date: '2025.09.15',
    time: '14:00',
    venue: 'SZLG Sportpálya',
    round: '17. forduló',
    status: 'upcoming',
    events: []
  },
  {
    id: 5,
    homeTeam: '21 C',
    awayTeam: '23 B',
    homeTeamId: 5,
    awayTeamId: 10,
    homeScore: 2,
    awayScore: 1,
    date: 'LIVE',
    time: '78\'',
    venue: 'SZLG Sportpálya',
    round: '17. forduló',
    status: 'live',
    events: [
      { id: 1, type: 'goal', minute: 23, player: 'Nguyen Nhat Duy', team: 'home' },
      { id: 2, type: 'yellow_card', minute: 34, player: 'Pelle Péter', team: 'away' },
      { id: 3, type: 'goal', minute: 56, player: 'Fias Máté', team: 'away' },
      { id: 4, type: 'goal', minute: 67, player: 'Garabics Dániel', team: 'home' },
    ]
  },
];

export const getTeamById = (id: number): Team | undefined => {
  return teams.find(team => team.id === id);
};

export const getTeamByName = (name: string): Team | undefined => {
  return teams.find(team => team.name === name);
};

export const getLiveMatches = (): Match[] => {
  return matches.filter(match => match.status === 'live');
};

export const getUpcomingMatches = (limit: number = 5): Match[] => {
  return matches
    .filter(match => match.status === 'upcoming')
    .slice(0, limit);
};

export const getRecentMatches = (limit: number = 5): Match[] => {
  return matches
    .filter(match => match.status === 'finished')
    .slice(0, limit);
};

export const getMatchesByTeam = (teamId: number): Match[] => {
  return matches.filter(match => 
    match.homeTeamId === teamId || match.awayTeamId === teamId
  );
};

export const getTopScorers = (limit: number = 15): Player[] => {
  return topScorers.slice(0, limit);
};

export const getLeagueTable = (): Team[] => {
  return teams.sort((a, b) => a.position - b.position);
};

// League seasons available
export interface LeagueSeason {
  id: string;
  name: string;
  displayName: string;
  active: boolean;
  startDate?: string;
  registrationOpen?: boolean;
  registrationLink?: string;
}

export const leagueSeasons: LeagueSeason[] = [
  { 
    id: '2024-25', 
    name: 'SZLG Liga 24/25', 
    displayName: 'SZLG Liga 24/25', 
    active: true 
  },
  { 
    id: '2025-26', 
    name: 'SZLG Liga 25/26', 
    displayName: 'SZLG Liga 25/26 - Kezdés: 2025. október 15.', 
    active: false,
    startDate: '2025-10-15',
    registrationOpen: true,
    registrationLink: '#'
  },
];

// Class color coding system
export const getClassColor = (className: string): string => {
  const classLetter = className.split(' ')[1]; // Gets the letter part (A, B, C, etc.)
  
  switch (classLetter) {
    case 'A': return '#4caf50'; // Green
    case 'B': return '#ffc107'; // Yellow
    case 'C': return '#9c27b0'; // Purple
    case 'D': return '#f44336'; // Red
    case 'E': return '#9e9e9e'; // Gray (for white - better visibility)
    case 'F': return '#1a237e'; // Navy blue
    default: return '#2196f3'; // Default blue
  }
};

export const getClassColorLight = (className: string): string => {
  const classLetter = className.split(' ')[1];
  
  switch (classLetter) {
    case 'A': return '#e8f5e8'; // Light green
    case 'B': return '#fff8e1'; // Light yellow
    case 'C': return '#f3e5f5'; // Light purple
    case 'D': return '#ffebee'; // Light red
    case 'E': return '#f5f5f5'; // Light gray
    case 'F': return '#e8eaf6'; // Light navy
    default: return '#e3f2fd'; // Light blue
  }
};

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

export interface TeamRoster {
  teamId: number;
  teamName: string;
  className: string;
  players: string[];
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
  referee?: string;
  events: MatchEvent[];
}

export interface MatchEvent {
  id: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute: number;
  player: string;
  team: 'home' | 'away';
  playerOut?: string; // For substitutions
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
  { id: 16, name: 'Szántai Csanád', teamId: 2, teamName: '22 F', goals: 10, position: 15 },
  { id: 17, name: 'Czumpft Bálint', teamId: 13, teamName: '22 E', goals: 10, position: 15 },
  { id: 18, name: 'Fazekas Milán', teamId: 9, teamName: '20 F', goals: 9, position: 18 },
  { id: 19, name: 'Tóth-Vatai Tamás', teamId: 5, teamName: '21 C', goals: 9, position: 18 },
  { id: 20, name: 'Mérai Gergő', teamId: 7, teamName: '21 A', goals: 9, position: 18 },
  { id: 21, name: 'Molnár Botond', teamId: 16, teamName: '24 B', goals: 8, position: 21 },
  { id: 22, name: 'Fodor Péter', teamId: 3, teamName: '21 F', goals: 8, position: 21 },
  { id: 23, name: 'Sági Zsombor Boldizsár', teamId: 13, teamName: '22 E', goals: 8, position: 21 },
  { id: 24, name: 'Kiss Domonkos', teamId: 1, teamName: '24 C', goals: 8, position: 21 },
  { id: 25, name: 'Pákozdi Artúr Ferenc', teamId: 6, teamName: '22 B', goals: 8, position: 21 },
  { id: 26, name: 'Ursu Erik', teamId: 8, teamName: '21 B', goals: 7, position: 26 },
  { id: 27, name: 'Kispál Dániel', teamId: 4, teamName: '20 A', goals: 7, position: 26 },
  { id: 28, name: 'Laczó András', teamId: 5, teamName: '21 C', goals: 7, position: 26 },
  { id: 29, name: 'Majsai Dávid', teamId: 8, teamName: '21 B', goals: 6, position: 29 },
  { id: 30, name: 'Maróti Gergő', teamId: 4, teamName: '20 A', goals: 6, position: 29 },
  { id: 31, name: 'Deák Ferenc', teamId: 13, teamName: '22 E', goals: 6, position: 29 },
  { id: 32, name: 'Gazdag Dávid Benedek', teamId: 9, teamName: '20 F', goals: 5, position: 32 },
  { id: 33, name: 'Megyeri Martin', teamId: 14, teamName: '24 A', goals: 5, position: 32 },
  { id: 34, name: 'Gulácsy Gergő', teamId: 9, teamName: '20 F', goals: 5, position: 32 },
  { id: 35, name: 'Koncz Máté', teamId: 3, teamName: '21 F', goals: 5, position: 32 },
  { id: 36, name: 'Kollár Milán', teamId: 12, teamName: '23 F', goals: 5, position: 32 },
  { id: 37, name: 'Gerzsényi Endre', teamId: 6, teamName: '22 B', goals: 5, position: 32 },
  { id: 38, name: 'Péterfi Dénes', teamId: 17, teamName: '24 F', goals: 5, position: 32 },
  { id: 39, name: 'Zemen Zalán', teamId: 6, teamName: '22 B', goals: 5, position: 32 },
  { id: 40, name: 'McKie James Robert', teamId: 14, teamName: '24 A', goals: 5, position: 32 },
  { id: 41, name: 'Fain László Bence', teamId: 11, teamName: '21 E', goals: 4, position: 41 },
  { id: 42, name: 'Boronyai Dániel', teamId: 6, teamName: '22 B', goals: 4, position: 41 },
  { id: 43, name: 'Stróbli Benjámin', teamId: 7, teamName: '21 A', goals: 4, position: 41 },
  { id: 44, name: 'Kerülő Ákos', teamId: 9, teamName: '20 F', goals: 4, position: 41 },
  { id: 45, name: 'Gábor Marcell', teamId: 10, teamName: '23 B', goals: 4, position: 41 },
  { id: 46, name: 'Mechler Dénes', teamId: 12, teamName: '23 F', goals: 4, position: 41 },
  { id: 47, name: 'Rábai Dávid Krisztián', teamId: 4, teamName: '20 A', goals: 4, position: 41 },
  { id: 48, name: 'Frühwirth Bence', teamId: 15, teamName: '24 D', goals: 4, position: 41 },
  { id: 49, name: 'Nagy Bálint', teamId: 1, teamName: '24 C', goals: 4, position: 41 },
  { id: 50, name: 'Farkas Péter', teamId: 3, teamName: '21 F', goals: 4, position: 41 },
  { id: 51, name: 'Tóbiás Levente Richárd', teamId: 7, teamName: '21 A', goals: 3, position: 51 },
  { id: 52, name: 'Previák Richárd Áron', teamId: 2, teamName: '22 F', goals: 3, position: 51 },
  { id: 53, name: 'Ngo Xuan Nguyen', teamId: 10, teamName: '23 B', goals: 3, position: 51 },
  { id: 54, name: 'Milo Tomas', teamId: 7, teamName: '21 A', goals: 3, position: 51 },
  { id: 55, name: 'Mikola Máté', teamId: 1, teamName: '24 C', goals: 3, position: 51 },
  { id: 56, name: 'Telkes Zoltán Dániel', teamId: 8, teamName: '21 B', goals: 3, position: 51 },
  { id: 57, name: 'Kocsis Ferenc Bálint', teamId: 12, teamName: '23 F', goals: 3, position: 51 },
  { id: 58, name: 'Ye Daniel', teamId: 11, teamName: '21 E', goals: 2, position: 58 },
  { id: 59, name: 'Varga Sebestyén', teamId: 14, teamName: '24 A', goals: 2, position: 58 },
  { id: 60, name: 'Nagy Levente Dániel', teamId: 16, teamName: '24 B', goals: 2, position: 58 },
  { id: 61, name: 'Töreky Gergő Gábor', teamId: 2, teamName: '22 F', goals: 2, position: 58 },
  { id: 62, name: 'Balogh Levente', teamId: 15, teamName: '24 D', goals: 2, position: 58 },
  { id: 63, name: 'Deli Botond Dániel', teamId: 16, teamName: '24 B', goals: 2, position: 58 },
  { id: 64, name: 'Nagy Ferenc Bálint', teamId: 16, teamName: '24 B', goals: 2, position: 58 },
  { id: 65, name: 'Fábián Dániel', teamId: 10, teamName: '23 B', goals: 2, position: 58 },
  { id: 66, name: 'Réti Benedek', teamId: 10, teamName: '23 B', goals: 2, position: 58 },
  { id: 67, name: 'Kozma Domonkos', teamId: 16, teamName: '24 B', goals: 2, position: 58 },
  { id: 68, name: 'Reznák-Iskander Botond', teamId: 11, teamName: '21 E', goals: 2, position: 58 },
  { id: 69, name: 'Gayer Borisz', teamId: 6, teamName: '22 B', goals: 2, position: 58 },
  { id: 70, name: 'Tóth Artúr', teamId: 8, teamName: '21 B', goals: 1, position: 70 },
  { id: 71, name: 'Gégény Krisztián', teamId: 13, teamName: '22 E', goals: 1, position: 70 },
  { id: 72, name: 'Ekker Máté', teamId: 3, teamName: '21 F', goals: 1, position: 70 },
  { id: 73, name: 'Gyurós-Rosivall Ábel', teamId: 14, teamName: '24 A', goals: 1, position: 70 },
  { id: 74, name: 'Bánhidi Csongor', teamId: 13, teamName: '22 E', goals: 1, position: 70 },
  { id: 75, name: 'Tamási András István', teamId: 15, teamName: '24 D', goals: 1, position: 70 },
  { id: 76, name: 'Müller Dávid Szilárd', teamId: 9, teamName: '20 F', goals: 1, position: 70 },
  { id: 77, name: 'Simon Benedek', teamId: 4, teamName: '20 A', goals: 1, position: 70 },
  { id: 78, name: 'Barczi Ádám', teamId: 11, teamName: '21 E', goals: 1, position: 70 },
  { id: 79, name: 'Várkonyi Péter Bátor', teamId: 11, teamName: '21 E', goals: 1, position: 70 },
  { id: 80, name: 'Pesti Márton', teamId: 11, teamName: '21 E', goals: 1, position: 70 },
  { id: 81, name: 'Horányi Dénes Tamás', teamId: 10, teamName: '23 B', goals: 1, position: 70 },
  { id: 82, name: 'Nagy Patrik', teamId: 8, teamName: '21 B', goals: 1, position: 70 },
  { id: 83, name: 'Bozsóki Áron', teamId: 12, teamName: '23 F', goals: 1, position: 70 },
  { id: 84, name: 'Fias Máté', teamId: 10, teamName: '23 B', goals: 1, position: 70 },
  { id: 85, name: 'Szalay Tamás', teamId: 7, teamName: '21 A', goals: 1, position: 70 },
  { id: 86, name: 'Majsai Máté Zoltán', teamId: 16, teamName: '24 B', goals: 1, position: 70 },
  { id: 87, name: 'Horváth Botond', teamId: 5, teamName: '21 C', goals: 1, position: 70 },
  { id: 88, name: 'Stépán Sámuel Zsolt', teamId: 17, teamName: '24 F', goals: 1, position: 70 },
  { id: 89, name: 'Tóth-Varsányi Zétény', teamId: 15, teamName: '24 D', goals: 1, position: 70 },
  { id: 90, name: 'Csarankó Márk Róbert', teamId: 8, teamName: '21 B', goals: 1, position: 70 },
  { id: 91, name: 'Borovics-Kocsis Bence', teamId: 8, teamName: '21 B', goals: 1, position: 70 },
  { id: 92, name: 'Geicsnek Ádám', teamId: 11, teamName: '21 E', goals: 1, position: 70 },
  { id: 93, name: 'Kovács András Márton', teamId: 14, teamName: '24 A', goals: 1, position: 70 },
  { id: 94, name: 'Ács Péter Levente', teamId: 3, teamName: '21 F', goals: 1, position: 70 }
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
    referee: 'Kovács János',
    events: [
      { id: 1, type: 'goal', minute: 23, player: 'Nguyen Nhat Duy', team: 'home' },
      { id: 2, type: 'yellow_card', minute: 34, player: 'Pelle Péter', team: 'away' },
      { id: 3, type: 'substitution', minute: 45, player: 'Kiss Péter', playerOut: 'Nagy József', team: 'home' },
      { id: 4, type: 'goal', minute: 56, player: 'Fias Máté', team: 'away' },
      { id: 5, type: 'goal', minute: 67, player: 'Garabics Dániel', team: 'home' },
      { id: 6, type: 'yellow_card', minute: 72, player: 'Szabó Márk', team: 'home' },
      { id: 7, type: 'substitution', minute: 75, player: 'Molnár Tamás', playerOut: 'Fias Máté', team: 'away' },
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

export const getTopScorers = (limit?: number): Player[] => {
  return limit ? topScorers.slice(0, limit) : topScorers;
};

export const getLeagueTable = (): Team[] => {
  return teams.sort((a, b) => a.position - b.position);
};

// Team rosters for SZLG Liga 24/25
export const teamRosters: TeamRoster[] = [
  {
    teamId: 13,
    teamName: '22 E',
    className: '22 E',
    players: [
      'Kurucz Zsombor',
      'Gégény Krisztián', 
      'Bánhidi Csongor',
      'Sági Zsombor Boldizsár',
      'Czumpft Bálint',
      'Deák Ferenc',
      'Kocsis István',
      'Luu Thanh Dat'
    ]
  },
  {
    teamId: 16,
    teamName: '24 B',
    className: '24 B',
    players: [
      'Molnár Botond',
      'Kozma Domonkos',
      'Nagy Levente Dániel',
      'Nagy Ferenc Bálint',
      'Majsai Máté Zoltán',
      'Deli Botond Dániel',
      'Simon Ákos Zsolt'
    ]
  },
  {
    teamId: 9,
    teamName: '20 F',
    className: '20 F',
    players: [
      'Müller Dávid Szilárd',
      'Kerülő Ákos',
      'Gulácsy Gergő',
      'Bognár Bence',
      'Bartha Bence László',
      'Gazdag Dávid Benedek',
      'Orsolya-Székely Ábel',
      'Fazekas Milán',
      'Keviczky-Tóth Boldizsár'
    ]
  },
  {
    teamId: 4,
    teamName: '20 A',
    className: '20 A',
    players: [
      'Varga Márk',
      'Wootsch Gábor Tamás',
      'Kispál Dániel',
      'Maróti Gergő',
      'Rábai Dávid Krisztián',
      'Simon Benedek'
    ]
  },
  {
    teamId: 15,
    teamName: '24 D',
    className: '24 D',
    players: [
      'Fürész Mátyás',
      'Frühwirth Bence',
      'Tóth-Varsányi Zétény',
      'Balogh Levente',
      'Stark Péter Andor',
      'Martits Gergő',
      'Dévényi Péter',
      'Mahler Artúr',
      'Geleta Lilla',
      'Tamási András István'
    ]
  },
  {
    teamId: 3,
    teamName: '21 F',
    className: '21 F',
    players: [
      'Kardos Áron Tóbiás',
      'Mamira Máté Márk',
      'Ekker Máté',
      'Fodor Péter',
      'Koncz Máté',
      'Gál Nikolasz',
      'Ács Péter Levente',
      'Farkas Péter',
      'Nagy Gergely',
      'Viniczei Viktor'
    ]
  },
  {
    teamId: 17,
    teamName: '24 F',
    className: '24 F',
    players: [
      'Stépán Sámuel Zsolt',
      'Péterfi Dénes',
      'Görömbei Ervin',
      'Bocsi Mátyás',
      'Kordás Dávid',
      'Váradi Szilárd Levente',
      'Pavlicsek Huba',
      'Kovács Ádám Lőrinc',
      'Szabó-Kovács Kolos Gyula'
    ]
  },
  {
    teamId: 11,
    teamName: '21 E',
    className: '21 E',
    players: [
      'Pesti Márton',
      'Geicsnek Ádám',
      'Barczi Ádám',
      'Várkonyi Péter Bátor',
      'Szilaski Ádám',
      'Reznák-Iskander Botond',
      'Ye Daniel',
      'Kele Áron',
      'Kovács Bence',
      'Fain László Bence',
      'Mack Boldizsár',
      'Budaházy Bernát'
    ]
  },
  {
    teamId: 10,
    teamName: '23 B',
    className: '23 B',
    players: [
      'Fias Máté',
      'Gégény Bence',
      'Ngo Xuan Nguyen',
      'Horányi Dénes Tamás',
      'Fábián Dániel',
      'Pelle Péter',
      'Réti Benedek',
      'Rozmanitz Gergő',
      'Gábor Marcell'
    ]
  },
  {
    teamId: 12,
    teamName: '23 F',
    className: '23 F',
    players: [
      'Bozsóki Áron',
      'Kátai Kornél',
      'Mechler Dénes',
      'Csomós Dávid',
      'Kecskeméti Mátyás',
      'Kollár Milán',
      'Geibinger Félix',
      'Kocsis Ferenc Bálint'
    ]
  },
  {
    teamId: 8,
    teamName: '21 B',
    className: '21 B',
    players: [
      'Telkes Zoltán Dániel',
      'Jancsár Botond',
      'Borovics-Kocsis Bence',
      'Csarankó Márk Róbert',
      'Ursu Erik',
      'Majsai Dávid',
      'Nagy Patrik',
      'Tóth Artúr',
      'Bittera Berény Tibor',
      'Majsai Kristóf János'
    ]
  },
  {
    teamId: 6,
    teamName: '22 B',
    className: '22 B',
    players: [
      'Zemen Zalán',
      'Valentin Bendegúz',
      'Gerzsényi Endre',
      'Pákozdi Artúr Ferenc',
      'Mécs Martin Levente',
      'Gayer Borisz',
      'Almási Attila István',
      'Boronyai Dániel',
      'Varga Levente'
    ]
  },
  {
    teamId: 14,
    teamName: '24 A',
    className: '24 A',
    players: [
      'Kovács András Márton',
      'Gyurós-Rosivall Ábel',
      'Varga Sebestyén',
      'Raffay Zétény',
      'Fényes Marcell',
      'Megyeri Martin',
      'McKie James Robert'
    ]
  },
  {
    teamId: 2,
    teamName: '22 F',
    className: '22 F',
    players: [
      'Szántai Csanád',
      'Tatai Ádám',
      'Vincze Dániel',
      'Balázs Ádám Gábor',
      'Gere Lukács',
      'Minkó Marcell Levente',
      'Töreky Gergő Gábor',
      'Previák Richárd Áron'
    ]
  },
  {
    teamId: 1,
    teamName: '24 C',
    className: '24 C',
    players: [
      'Kálmán Roland',
      'Kiss Domonkos',
      'Nagy Bálint',
      'Mikola Máté',
      'Cséplő Tamás',
      'Szabadi Zalán',
      'Nagy Sándor Miklós',
      'Chen Xianting',
      'Bolla-Vakály Márton',
      'Gyenge Márk Teofil'
    ]
  },
  {
    teamId: 7,
    teamName: '21 A',
    className: '21 A',
    players: [
      'Szabó Marcell Dénes',
      'Tóbiás Levente Richárd',
      'Szalay Tamás',
      'Mérai Gergő',
      'Raffay Kristóf',
      'Stróbli Benjámin',
      'Milo Tomas'
    ]
  },
  {
    teamId: 5,
    teamName: '21 C',
    className: '21 C',
    players: [
      'Nguyen Nhat Duy',
      'Szilasi Benjámin Imre',
      'Horváth Botond',
      'Laczó András',
      'Hallgas Benedek',
      'Iván Márton',
      'Garabics Dániel',
      'Zack-Williams Balázs Olushola',
      'Tóth-Vatai Tamás',
      'Maigut Zita Klára'
    ]
  }
];

export const getTeamRosterByTeamId = (teamId: number): TeamRoster | undefined => {
  return teamRosters.find(roster => roster.teamId === teamId);
};

export const getTeamRosterByTeamName = (teamName: string): TeamRoster | undefined => {
  return teamRosters.find(roster => roster.teamName === teamName);
};

export const getAllTeamRosters = (): TeamRoster[] => {
  return teamRosters;
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

// Class color coding system - optimized for dark mode with better contrast
export const getClassColor = (className: string): string => {
  const classLetter = className.split(' ')[1]; // Gets the letter part (A, B, C, etc.)
  
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
  const classLetter = className.split(' ')[1];
  
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

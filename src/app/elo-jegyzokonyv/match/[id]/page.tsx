'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  Button, 
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  useTheme
} from '@mui/material';
import { 
  SportsSoccer as SoccerIcon,
  ArrowBack as BackIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  EmojiEvents as GoalIcon,
  Warning as YellowCardIcon,
  Block as RedCardIcon,
  SwapHoriz as SubstitutionIcon
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import RefereeMatchTimer from '@/components/RefereeMatchTimer';

// API base URL helper
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    return isLocalhost ? 'http://localhost:8000/api' : 'https://fociapi.szlg.info/api';
  }
  return 'http://localhost:8000/api';
};

// Types (same as dashboard)
interface Team {
  id: number;
  name: string | null;
  start_year: number;
  tagozat: string;
  color: string;
  active: boolean;
  players: Player[];
}

interface Player {
  id: number;
  name: string;
  csk: boolean;
  start_year: number | null;
  tagozat: string | null;
  effective_start_year: number | null;
  effective_tagozat: string | null;
}

interface MatchStatus {
  id: number;
  team1: Team;
  team2: Team;
  datetime: string;
  referee: any;
  events: any[];
  score: [number, number];
  status: string;
}

interface PendingEvent {
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  team: 'team1' | 'team2';
  minute: number;
  half: number;
}

// Auth service
const authService = {
  async checkAuthStatus() {
    try {
      const apiBaseUrl = getApiBaseUrl();
      
      // Get token from localStorage
      const token = localStorage.getItem('jwt_token');
      
      let response;
      
      // If we have a token, prefer using it over cookies (more reliable in production)
      if (token) {
        response = await fetch(`${apiBaseUrl}/auth/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
      } else {
        response = await fetch(`${apiBaseUrl}/auth/status`, {
          credentials: 'include',
          mode: 'cors'
        });
      }
      
      if (!response.ok) {
        // Clear invalid token if we have one
        if (token) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('token_timestamp');
        }
        return { authenticated: false };
      }
      
      return await response.json();
    } catch {
      return { authenticated: false };
    }
  }
};

// API service
const apiService = {
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwt_token');
    
    // Try with token first if available (more reliable in production)
    if (token) {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        mode: 'cors'
      });
      
      if (response.ok) {
        return response;
      }
    }
    
    // Fallback to cookies
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      mode: 'cors'
    });
    
    return response;
  },

  async getMatch(matchId: string): Promise<MatchStatus> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}`);
    if (!response.ok) throw new Error('Failed to fetch match');
    return response.json();
  },

  async startMatch(matchId: string) {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/start-match`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to start match');
    return response.json();
  },

  async endHalf(matchId: string, minute?: number, half?: number) {
    const apiBaseUrl = getApiBaseUrl();
    const body = minute !== undefined && half !== undefined 
      ? JSON.stringify({ minute, half })
      : undefined;
    
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/end-half`, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body
    });
    if (!response.ok) throw new Error('Failed to end half');
    return response.json();
  },

  async endMatch(matchId: string, minute?: number, half?: number) {
    const apiBaseUrl = getApiBaseUrl();
    const body = minute !== undefined && half !== undefined 
      ? JSON.stringify({ minute, half })
      : undefined;
    
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/end-match`, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body
    });
    if (!response.ok) throw new Error('Failed to end match');
    return response.json();
  },

  async addGoal(matchId: string, playerId: number, minute: number, half: number) {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/quick-goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, minute, half })
    });
    if (!response.ok) throw new Error('Failed to add goal');
    return response.json();
  },

  async addCard(matchId: string, playerId: number, minute: number, half: number, cardType: 'yellow' | 'red') {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/quick-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, minute, half, card_type: cardType })
    });
    if (!response.ok) throw new Error('Failed to add card');
    return response.json();
  },

  async addSubstitution(matchId: string, playerId: number, minute: number, half: number) {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/quick-substitution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, minute, half })
    });
    if (!response.ok) throw new Error('Failed to add substitution');
    return response.json();
  },

  async getCurrentMinute(matchId: string) {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/current-minute`);
    if (!response.ok) throw new Error('Failed to get current minute');
    return response.json();
  },

  async addExtraTime(matchId: string, minutes: number, half: number) {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/extra-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extra_time_minutes: minutes, half })
    });
    if (!response.ok) throw new Error('Failed to add extra time');
    return response.json();
  },

  async startSecondHalf(matchId: string) {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/start-second-half`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to start second half');
    return response.json();
  }
};

const LiveMatchPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const matchId = params.id as string;

  const [match, setMatch] = useState<MatchStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingEvent, setPendingEvent] = useState<PendingEvent | null>(null);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmEndMatchOpen, setConfirmEndMatchOpen] = useState(false);
  const [currentMatchMinute, setCurrentMatchMinute] = useState<number>(1);
  const [currentMatchHalf, setCurrentMatchHalf] = useState<number>(1);
  const [currentMatchStatus, setCurrentMatchStatus] = useState<string>('not_started');

  const loadMatch = useCallback(async () => {
    try {
      setError('');
      const matchData = await apiService.getMatch(matchId);
      setMatch(matchData);
      
      // Get current minute if match is active
      if (matchData.status !== 'not_started' && matchData.status !== 'finished') {
        try {
          const minuteData = await apiService.getCurrentMinute(matchId);
          setCurrentMatchMinute(minuteData.current_minute);
        } catch {
          // Ignore error for current minute
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('403')) {
        router.push('/elo-jegyzokonyv');
        return;
      }
      setError('Nem sikerült betölteni a mérkőzést');
    } finally {
      setLoading(false);
    }
  }, [matchId, router]);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await authService.checkAuthStatus();
      if (!authStatus.authenticated) {
        router.push('/elo-jegyzokonyv');
        return;
      }
      loadMatch();
    };

    checkAuth();
  }, [router, loadMatch]);

  // Auto-refresh match data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (match && match.status !== 'finished') {
        loadMatch();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [match, loadMatch]);

  const getTeamName = (team: Team) => {
    return team.name || `${team.start_year}/${team.tagozat}`;
  };

  const handleEventClick = (eventType: 'goal' | 'yellow_card' | 'red_card' | 'substitution', team: 'team1' | 'team2') => {
    if (!match) return;
    
    // Use current minute from timer instead of fallback calculation
    const minute = currentMatchMinute;
    const half = currentMatchHalf;
    
    setPendingEvent({
      type: eventType,
      team,
      minute,
      half
    });
    setPlayerModalOpen(true);
  };

  const handlePlayerSelect = async (playerId: number) => {
    if (!pendingEvent || !match) return;
    
    setActionLoading('event');
    try {
      if (pendingEvent.type === 'goal') {
        await apiService.addGoal(matchId, playerId, pendingEvent.minute, pendingEvent.half);
      } else if (pendingEvent.type === 'substitution') {
        await apiService.addSubstitution(matchId, playerId, pendingEvent.minute, pendingEvent.half);
      } else {
        const cardType = pendingEvent.type === 'yellow_card' ? 'yellow' : 'red';
        await apiService.addCard(matchId, playerId, pendingEvent.minute, pendingEvent.half, cardType);
      }
      
      await loadMatch(); // Refresh match data
      setPlayerModalOpen(false);
      setPendingEvent(null);
    } catch {
      setError('Nem sikerült rögzíteni az eseményt');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMatchAction = async (action: 'start' | 'end-half' | 'start-second-half' | 'end-match') => {
    if (!match) return;
    
    // Show confirmation for end match
    if (action === 'end-match') {
      setConfirmEndMatchOpen(true);
      return;
    }
    
    setActionLoading(action);
    try {
      switch (action) {
        case 'start':
          // If we're in second half, call start-second-half instead
          if (currentMatchHalf === 2) {
            await apiService.startSecondHalf(matchId);
          } else {
            await apiService.startMatch(matchId);
          }
          break;
        case 'end-half':
          await apiService.endHalf(matchId, currentMatchMinute, currentMatchHalf);
          break;
        case 'start-second-half':
          await apiService.startSecondHalf(matchId);
          break;
      }
      
      await loadMatch();
    } catch {
      setError('Nem sikerült végrehajtani a műveletet');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmEndMatch = async () => {
    if (!match) return;
    
    setActionLoading('end-match');
    setConfirmEndMatchOpen(false);
    
    try {
      await apiService.endMatch(matchId, currentMatchMinute, currentMatchHalf);
      await loadMatch();
    } catch {
      setError('Nem sikerült befejezni a mérkőzést');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtraTimeAdded = async (minutes: number, half: number) => {
    try {
      await apiService.addExtraTime(matchId, minutes, half);
      await loadMatch(); // Refresh match data
    } catch {
      setError('Nem sikerült hozzáadni a hosszabbítást');
    }
  };

  const handleCurrentMinuteChange = useCallback((minute: number, half: number) => {
    setCurrentMatchMinute(minute);
    setCurrentMatchHalf(half);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setCurrentMatchStatus(status);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (!match) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default, p: 2 }}>
        <Alert severity="error">Mérkőzés nem található</Alert>
      </Box>
    );
  }

  const team1Players = match.team1.players;
  const team2Players = match.team2.players;
  const selectedTeamPlayers = pendingEvent?.team === 'team1' ? team1Players : team2Players;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Top App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.primary.main}20`,
          color: theme.palette.text.primary
        }}
      >
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => router.push('/elo-jegyzokonyv/dashboard')}
            sx={{ mr: 2 }}
          >
            <BackIcon />
          </IconButton>
          <SoccerIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Élő mérkőzés
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {getTeamName(match.team1)} vs {getTeamName(match.team2)}
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={loadMatch}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Match Status */}
        <Card sx={{ mb: 3, borderRadius: 3, backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
          <CardContent>
            <Stack spacing={2}>
              {/* Enhanced Timer Display */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <RefereeMatchTimer 
                  _matchId={matchId}
                  status={match.status}
                  events={match.events}
                  onExtraTimeAdded={handleExtraTimeAdded}
                  onCurrentMinuteChange={handleCurrentMinuteChange}
                  onStatusChange={handleStatusChange}
                />
              </Box>

              {/* Score Display */}
              <Box sx={{ textAlign: 'center' }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                  <Box sx={{ flex: 1, textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: match.team1.color }}>
                      {getTeamName(match.team1)}
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      px: 3, 
                      py: 2, 
                      backgroundColor: '#2d2d2d', 
                      borderRadius: 3,
                      minWidth: 100,
                      border: '1px solid #404040'
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#e8eaed' }}>
                      {match.score[0]} - {match.score[1]}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1, textAlign: 'left' }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: match.team2.color }}>
                      {getTeamName(match.team2)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Match Controls */}
        <Card sx={{ mb: 3, borderRadius: 3, backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textAlign: 'center', color: '#e8eaed' }}>
              Mérkőzés irányítása
            </Typography>
            
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              {match.status === 'not_started' && (
                <Button
                  variant="contained"
                  startIcon={<StartIcon />}
                  onClick={() => handleMatchAction('start')}
                  disabled={actionLoading === 'start'}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.dark }
                  }}
                >
                  {currentMatchHalf === 2 ? '2. félidő kezdete' : 'Meccs kezdése'}
                </Button>
              )}
              
              {match.status === 'first_half' && (
                <Button
                  variant="contained"
                  startIcon={<PauseIcon />}
                  onClick={() => handleMatchAction('end-half')}
                  disabled={actionLoading === 'end-half'}
                  sx={{
                    backgroundColor: theme.palette.warning.main,
                    '&:hover': { backgroundColor: theme.palette.warning.dark }
                  }}
                >
                  Félidő vége
                </Button>
              )}

              {match.status === 'half_time' && (
                <Button
                  variant="contained"
                  startIcon={<StartIcon />}
                  onClick={() => handleMatchAction('start-second-half')}
                  disabled={actionLoading === 'start-second-half'}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.dark }
                  }}
                >
                  Második félidő kezdése
                </Button>
              )}
              
              {match.status === 'second_half' && (
                <Button
                  variant="contained"
                  startIcon={<PauseIcon />}
                  onClick={() => handleMatchAction('end-match')}
                  disabled={actionLoading === 'end-match'}
                  sx={{
                    backgroundColor: theme.palette.warning.main,
                    '&:hover': { backgroundColor: theme.palette.warning.dark }
                  }}
                >
                  Meccs vége
                </Button>
              )}
              
              {match.status !== 'not_started' && match.status !== 'finished' && (
                <Button
                  variant="contained"
                  startIcon={<StopIcon />}
                  onClick={() => handleMatchAction('end-match')}
                  disabled={actionLoading === 'end-match'}
                  sx={{
                    backgroundColor: theme.palette.error.main,
                    '&:hover': { backgroundColor: theme.palette.error.dark }
                  }}
                >
                  Meccs befejezése
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Event Recording */}
        {match.status !== 'not_started' && match.status !== 'finished' && currentMatchStatus !== 'half_time' && (
          <Stack direction="row" spacing={2}>
            {/* Team 1 Events */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ borderRadius: 3, backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    sx={{ mb: 2, textAlign: 'center', color: match.team1.color }}
                  >
                    {getTeamName(match.team1)}
                  </Typography>
                  
                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<GoalIcon />}
                      onClick={() => handleEventClick('goal', 'team1')}
                      sx={{
                        backgroundColor: '#10b981',
                        '&:hover': { backgroundColor: '#059669' },
                        py: 1.5
                      }}
                    >
                      GÓL
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<YellowCardIcon />}
                      onClick={() => handleEventClick('yellow_card', 'team1')}
                      sx={{
                        backgroundColor: '#f59e0b',
                        '&:hover': { backgroundColor: '#d97706' },
                        py: 1.5
                      }}
                    >
                      SÁRGA LAP
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<RedCardIcon />}
                      onClick={() => handleEventClick('red_card', 'team1')}
                      sx={{
                        backgroundColor: '#ef4444',
                        '&:hover': { backgroundColor: '#dc2626' },
                        py: 1.5
                      }}
                    >
                      PIROS LAP
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<SubstitutionIcon />}
                      onClick={() => handleEventClick('substitution', 'team1')}
                      sx={{
                        backgroundColor: '#03a9f4',
                        '&:hover': { backgroundColor: '#0288d1' },
                        py: 1.5
                      }}
                    >
                      CSERE
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Team 2 Events */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ borderRadius: 3, backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    sx={{ mb: 2, textAlign: 'center', color: match.team2.color }}
                  >
                    {getTeamName(match.team2)}
                  </Typography>
                  
                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<GoalIcon />}
                      onClick={() => handleEventClick('goal', 'team2')}
                      sx={{
                        backgroundColor: '#10b981',
                        '&:hover': { backgroundColor: '#059669' },
                        py: 1.5
                      }}
                    >
                      GÓL
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<YellowCardIcon />}
                      onClick={() => handleEventClick('yellow_card', 'team2')}
                      sx={{
                        backgroundColor: '#f59e0b',
                        '&:hover': { backgroundColor: '#d97706' },
                        py: 1.5
                      }}
                    >
                      SÁRGA LAP
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<RedCardIcon />}
                      onClick={() => handleEventClick('red_card', 'team2')}
                      sx={{
                        backgroundColor: '#ef4444',
                        '&:hover': { backgroundColor: '#dc2626' },
                        py: 1.5
                      }}
                    >
                      PIROS LAP
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<SubstitutionIcon />}
                      onClick={() => handleEventClick('substitution', 'team2')}
                      sx={{
                        backgroundColor: '#03a9f4',
                        '&:hover': { backgroundColor: '#0288d1' },
                        py: 1.5
                      }}
                    >
                      CSERE
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Stack>
        )}

        {/* Recent Events - Enhanced for Dark Mode */}
        {match.events.length > 0 && (
          <Card sx={{ mt: 3, borderRadius: 3, backgroundColor: '#1e1e1e', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#e8eaed' }}>
                Összes esemény
              </Typography>
              
              <Stack spacing={1} sx={{ maxHeight: 300, overflow: 'auto' }}>
                {match.events
                  .filter(event => [
                    'goal', 
                    'yellow_card', 
                    'red_card', 
                    'match_start', 
                    'half_time', 
                    'second_half_start',
                    'full_time', 
                    'match_end',
                    'extra_time',
                    'substitution'
                  ].includes(event.event_type))
                  .reverse()
                  .slice(0, 10)
                  .map((event, index) => {
                    const getEventColor = (eventType: string) => {
                      switch (eventType) {
                        case 'goal': return '#10b981';
                        case 'yellow_card': return '#f59e0b';
                        case 'red_card': return '#ef4444';
                        case 'match_start': return '#4caf50';
                        case 'half_time': return '#ff9800';
                        case 'second_half_start': return '#2196f3';
                        case 'full_time': 
                        case 'match_end': return '#9e9e9e';
                        case 'extra_time': return '#9c27b0';
                        case 'substitution': return '#03a9f4';
                        default: return '#64748b';
                      }
                    };

                    const getEventLabel = (eventType: string, event: any) => {
                      switch (eventType) {
                        case 'goal': return 'GÓL';
                        case 'yellow_card': return 'SÁRGA LAP';
                        case 'red_card': return 'PIROS LAP';
                        case 'match_start': 
                          // Check if this is actually second half start (minute 11+)
                          return event.minute >= 11 ? 'MÁSODIK FÉLIDŐ KEZDETE' : 'KEZDŐRUGÁS';
                        case 'half_time': return 'FÉLIDŐ';
                        case 'second_half_start': return 'MÁSODIK FÉLIDŐ KEZDETE';
                        case 'full_time': return 'VÉGSŐ SÍPSZÓ';
                        case 'match_end': return 'MECCS VÉGE';
                        case 'extra_time': return 'HOSSZABBÍTÁS';
                        case 'substitution': return 'CSERE';
                        default: return eventType.toUpperCase();
                      }
                    };

                    const getEventIcon = (eventType: string) => {
                      switch (eventType) {
                        case 'goal': return <GoalIcon sx={{ color: getEventColor(eventType), fontSize: 20 }} />;
                        case 'yellow_card': return <YellowCardIcon sx={{ color: getEventColor(eventType), fontSize: 20 }} />;
                        case 'red_card': return <RedCardIcon sx={{ color: getEventColor(eventType), fontSize: 20 }} />;
                        case 'match_start': return <span style={{ fontSize: '16px' }}>🚀</span>;
                        case 'half_time': return <span style={{ fontSize: '16px' }}>⏸️</span>;
                        case 'second_half_start': return <span style={{ fontSize: '16px' }}>▶️</span>;
                        case 'full_time': 
                        case 'match_end': return <span style={{ fontSize: '16px' }}>🏁</span>;
                        case 'extra_time': return <span style={{ fontSize: '16px' }}>⏱️</span>;
                        case 'substitution': return <span style={{ fontSize: '16px' }}>🔄</span>;
                        default: return <span style={{ fontSize: '16px' }}>⚽</span>;
                      }
                    };

                    return (
                      <Box 
                        key={index}
                        sx={{ 
                          p: 2, 
                          backgroundColor: '#2d2d2d', 
                          borderRadius: 2,
                          border: '1px solid #404040',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#3d3d3d',
                            borderColor: getEventColor(event.event_type)
                          }
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getEventIcon(event.event_type)}
                            <Box>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: '#e8eaed' }}>
                                {getEventLabel(event.event_type, event)}
                              </Typography>
                              {event.player?.name && (
                                <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                                  {event.player.name}
                                </Typography>
                              )}
                              {event.event_type === 'extra_time' && event.extra_time && (
                                <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                                  +{event.extra_time} perc
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" sx={{ 
                              color: getEventColor(event.event_type),
                              fontWeight: 'bold'
                            }}>
                              {event.minute}&apos;
                            </Typography>
                            {event.half && (
                              <Typography variant="caption" sx={{ 
                                color: '#9aa0a6',
                                backgroundColor: '#404040',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1
                              }}>
                                {event.half}. félidő
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      </Box>
                    );
                  })}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Player Selection Modal */}
      <Dialog 
        open={playerModalOpen} 
        onClose={() => setPlayerModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Játékos kiválasztása
          {pendingEvent && (
            <Typography variant="body2" color="text.secondary">
              {pendingEvent.type === 'goal' ? 'Gól' : 
               pendingEvent.type === 'yellow_card' ? 'Sárga lap' : 
               pendingEvent.type === 'red_card' ? 'Piros lap' : 
               pendingEvent.type === 'substitution' ? 'Csere' : 
               pendingEvent.type} - {pendingEvent.minute}. perc
            </Typography>
          )}
        </DialogTitle>
        
        <DialogContent>
          <List>
            {selectedTeamPlayers.map((player) => (
              <ListItem key={player.id} disablePadding>
                <ListItemButton 
                  onClick={() => handlePlayerSelect(player.id)}
                  disabled={actionLoading === 'event'}
                >
                  <ListItemText 
                    primary={player.name}
                    secondary={player.csk ? 'Csapatkapitány' : ''}
                  />
                  {player.csk && (
                    <Badge color="primary" variant="dot" sx={{ mr: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setPlayerModalOpen(false)}>
            Mégse
          </Button>
        </DialogActions>
      </Dialog>

      {/* End Match Confirmation Modal */}
      <Dialog 
        open={confirmEndMatchOpen} 
        onClose={() => setConfirmEndMatchOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Mérkőzés befejezése
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Biztosan be szeretné fejezni a mérkőzést?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ez a művelet nem visszavonható. A mérkőzés befejezettként lesz jelölve.
          </Typography>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setConfirmEndMatchOpen(false)}>
            Mégse
          </Button>
          <Button 
            onClick={handleConfirmEndMatch}
            variant="contained"
            color="error"
            disabled={actionLoading === 'end-match'}
          >
            Igen, befejezem
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading overlay */}
      {actionLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
        </Box>
      )}
    </Box>
  );
};

export default LiveMatchPage;
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
  Chip,
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
  SwapHoriz as SubstitutionIcon,
  Undo as UndoIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import RefereeMatchTimer from '@/components/RefereeMatchTimer';
import SecondYellowCardModal from '@/components/SecondYellowCardModal';
import { refereeService } from '@/services/apiService';

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
  minute_extra_time: number;
  half: number;
}

interface UndoableEvent {
  id: number;
  event_type: string;
  minute: number;
  half: number;
  player_name: string | null;
  exact_time: string | null;
  can_undo: boolean;
  cannot_undo_reasons: string[];
}

interface UndoResponse {
  message: string;
  removed_event?: any;
  undone_event?: any;
  updated_score: [number, number];
  timestamp: string;
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

  async endHalf(matchId: string, minute?: number, half?: number, extraTime?: number) {
    const apiBaseUrl = getApiBaseUrl();
    let body = undefined;
    
    if (minute !== undefined && half !== undefined) {
      const requestData: any = { minute, half };
      
      // Only include minute_extra_time if provided and > 0
      if (extraTime && extraTime > 0) {
        requestData.minute_extra_time = extraTime;
        console.log(`⏰ End half including minute_extra_time: ${extraTime}`);
      } else {
        console.log(`⏰ End half without extra time (extraTime: ${extraTime})`);
      }
      
      console.log(`⏰ End half request payload:`, requestData);
      body = JSON.stringify(requestData);
    }
    
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/end-half`, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body
    });
    if (!response.ok) throw new Error('Failed to end half');
    return response.json();
  },

  async endMatch(matchId: string, minute?: number, half?: number, extraTime?: number) {
    const apiBaseUrl = getApiBaseUrl();
    let body = undefined;
    
    if (minute !== undefined && half !== undefined) {
      const requestData: any = { minute, half };
      
      // Only include minute_extra_time if provided and > 0
      if (extraTime && extraTime > 0) {
        requestData.minute_extra_time = extraTime;
        console.log(`🏁 End match including minute_extra_time: ${extraTime}`);
      } else {
        console.log(`🏁 End match without extra time (extraTime: ${extraTime})`);
      }
      
      console.log(`🏁 End match request payload:`, requestData);
      body = JSON.stringify(requestData);
    }
    
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
  },

  // Undo functionality
  async undoLastEvent(matchId: string): Promise<UndoResponse> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/undo-last-event`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to undo last event');
    return response.json();
  },

  async removeEvent(matchId: string, eventId: number): Promise<UndoResponse> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/events/${eventId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove event');
    return response.json();
  },

  async getUndoableEvents(matchId: string): Promise<{undoable_events: UndoableEvent[]}> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/undoable-events`);
    if (!response.ok) throw new Error('Failed to get undoable events');
    return response.json();
  },

  async undoEventsAfterMinute(matchId: string, minute: number): Promise<UndoResponse> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await this.makeAuthenticatedRequest(`${apiBaseUrl}/biro/matches/${matchId}/undo-after-minute/${minute}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to undo events after minute');
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
  const [currentMatchExtraTime, setCurrentMatchExtraTime] = useState<number>(0);
  const [currentMatchHalf, setCurrentMatchHalf] = useState<number>(1);
  const [currentMatchStatus, setCurrentMatchStatus] = useState<string>('not_started');
  const [secondYellowCardModalOpen, setSecondYellowCardModalOpen] = useState(false);
  const [pendingSecondYellowPlayer, setPendingSecondYellowPlayer] = useState<Player | null>(null);
  
  // Undo functionality state
  const [undoModalOpen, setUndoModalOpen] = useState(false);
  const [undoableEvents, setUndoableEvents] = useState<UndoableEvent[]>([]);
  const [undoLoading, setUndoLoading] = useState(false);
  const [confirmUndoOpen, setConfirmUndoOpen] = useState(false);
  const [eventToUndo, setEventToUndo] = useState<number | 'last' | null>(null);

  const loadMatch = useCallback(async () => {
    try {
      setError('');
      const matchData = await apiService.getMatch(matchId);
      
      // Defensive check: if match has no events, it's not actually started
      // Note: matchData.status is cancellation status (active/cancelled_new_date/cancelled_no_date)
      // Match progress is determined by events, not the status field
      if (matchData.events && matchData.events.length === 0) {
        console.log('⚠️ Match has no events - treating as not started');
        // Don't modify matchData.status as it's for cancellation tracking
      }
      
      setMatch(matchData);
      
      // Get current minute only if match has events (has been started)
      if (matchData.events && matchData.events.length > 0) {
        const hasMatchStartEvent = matchData.events.some(e => e.event_type === 'match_start');
        const hasMatchEndEvent = matchData.events.some(e => 
          e.event_type === 'match_end' || e.event_type === 'full_time'
        );
        
        if (hasMatchStartEvent && !hasMatchEndEvent) {
          try {
            const minuteData = await apiService.getCurrentMinute(matchId);
            setCurrentMatchMinute(minuteData.current_minute);
          } catch {
            // Ignore error for current minute
          }
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
      // Don't auto-refresh if match has ended (has match_end or full_time event)
      if (match && match.events) {
        const hasMatchEndEvent = match.events.some(e => 
          e.event_type === 'match_end' || e.event_type === 'full_time'
        );
        if (!hasMatchEndEvent) {
          loadMatch();
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [match, loadMatch]);

  const getTeamName = (team: Team) => {
    return team.name || `${team.start_year}/${team.tagozat}`;
  };

  // Helper function to count yellow cards for a specific player
  const getPlayerYellowCardCount = (playerId: number) => {
    if (!match) return 0;
    
    return match.events.filter(event => 
      event.event_type === 'yellow_card' && 
      event.player?.id === playerId
    ).length;
  };

  // Helper function to count red cards for a specific player
  const getPlayerRedCardCount = (playerId: number) => {
    if (!match) return 0;
    
    return match.events.filter(event => 
      event.event_type === 'red_card' && 
      event.player?.id === playerId
    ).length;
  };

  // Helper function to check if a player has been sent off (has red card)
  const isPlayerSentOff = (playerId: number) => {
    return getPlayerRedCardCount(playerId) > 0;
  };

  // Helper function to check if a player would get their second yellow card
  const wouldBeSecondYellowCard = (playerId: number) => {
    return getPlayerYellowCardCount(playerId) === 1;
  };

  const handleEventClick = (eventType: 'goal' | 'yellow_card' | 'red_card' | 'substitution', team: 'team1' | 'team2') => {
    if (!match) return;
    
    // Use current minute and extra time from timer
    const minute = currentMatchMinute;
    const extraTime = currentMatchExtraTime;
    const half = currentMatchHalf;
    
    setPendingEvent({
      type: eventType,
      team,
      minute,
      minute_extra_time: extraTime,
      half
    });
    setPlayerModalOpen(true);
  };

  const handlePlayerSelect = async (playerId: number) => {
    if (!pendingEvent || !match) return;
    
    // Special handling for yellow cards - check if this would be the player's second yellow card
    if (pendingEvent.type === 'yellow_card' && wouldBeSecondYellowCard(playerId)) {
      // Find the player object
      const team = pendingEvent.team === 'team1' ? match.team1 : match.team2;
      const player = team.players.find(p => p.id === playerId);
      
      if (player) {
        // Store the player and show the second yellow card modal
        setPendingSecondYellowPlayer(player);
        setSecondYellowCardModalOpen(true);
        setPlayerModalOpen(false); // Close the player selection modal
        return;
      }
    }
    
    // Normal processing for all other cases
    await processPlayerEvent(playerId);
  };

  // Separated event processing logic for reuse
  const processPlayerEvent = async (playerId: number, forceCardType?: 'yellow' | 'red') => {
    if (!pendingEvent || !match) return;
    
    setActionLoading('event');
    try {
      const matchIdNum = parseInt(matchId, 10);
      
      if (pendingEvent.type === 'goal') {
        await refereeService.addQuickGoal(matchIdNum, {
          player_id: playerId,
          minute: pendingEvent.minute,
          minute_extra_time: pendingEvent.minute_extra_time,
          half: pendingEvent.half
        });
      } else if (pendingEvent.type === 'substitution') {
        await apiService.addSubstitution(matchId, playerId, pendingEvent.minute, pendingEvent.half);
      } else {
        // Use forced card type if provided (for second yellow card scenarios), otherwise use the pending event type
        const cardType = forceCardType || (pendingEvent.type === 'yellow_card' ? 'yellow' : 'red');
        await refereeService.addQuickCard(matchIdNum, {
          player_id: playerId,
          minute: pendingEvent.minute,
          minute_extra_time: pendingEvent.minute_extra_time,
          half: pendingEvent.half,
          card_type: cardType
        });
      }
      
      await loadMatch(); // Refresh match data
      setPlayerModalOpen(false);
      setPendingEvent(null);
      
      // Reset second yellow card modal state
      setSecondYellowCardModalOpen(false);
      setPendingSecondYellowPlayer(null);
    } catch {
      setError('Nem sikerült rögzíteni az eseményt');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle second yellow card modal actions
  const handleSecondYellowCardYellow = async () => {
    if (pendingSecondYellowPlayer) {
      await processPlayerEvent(pendingSecondYellowPlayer.id, 'yellow');
    }
  };

  const handleSecondYellowCardRed = async () => {
    if (pendingSecondYellowPlayer) {
      await processPlayerEvent(pendingSecondYellowPlayer.id, 'red');
    }
  };

  const handleSecondYellowCardClose = () => {
    setSecondYellowCardModalOpen(false);
    setPendingSecondYellowPlayer(null);
    setPlayerModalOpen(true); // Reopen the player selection modal
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
          await apiService.endHalf(matchId, currentMatchMinute, currentMatchHalf, currentMatchExtraTime);
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
      await apiService.endMatch(matchId, currentMatchMinute, currentMatchHalf, currentMatchExtraTime);
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

  const handleTimingUpdate = useCallback((minute: number, extraTime: number, half: number) => {
    setCurrentMatchMinute(minute);
    setCurrentMatchExtraTime(extraTime);
    setCurrentMatchHalf(half);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setCurrentMatchStatus(status);
  }, []);

  // Undo functionality handlers
  const loadUndoableEvents = useCallback(async () => {
    if (!match) return;
    
    try {
      const response = await apiService.getUndoableEvents(matchId);
      setUndoableEvents(response.undoable_events);
    } catch (error) {
      console.error('Failed to load undoable events:', error);
    }
  }, [matchId, match]);

  const handleUndoLastEvent = async () => {
    if (!match) return;
    
    // Show confirmation dialog instead of immediate action
    setEventToUndo('last'); // Use 'last' as identifier for last event
    setConfirmUndoOpen(true);
  };

  const performUndoLastEvent = async () => {
    if (!match) return;
    
    setUndoLoading(true);
    try {
      await apiService.undoLastEvent(matchId);
      await loadMatch(); // Refresh match data
      setError(''); // Clear any previous errors
      setConfirmUndoOpen(false);
      setEventToUndo(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Nem sikerült visszavonni az eseményt');
      }
    } finally {
      setUndoLoading(false);
    }
  };

  const handleRemoveEvent = async (eventId: number) => {
    setUndoLoading(true);
    try {
      await apiService.removeEvent(matchId, eventId);
      await loadMatch(); // Refresh match data
      setUndoModalOpen(false);
      setConfirmUndoOpen(false);
      setEventToUndo(null);
      setError(''); // Clear any previous errors
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Nem sikerült törölni az eseményt');
      }
    } finally {
      setUndoLoading(false);
    }
  };

  const handleOpenUndoModal = async () => {
    await loadUndoableEvents();
    setUndoModalOpen(true);
  };

  const handleConfirmRemoveEvent = (eventId: number) => {
    setEventToUndo(eventId);
    setConfirmUndoOpen(true);
  };

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
          {/* Undo Controls */}
          {match && match.events.length > 0 && currentMatchStatus !== 'finished' && (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleUndoLastEvent}
                disabled={undoLoading}
                title="Utolsó esemény visszavonása"
              >
                <UndoIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                onClick={handleOpenUndoModal}
                title="Események kezelése"
              >
                <RestoreIcon />
              </IconButton>
            </>
          )}
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
                  onTimingUpdate={handleTimingUpdate}
                  onStartSecondHalf={() => handleMatchAction('start-second-half')}
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
              {currentMatchStatus === 'not_started' && (
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
              
              {(currentMatchStatus === 'first_half' || (currentMatchStatus === 'extra_time' && currentMatchHalf === 1)) && (
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

              {/* Start second half button is now handled by the timer component during half_time */}
              
              {(currentMatchStatus === 'second_half' || (currentMatchStatus === 'extra_time' && currentMatchHalf === 2)) && (
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
              
              {currentMatchStatus !== 'not_started' && currentMatchStatus !== 'finished' && (
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
        {/* Show event buttons only when match is actually running (not during half_time or before start) */}
        {currentMatchStatus !== 'not_started' && currentMatchStatus !== 'finished' && currentMatchStatus !== 'half_time' && (
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
                      disabled={true}
                      sx={{
                        backgroundColor: '#03a9f4',
                        '&:hover': { backgroundColor: '#0288d1' },
                        '&:disabled': { backgroundColor: '#666', color: '#999' },
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
                      disabled={true}
                      sx={{
                        backgroundColor: '#03a9f4',
                        '&:hover': { backgroundColor: '#0288d1' },
                        '&:disabled': { backgroundColor: '#666', color: '#999' },
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

                    // Helper function to format event time display
                    const formatEventTimeDisplay = (event: any) => {
                      // If formatted_time is available, use it (preferred)
                      if (event.formatted_time) {
                        return event.formatted_time;
                      }
                      
                      // Fallback: construct from minute and minute_extra_time
                      if (event.minute_extra_time && event.minute_extra_time > 0) {
                        return `${event.minute}+${event.minute_extra_time}'`;
                      }
                      
                      // Default: just the minute
                      return `${event.minute}'`;
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
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
                            {/* Undo button for individual events */}
                            {currentMatchStatus !== 'finished' && ['goal', 'yellow_card', 'red_card'].includes(event.event_type) && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirmRemoveEvent(event.id);
                                }}
                                disabled={undoLoading}
                                sx={{
                                  color: '#ef4444',
                                  '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                                  }
                                }}
                                title="Esemény törlése"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                            <Typography variant="body2" sx={{ 
                              color: getEventColor(event.event_type),
                              fontWeight: 'bold'
                            }}>
                              {formatEventTimeDisplay(event)}
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
            <Box>
              <Typography variant="body2" color="text.secondary">
                {pendingEvent.type === 'goal' ? 'Gól' : 
                 pendingEvent.type === 'yellow_card' ? 'Sárga lap' : 
                 pendingEvent.type === 'red_card' ? 'Piros lap' : 
                 pendingEvent.type === 'substitution' ? 'Csere' : 
                 pendingEvent.type} - {pendingEvent.minute_extra_time > 0 
                   ? `${pendingEvent.minute}+${pendingEvent.minute_extra_time}` 
                   : pendingEvent.minute}. perc
              </Typography>
              {(pendingEvent.type === 'yellow_card' || pendingEvent.type === 'red_card') && (
                <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5 }}>
                  A játékosok korábbi lapjait lásd alul jelezve
                </Typography>
              )}
            </Box>
          )}
        </DialogTitle>
        
        <DialogContent>
          <List>
            {selectedTeamPlayers.map((player) => {
              const yellowCards = getPlayerYellowCardCount(player.id);
              const redCards = getPlayerRedCardCount(player.id);
              const isDisabled = actionLoading === 'event' || isPlayerSentOff(player.id);
              
              return (
                <ListItem key={player.id} disablePadding>
                  <ListItemButton 
                    onClick={() => handlePlayerSelect(player.id)}
                    disabled={isDisabled}
                    sx={{
                      opacity: redCards > 0 ? 0.6 : 1,
                      backgroundColor: redCards > 0 ? 'error.dark' : 'transparent'
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">
                            {player.name}
                          </Typography>
                          {yellowCards > 0 && (
                            <Chip 
                              size="small" 
                              label={`${yellowCards} sárga`}
                              sx={{ 
                                backgroundColor: '#ffa726',
                                color: 'black',
                                fontSize: '0.75rem',
                                height: '20px'
                              }}
                            />
                          )}
                          {redCards > 0 && (
                            <Chip 
                              size="small" 
                              label="Kiállítva"
                              sx={{ 
                                backgroundColor: '#e53935',
                                color: 'white',
                                fontSize: '0.75rem',
                                height: '20px'
                              }}
                            />
                          )}
                          {yellowCards === 1 && pendingEvent?.type === 'yellow_card' && (
                            <Chip 
                              size="small" 
                              label="2. sárga = piros!"
                              sx={{ 
                                backgroundColor: '#ff9800',
                                color: 'black',
                                fontSize: '0.7rem',
                                height: '20px',
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          {player.csk && (
                            <Typography variant="caption" color="primary">
                              Csapatkapitány
                            </Typography>
                          )}
                          {redCards > 0 && (
                            <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                              Játékos már kiállítva
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    {player.csk && (
                      <Badge color="primary" variant="dot" sx={{ mr: 1 }} />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
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

      {/* Second Yellow Card Modal */}
      <SecondYellowCardModal 
        open={secondYellowCardModalOpen}
        player={pendingSecondYellowPlayer}
        minute={pendingEvent?.minute || currentMatchMinute}
        half={pendingEvent?.half || currentMatchHalf}
        onClose={handleSecondYellowCardClose}
        onYellowCard={handleSecondYellowCardYellow}
        onRedCard={handleSecondYellowCardRed}
        loading={actionLoading === 'event'}
      />

      {/* Undo Events Modal */}
      <Dialog 
        open={undoModalOpen} 
        onClose={() => setUndoModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Események kezelése
          <Typography variant="body2" color="text.secondary">
            Válassza ki a törölni kívánt eseményt
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {undoableEvents.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              Nincsenek törölhető események
            </Typography>
          ) : (
            <List>
              {undoableEvents.map((event) => (
                <ListItem 
                  key={event.id} 
                  disablePadding
                  sx={{
                    border: '1px solid',
                    borderColor: event.can_undo ? 'divider' : 'error.main',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: event.can_undo ? 'transparent' : 'error.dark'
                  }}
                >
                  <ListItemButton 
                    onClick={() => event.can_undo && handleConfirmRemoveEvent(event.id)}
                    disabled={!event.can_undo || undoLoading}
                  >
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {event.event_type === 'goal' ? 'GÓL' : 
                             event.event_type === 'yellow_card' ? 'SÁRGA LAP' : 
                             event.event_type === 'red_card' ? 'PIROS LAP' : 
                             event.event_type.toUpperCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.minute}. perc
                          </Typography>
                          {event.player_name && (
                            <Typography variant="body2" color="text.secondary">
                              - {event.player_name}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        !event.can_undo && event.cannot_undo_reasons.length > 0 ? (
                          <Typography variant="caption" color="error.main">
                            Nem törölhető: {event.cannot_undo_reasons.join(', ')}
                          </Typography>
                        ) : undefined
                      }
                    />
                    {event.can_undo && (
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmRemoveEvent(event.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setUndoModalOpen(false)}>
            Bezárás
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Event Removal Modal */}
      <Dialog 
        open={confirmUndoOpen} 
        onClose={() => setConfirmUndoOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Esemény törlése
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Biztosan törölni szeretné ezt az eseményt?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ez a művelet nem visszavonható. Az esemény véglegesen törlődik a mérkőzésből.
          </Typography>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setConfirmUndoOpen(false)}>
            Mégse
          </Button>
          <Button 
            onClick={() => {
              if (eventToUndo === 'last') {
                performUndoLastEvent();
              } else if (eventToUndo) {
                handleRemoveEvent(eventToUndo);
              }
            }}
            variant="contained"
            color="error"
            disabled={undoLoading}
          >
            Igen, törlöm
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
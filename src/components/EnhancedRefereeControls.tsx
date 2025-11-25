'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Timer as TimerIcon,
  SportsScore as GoalIcon,
  Warning as CardIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import EnhancedEventForm from './EnhancedEventForm';
import TimeInput from './TimeInput';
import { formatEventTime } from '@/utils/dataUtils';
import { matchService } from '@/services/apiService';
import type { Player, Team, MatchEvent, MatchStatusChoice } from '@/types/api';

interface EnhancedRefereeControlsProps {
  matchId: number;
  players: Player[];
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  events: MatchEvent[];
  currentMinute?: number;
  currentExtraTime?: number; // NEW: Current extra time from backend
  half?: number;
  onEventAdded: () => void;
  onMatchTimeUpdate?: (minute: number, extraTime?: number | null, half?: number) => void;
  onMatchStatusUpdate?: () => void; // NEW: Callback when match status is updated
  currentStatus?: 'active' | 'cancelled_new_date' | 'cancelled_no_date' | null; // NEW: Current match status
  authToken?: string; // NEW: Auth token for status updates
}

const EnhancedRefereeControls: React.FC<EnhancedRefereeControlsProps> = ({
  matchId,
  players,
  homeTeam,
  awayTeam,
  events,
  currentMinute = 1,
  currentExtraTime,
  half = 1,
  onEventAdded,
  onMatchTimeUpdate,
  onMatchStatusUpdate,
  currentStatus = 'active',
  authToken
}) => {
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<'goal' | 'yellow_card' | 'red_card' | 'general' | null>(null);
  const [displayMinute, setDisplayMinute] = useState(currentMinute);
  const [displayExtraTime, setDisplayExtraTime] = useState<number | null>(null);
  const [displayHalf, setDisplayHalf] = useState(half);

  // NEW: Status management state
  const [matchStatus, setMatchStatus] = useState<string>(currentStatus || 'active');
  const [statusChoices, setStatusChoices] = useState<MatchStatusChoice[]>([]);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(null);

  // Load status choices on mount
  useEffect(() => {
    const loadStatusChoices = async () => {
      try {
        const response = await matchService.getStatusChoices();
        setStatusChoices(response.choices || []);
      } catch (error) {
        console.error('Failed to load status choices:', error);
      }
    };
    loadStatusChoices();
  }, []);

  // Update local status when prop changes
  useEffect(() => {
    if (currentStatus) {
      setMatchStatus(currentStatus);
    }
  }, [currentStatus]);

  const openEventForm = (eventType: 'goal' | 'yellow_card' | 'red_card' | 'general' | null = null) => {
    setSelectedEventType(eventType);
    setEventFormOpen(true);
  };

  const handleEventAdded = () => {
    onEventAdded();
    setEventFormOpen(false);
  };

  const handleTimeUpdate = (minute: number, extraTime?: number | null) => {
    setDisplayMinute(minute);
    setDisplayExtraTime(extraTime || null);
    if (onMatchTimeUpdate) {
      onMatchTimeUpdate(minute, extraTime || null, displayHalf);
    }
  };

  const handleHalfChange = (newHalf: number) => {
    setDisplayHalf(newHalf);
    if (onMatchTimeUpdate) {
      onMatchTimeUpdate(displayMinute, displayExtraTime, newHalf);
    }
  };

  // NEW: Handle match status update
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setMatchStatus(event.target.value);
  };

  const handleStatusUpdate = async () => {
    if (!authToken) {
      setStatusUpdateError('Nincs érvényes bejelentkezés. Kérjük, jelentkezzen be újra.');
      return;
    }

    setStatusUpdateLoading(true);
    setStatusUpdateError(null);
    setStatusUpdateSuccess(null);

    try {
      await matchService.updateStatusReferee(
        matchId,
        { status: matchStatus as 'active' | 'cancelled_new_date' | 'cancelled_no_date' },
        authToken
      );
      
      setStatusUpdateSuccess('Mérkőzés státusza sikeresen frissítve!');
      
      if (onMatchStatusUpdate) {
        onMatchStatusUpdate();
      }
    } catch (error: any) {
      console.error('Failed to update match status:', error);
      setStatusUpdateError(
        error.message || 'Hiba történt a státusz frissítése során. Kérjük, próbálja újra.'
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Get Hungarian label for status
  const getStatusLabel = (status: string): string => {
    const choice = statusChoices.find(c => c.value === status);
    return choice?.label || status;
  };

  // Get recent events for context
  const recentEvents = events
    .slice(-5)
    .reverse()
    .map(event => ({
      ...event,
      displayTime: event.formatted_time || formatEventTime(event.minute, event.minute_extra_time)
    }));

  return (
    <Box sx={{ p: 2 }}>
      {/* Match Status Management */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          backgroundColor: '#1e1e1e',
          border: '1px solid #404040'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventNoteIcon />
          Mérkőzés Státusza
        </Typography>

        {/* Status Update Success/Error Messages */}
        {statusUpdateSuccess && (
          <Alert severity="success" onClose={() => setStatusUpdateSuccess(null)} sx={{ mb: 2 }}>
            {statusUpdateSuccess}
          </Alert>
        )}
        
        {statusUpdateError && (
          <Alert severity="error" onClose={() => setStatusUpdateError(null)} sx={{ mb: 2 }}>
            {statusUpdateError}
          </Alert>
        )}

        {/* Status Selector */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="match-status-label">Mérkőzés Státusza</InputLabel>
          <Select
            labelId="match-status-label"
            id="match-status"
            value={matchStatus}
            label="Mérkőzés Státusza"
            onChange={handleStatusChange}
            disabled={statusUpdateLoading}
          >
            {statusChoices.map((choice) => (
              <MenuItem key={choice.value} value={choice.value}>
                {choice.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Update Button */}
        <Button
          variant="contained"
          onClick={handleStatusUpdate}
          disabled={statusUpdateLoading || matchStatus === currentStatus}
          fullWidth
          sx={{ mb: 1 }}
        >
          {statusUpdateLoading ? 'Frissítés...' : 'Státusz Frissítése'}
        </Button>

        {/* Current Status Display */}
        {matchStatus !== 'active' && (
          <Alert 
            severity={matchStatus === 'cancelled_no_date' ? 'error' : 'warning'}
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {matchStatus === 'cancelled_new_date' && '⚠ Ez a mérkőzés elhalasztásra került'}
              {matchStatus === 'cancelled_no_date' && '✗ Ez a mérkőzés törölve lett'}
            </Typography>
            <Typography variant="caption">
              {matchStatus === 'cancelled_new_date' && 'Az új időpont hamarosan közzétételre kerül.'}
              {matchStatus === 'cancelled_no_date' && 'Ez a mérkőzés véglegesen lemondásra került.'}
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Current Match Time */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          backgroundColor: '#1e1e1e',
          border: '1px solid #404040'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon />
          Referee Controls
        </Typography>

        {/* Time Input */}
        <Box sx={{ mb: 2 }}>
          <TimeInput
            minute={displayMinute}
            extraTime={displayExtraTime}
            onChange={handleTimeUpdate}
            currentMinute={currentMinute}
            currentExtraTime={currentExtraTime}
            half={displayHalf}
            label="Current Match Time"
            size="small"
          />
        </Box>

        {/* Half Selection */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant={displayHalf === 1 ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleHalfChange(1)}
          >
            1st Half
          </Button>
          <Button
            variant={displayHalf === 2 ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleHalfChange(2)}
          >
            2nd Half
          </Button>
        </Box>

        {/* Current Time Display */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 2,
            backgroundColor: '#2d2d2d',
            borderRadius: 2,
            border: '2px solid #4caf50'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            {formatEventTime(displayMinute, displayExtraTime)}
          </Typography>
          <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
            {displayHalf === 1 ? '1st Half' : '2nd Half'}
          </Typography>
        </Box>
      </Paper>

      {/* Quick Action Buttons */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          backgroundColor: '#1e1e1e',
          border: '1px solid #404040'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<GoalIcon />}
            onClick={() => openEventForm('goal')}
            sx={{ 
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Goal
          </Button>
          
          <Button
            variant="contained"
            startIcon={<CardIcon />}
            onClick={() => openEventForm('yellow_card')}
            sx={{ 
              backgroundColor: '#ff9800',
              '&:hover': { backgroundColor: '#f57c00' }
            }}
          >
            Yellow
          </Button>
          
          <Button
            variant="contained"
            startIcon={<CardIcon />}
            onClick={() => openEventForm('red_card')}
            sx={{ 
              backgroundColor: '#f44336',
              '&:hover': { backgroundColor: '#d32f2f' }
            }}
          >
            Red
          </Button>
        </Stack>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openEventForm('general')}
          fullWidth
        >
          Add Other Event
        </Button>
      </Paper>

      {/* Recent Events */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          backgroundColor: '#1e1e1e',
          border: '1px solid #404040'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Events
        </Typography>
        
        {recentEvents.length > 0 ? (
          <Stack spacing={1}>
            {recentEvents.map((event, index) => (
              <Box 
                key={event.id || index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 1,
                  backgroundColor: '#2d2d2d',
                  borderRadius: 1,
                  border: '1px solid #404040'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={event.displayTime}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body2">
                    {event.event_type === 'goal' && '⚽'}
                    {event.event_type === 'yellow_card' && '🟨'}
                    {event.event_type === 'red_card' && '🟥'}
                    {event.event_type === 'match_start' && '🏁'}
                    {event.event_type === 'half_time' && '⏸️'}
                    {event.event_type === 'full_time' && '🏁'}
                    {' '}
                    {event.event_type.replace('_', ' ').toUpperCase()}
                  </Typography>
                </Box>
                
                {event.playerName && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {event.playerName}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
            No events yet
          </Typography>
        )}
      </Paper>

      {/* Enhanced Event Form Dialog */}
      <EnhancedEventForm
        open={eventFormOpen}
        onClose={() => setEventFormOpen(false)}
        onEventAdded={handleEventAdded}
        matchId={matchId}
        players={players}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        currentMinute={displayMinute}
        currentExtraTime={currentExtraTime}
        half={displayHalf}
        eventType={selectedEventType}
      />
    </Box>
  );
};

export default EnhancedRefereeControls;
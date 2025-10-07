'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Timer as TimerIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';

interface RefereeMatchTimerProps {
  _matchId: string;
  status: string;
  events: any[];
  onExtraTimeAdded?: (minutes: number, half: number) => void;
  onCurrentMinuteChange?: (minute: number, half: number) => void;
  onStatusChange?: (status: string) => void;
  onTimingUpdate?: (minute: number, extraTime: number, half: number) => void;
}

interface TimerState {
  currentMinute: number;
  currentSecond: number;
  currentHalf: number;
  extraTimeMinutes: number;
  status: 'not_started' | 'first_half' | 'half_time' | 'second_half' | 'extra_time' | 'finished';
  isRunning: boolean;
  matchStartTime: Date | null;
  halfStartTime: Date | null;
}

const RefereeMatchTimer: React.FC<RefereeMatchTimerProps> = ({
  _matchId,
  status: _status, // Not used in calculation, events determine state
  events,
  onExtraTimeAdded,
  onCurrentMinuteChange,
  onStatusChange,
  onTimingUpdate
}) => {
  const [timerState, setTimerState] = useState<TimerState>({
    currentMinute: 1, // Start at minute 1, never 0
    currentSecond: 0,
    currentHalf: 1,
    extraTimeMinutes: 0,
    status: 'not_started',
    isRunning: false,
    matchStartTime: null,
    halfStartTime: null,
  });

  const [extraTimeDialogOpen, setExtraTimeDialogOpen] = useState(false);
  const [extraTimeInput, setExtraTimeInput] = useState('');
  const [selectedHalf, setSelectedHalf] = useState<1 | 2>(1);

  // Initialize timer state from match events (removed dependency on status prop)
  const initializeTimer = useCallback(() => {
    console.log('🔄 RefereeMatchTimer: Starting initialization...');
    console.log('🔍 Available events:', events);

    if (!events || events.length === 0) {
      console.log('⚠️ No events available');
      setTimerState({
        currentMinute: 1,
        currentSecond: 0,
        currentHalf: 1,
        extraTimeMinutes: 0,
        status: 'not_started',
        isRunning: false,
        matchStartTime: null,
        halfStartTime: null,
      });
      return;
    }

    // Sort events by exact time (same as ImprovedLiveMatchTimer)
    const sortedEvents = [...events].sort((a, b) => {
      if (a.exact_time && b.exact_time) {
        return new Date(a.exact_time).getTime() - new Date(b.exact_time).getTime();
      }
      // Fallback to minute sorting if no exact time
      return (a.minute || 0) - (b.minute || 0);
    });

    const matchStartEvent = sortedEvents.find(e => e.event_type === 'match_start');
    const halfTimeEvent = sortedEvents.find(e => e.event_type === 'half_time');
    // Use the same detection logic as ImprovedLiveMatchTimer
    const secondHalfStartEvent = sortedEvents.find(e => 
      (e.half === 2 && e.minute > 10)
    );
    const matchEndEvent = sortedEvents.find(e => e.event_type === 'match_end' || e.event_type === 'full_time');
    const extraTimeEvents = sortedEvents.filter(e => e.event_type === 'extra_time');

    console.log('🔍 Key events found:', {
      matchStart: !!matchStartEvent,
      halfTime: !!halfTimeEvent,
      secondHalfStart: !!secondHalfStartEvent,
      matchEnd: !!matchEndEvent,
      secondHalfEvent: secondHalfStartEvent
    });

    const baseState: TimerState = {
      currentMinute: 1, // Start at minute 1, never 0
      currentSecond: 0,
      currentHalf: 1,
      extraTimeMinutes: 0,
      status: 'not_started',
      isRunning: false,
      matchStartTime: null,
      halfStartTime: null,
    };

    let newState = { ...baseState };

    // If match hasn't started
    if (!matchStartEvent || !matchStartEvent.exact_time) {
      console.log('⚠️ No match start event with exact_time');
      setTimerState(newState);
      return;
    }

    // If match has ended
    if (matchEndEvent) {
      console.log('⚠️ Match has ended');
      newState = {
        ...newState,
        status: 'finished',
        currentMinute: matchEndEvent.minute || 20,
        currentHalf: matchEndEvent.half || 2,
        isRunning: false
      };
      setTimerState(newState);
      return;
    }

    // Set match start time
    newState = {
      ...newState,
      matchStartTime: new Date(matchStartEvent.exact_time)
    };

    // Check if currently at half time (CRITICAL: same logic as ImprovedLiveMatchTimer)
    if (halfTimeEvent && !secondHalfStartEvent) {
      console.log('📅 Currently at half time');
      newState = {
        ...newState,
        status: 'half_time',
        currentHalf: 1,
        currentMinute: 10,
        isRunning: false // Pause during half time
      };
    } else if (secondHalfStartEvent && secondHalfStartEvent.exact_time) {
      console.log('⚽ Second half has started');
      newState = {
        ...newState,
        halfStartTime: new Date(secondHalfStartEvent.exact_time),
        currentHalf: 2,
        status: 'second_half',
        isRunning: true // Running in second half
      };
    } else {
      console.log('⚽ First half active');
      newState = {
        ...newState,
        currentHalf: 1,
        status: 'first_half',
        isRunning: true // Running in first half
      };
    }

    // Get total extra time minutes for current half
    const currentHalfExtraTime = extraTimeEvents
      .filter(e => e.half === newState.currentHalf)
      .reduce((total, e) => total + (e.extra_time || 0), 0);
    
    newState = {
      ...newState,
      extraTimeMinutes: currentHalfExtraTime
    };

    console.log('🔄 RefereeMatchTimer: Final timer state:', newState);
    setTimerState(newState);
    
    // Notify parent component of status change
    if (onStatusChange) {
      onStatusChange(newState.status);
    }
  }, [events, onStatusChange]); // Removed status dependency

  // Calculate current time
  const updateCurrentTime = useCallback(() => {
    if (!timerState.isRunning || !timerState.matchStartTime) return;

    const now = new Date();
    let referenceTime = timerState.matchStartTime;
    let baseMinutes = 0;

    // If in second half, use half start time and add 10 minutes for the first half
    if (timerState.currentHalf === 2 && timerState.halfStartTime) {
      referenceTime = timerState.halfStartTime;
      baseMinutes = 10; // First half completed (10 minutes)
    }

    const elapsed = now.getTime() - referenceTime.getTime();
    const elapsedSeconds = Math.floor(elapsed / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const remainingSeconds = elapsedSeconds % 60;

    const totalMinutes = baseMinutes + elapsedMinutes;
    let displayMinute = totalMinutes + 1; // Football starts at minute 1

    // Ensure we start second half at minute 11 (same as ImprovedLiveMatchTimer)
    if (timerState.currentHalf === 2 && displayMinute < 11) {
      displayMinute = 11;
    }

    console.log('⏱️ Timer update:', {
      currentHalf: timerState.currentHalf,
      baseMinutes,
      elapsedMinutes,
      displayMinute,
      isRunning: timerState.isRunning
    });

    setTimerState(prev => ({
      ...prev,
      currentMinute: displayMinute,
      currentSecond: remainingSeconds
    }));

    // Notify parent component of minute change
    if (onCurrentMinuteChange) {
      onCurrentMinuteChange(displayMinute, timerState.currentHalf);
    }

    // Notify parent component of timing details for proper event logging
    if (onTimingUpdate) {
      const { currentMinute, currentHalf, extraTimeMinutes } = timerState;
      
      // Calculate base minute and extra time
      let baseMinute = currentMinute;
      let extraTime = 0;
      
      if (currentHalf === 1 && currentMinute > 10) {
        baseMinute = 10;
        extraTime = extraTimeMinutes > 0 ? extraTimeMinutes : currentMinute - 10;
      } else if (currentHalf === 2 && currentMinute > 20) {
        baseMinute = 20;
        extraTime = extraTimeMinutes > 0 ? extraTimeMinutes : currentMinute - 20;
      }
      
      onTimingUpdate(baseMinute, extraTime, currentHalf);
    }
  }, [timerState, onCurrentMinuteChange, onTimingUpdate]);

  // Update timer every second
  useEffect(() => {
    if (timerState.isRunning) {
      const interval = setInterval(updateCurrentTime, 1000);
      return () => clearInterval(interval);
    }
  }, [timerState.isRunning, updateCurrentTime]);

  // Also reinitialize when events change (like ImprovedLiveMatchTimer)
  useEffect(() => {
    initializeTimer();
  }, [initializeTimer]);

  // Additional effect to handle live updates (reinitialize periodically)
  useEffect(() => {
    if (timerState.status === 'first_half' || timerState.status === 'second_half' || timerState.status === 'half_time') {
      const interval = setInterval(() => {
        console.log('🔄 Periodic reinitialization for live updates');
        initializeTimer();
      }, 5000); // Reinitialize every 5 seconds to catch new events
      return () => clearInterval(interval);
    }
  }, [timerState.status, initializeTimer]);

  const handleAddExtraTime = () => {
    const minutes = parseInt(extraTimeInput);
    if (minutes > 0 && onExtraTimeAdded) {
      onExtraTimeAdded(minutes, selectedHalf);
      setTimerState(prev => ({
        ...prev,
        extraTimeMinutes: prev.extraTimeMinutes + minutes
      }));
    }
    setExtraTimeDialogOpen(false);
    setExtraTimeInput('');
  };

  const getDisplayMinute = () => {
    const { currentMinute, currentHalf, extraTimeMinutes } = timerState;
    
    // First half logic (0-10 minutes)
    if (currentHalf === 1) {
      if (currentMinute <= 10) {
        return currentMinute;
      } else {
        // First half injury time
        const injuryTime = currentMinute - 10;
        return extraTimeMinutes > 0 ? `10+${extraTimeMinutes}` : `10+${injuryTime}`;
      }
    }
    
    // Second half logic (11-20 minutes)
    if (currentHalf === 2) {
      if (currentMinute <= 20) {
        return currentMinute;
      } else {
        // Second half injury time
        const injuryTime = currentMinute - 20;
        return extraTimeMinutes > 0 ? `20+${extraTimeMinutes}` : `20+${injuryTime}`;
      }
    }
    
    return currentMinute;
  };

  const getStatusColor = () => {
    switch (timerState.status) {
      case 'not_started': return 'default';
      case 'first_half': case 'second_half': return 'success';
      case 'half_time': return 'warning';
      case 'finished': return 'error';
      case 'extra_time': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusText = () => {
    switch (timerState.status) {
      case 'not_started': return 'Nincs elkezdve';
      case 'first_half': return 'Első félidő';
      case 'second_half': return 'Második félidő';
      case 'half_time': return 'Félidő';
      case 'finished': return 'Vége';
      case 'extra_time': return 'Hosszabbítás';
      default: return 'Ismeretlen';
    }
  };

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, '0');
  };

  return (
    <Box>
      {/* Main Timer Display */}
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        {/* Match Status */}
        <Chip 
          label={getStatusText()}
          color={getStatusColor()}
          size="small"
          sx={{ fontWeight: 600 }}
        />

        {/* Minute Counter or Half-Time Indicator */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          px: 2,
          py: 1,
          backgroundColor: timerState.status === 'half_time' ? 'warning.main' : 'action.hover',
          borderRadius: 2,
          color: timerState.status === 'half_time' ? 'warning.contrastText' : 'inherit'
        }}>
          {timerState.status === 'half_time' ? (
            <>
              <PauseIcon sx={{ fontSize: 20 }} />
              <Typography variant="h6" fontWeight="bold">
                HT
              </Typography>
            </>
          ) : (
            <>
              <TimerIcon sx={{ fontSize: 20 }} />
              <Typography variant="h6" fontWeight="bold">
                {getDisplayMinute()}&apos;
              </Typography>
            </>
          )}
        </Box>

        {/* Precise Timer (Seconds) - Hidden during half-time */}
        {timerState.isRunning && timerState.status !== 'half_time' && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 1,
            minWidth: 60,
            justifyContent: 'center'
          }}>
            <Typography variant="body2" fontWeight="bold">
              :{formatTime(timerState.currentSecond)}
            </Typography>
          </Box>
        )}

        {/* Extra Time Controls */}
        {(timerState.status === 'first_half' || timerState.status === 'second_half') && (
          <IconButton 
            size="small"
            onClick={() => setExtraTimeDialogOpen(true)}
            sx={{ 
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              '&:hover': { bgcolor: 'warning.dark' }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        )}

        {/* Running/Pause Indicator */}
        {timerState.status === 'half_time' ? (
          <PauseIcon sx={{ 
            color: 'warning.main',
            fontSize: 24,
          }} />
        ) : timerState.isRunning ? (
          <PlayIcon sx={{ 
            color: 'success.main',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 }
            }
          }} />
        ) : null}
      </Stack>

      {/* Extra Time Information */}
      {timerState.extraTimeMinutes > 0 && (
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Chip 
            label={`+${timerState.extraTimeMinutes} perc hosszabbítás`}
            variant="outlined"
            color="warning"
            size="small"
          />
        </Box>
      )}

      {/* Extra Time Dialog */}
      <Dialog 
        open={extraTimeDialogOpen} 
        onClose={() => setExtraTimeDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Hosszabbítás hozzáadása</DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Hosszabbítás (perc)"
              type="number"
              value={extraTimeInput}
              onChange={(e) => setExtraTimeInput(e.target.value)}
              inputProps={{ min: 1, max: 15 }}
              fullWidth
            />
            
            <TextField
              select
              label="Félidő"
              value={selectedHalf}
              onChange={(e) => setSelectedHalf(Number(e.target.value) as 1 | 2)}
              fullWidth
            >
              <MenuItem value={1}>Első félidő</MenuItem>
              <MenuItem value={2}>Második félidő</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setExtraTimeDialogOpen(false)}>
            Mégse
          </Button>
          <Button 
            onClick={handleAddExtraTime}
            variant="contained"
            disabled={!extraTimeInput || parseInt(extraTimeInput) <= 0}
          >
            Hozzáadás
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RefereeMatchTimer;
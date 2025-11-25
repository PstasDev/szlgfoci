'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import TimeInput from './TimeInput';
import { refereeService } from '@/services/apiService';
import type { QuickGoalRequest, QuickOwnGoalRequest, QuickCardRequest, GeneralEventRequest, Player, Team } from '@/types/api';

interface EnhancedEventFormProps {
  open: boolean;
  onClose: () => void;
  onEventAdded: () => void;
  matchId: number;
  players: Player[];
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  currentMinute?: number;
  currentExtraTime?: number; // NEW: Current extra time from backend
  half?: number;
  eventType?: 'goal' | 'own_goal' | 'yellow_card' | 'red_card' | 'general' | null;
}

const EVENT_TYPES = [
  { value: 'goal', label: '⚽ Goal', color: '#4caf50' },
  { value: 'own_goal', label: '🔴 Own Goal (Öngól)', color: '#cc5346' },
  { value: 'yellow_card', label: '🟨 Yellow Card', color: '#ff9800' },
  { value: 'red_card', label: '🟥 Red Card', color: '#f44336' },
  { value: 'match_start', label: '🏁 Match Start', color: '#2196f3' },
  { value: 'half_time', label: '⏸️ Half Time', color: '#ff9800' },
  { value: 'full_time', label: '🏁 Full Time', color: '#9c27b0' },
  { value: 'extra_time', label: '⏰ Extra Time', color: '#f44336' },
  { value: 'match_end', label: '🔚 Match End', color: '#757575' },
];

const CARD_TYPES = [
  { value: 'yellow', label: 'Yellow Card', color: '#ff9800' },
  { value: 'red', label: 'Red Card', color: '#f44336' },
];

const EnhancedEventForm: React.FC<EnhancedEventFormProps> = ({
  open,
  onClose,
  onEventAdded,
  matchId,
  players,
  homeTeam,
  awayTeam,
  currentMinute = 1,
  currentExtraTime,
  half = 1,
  eventType = null
}) => {
  const [selectedEventType, setSelectedEventType] = useState<string>(eventType || 'goal');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [minute, setMinute] = useState<number>(currentMinute);
  const [extraTime, setExtraTime] = useState<number | null>(null);
  const [selectedHalf, setSelectedHalf] = useState<number>(half);
  const [cardType, setCardType] = useState<'yellow' | 'red'>('yellow');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Filter players by team for better UX
  const homePlayers = players.filter(p => 
    homeTeam?.players?.some(hp => hp.id === p.id)
  );
  const awayPlayers = players.filter(p => 
    awayTeam?.players?.some(ap => ap.id === p.id)
  );

  const handleClose = () => {
    setError('');
    setSelectedPlayer(null);
    setSelectedEventType(eventType || 'goal');
    setMinute(currentMinute);
    setExtraTime(null);
    setSelectedHalf(half);
    setCardType('yellow');
    onClose();
  };

  const handleTimeChange = (newMinute: number, newExtraTime?: number | null) => {
    setMinute(newMinute);
    setExtraTime(newExtraTime || null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (['goal', 'own_goal', 'yellow_card', 'red_card'].includes(selectedEventType) && !selectedPlayer) {
        throw new Error('Player is required for this event type');
      }

      // Prepare request based on event type
      if (selectedEventType === 'goal') {
        const goalData: QuickGoalRequest = {
          player_id: selectedPlayer!.id!,
          minute,
          minute_extra_time: extraTime,
          half: selectedHalf
        };

        await refereeService.addQuickGoal(matchId, goalData);
      } else if (selectedEventType === 'own_goal') {
        const ownGoalData: QuickOwnGoalRequest = {
          player_id: selectedPlayer!.id!,
          minute,
          minute_extra_time: extraTime,
          half: selectedHalf
        };

        await refereeService.addQuickOwnGoal(matchId, ownGoalData);
      } else if (selectedEventType === 'yellow_card' || selectedEventType === 'red_card') {
        const cardData: QuickCardRequest = {
          player_id: selectedPlayer!.id!,
          minute,
          minute_extra_time: extraTime,
          card_type: selectedEventType === 'yellow_card' ? 'yellow' : 'red',
          half: selectedHalf
        };

        await refereeService.addQuickCard(matchId, cardData);
      } else {
        // General event
        const eventData: GeneralEventRequest = {
          event_type: selectedEventType,
          minute,
          minute_extra_time: extraTime,
          half: selectedHalf,
          player_id: selectedPlayer?.id || null
        };

        await refereeService.addEvent(matchId, eventData);
      }

      // Success - close form and refresh data
      onEventAdded();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add event');
    } finally {
      setLoading(false);
    }
  };

  const needsPlayer = ['goal', 'own_goal', 'yellow_card', 'red_card'].includes(selectedEventType);
  const selectedEventInfo = EVENT_TYPES.find(et => et.value === selectedEventType);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#2d2d2d',
          color: '#e8eaed'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon />
          <Typography variant="h6">Add Match Event</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Event Type Selection */}
          <FormControl fullWidth>
            <InputLabel>Event Type</InputLabel>
            <Select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              label="Event Type"
            >
              {EVENT_TYPES.map((et) => (
                <MenuItem key={et.value} value={et.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: et.color }}>{et.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Time Input */}
          <TimeInput
            minute={minute}
            extraTime={extraTime}
            onChange={handleTimeChange}
            currentMinute={currentMinute}
            currentExtraTime={currentExtraTime}
            half={selectedHalf}
            label="Event Time"
            required
            helperText="Enter the minute when the event occurred"
          />

          {/* Half Selection */}
          <FormControl fullWidth>
            <InputLabel>Half</InputLabel>
            <Select
              value={selectedHalf}
              onChange={(e) => setSelectedHalf(Number(e.target.value))}
              label="Half"
            >
              <MenuItem value={1}>First Half</MenuItem>
              <MenuItem value={2}>Second Half</MenuItem>
            </Select>
          </FormControl>

          {/* Player Selection (if needed) */}
          {needsPlayer && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Select Player
              </Typography>
              <Autocomplete
                value={selectedPlayer}
                onChange={(_, newValue) => setSelectedPlayer(newValue)}
                options={players}
                getOptionLabel={(player) => player.name}
                groupBy={(player) => {
                  if (homePlayers.some(hp => hp.id === player.id)) {
                    return homeTeam?.name || homeTeam?.tagozat || 'Home Team';
                  }
                  if (awayPlayers.some(ap => ap.id === player.id)) {
                    return awayTeam?.name || awayTeam?.tagozat || 'Away Team';
                  }
                  return 'Other';
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Player"
                    required
                    error={needsPlayer && !selectedPlayer}
                    helperText={needsPlayer && !selectedPlayer ? 'Player is required' : ''}
                  />
                )}
                renderOption={(props, player) => (
                  <Box component="li" {...props}>
                    <Typography>
                      {player.name}
                      {player.csk && (
                        <Typography 
                          component="span" 
                          sx={{ ml: 1, color: 'warning.main', fontSize: '0.875rem' }}
                        >
                          (C)
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                )}
                sx={{
                  '& .MuiAutocomplete-paper': {
                    backgroundColor: '#2d2d2d'
                  }
                }}
              />
            </Box>
          )}

          {/* Card Type (for cards) */}
          {(selectedEventType === 'yellow_card' || selectedEventType === 'red_card') && (
            <FormControl fullWidth>
              <InputLabel>Card Type</InputLabel>
              <Select
                value={cardType}
                onChange={(e) => setCardType(e.target.value as 'yellow' | 'red')}
                label="Card Type"
              >
                {CARD_TYPES.map((ct) => (
                  <MenuItem key={ct.value} value={ct.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: ct.color }}>{ct.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Event Preview */}
          {selectedEventInfo && (
            <Box 
              sx={{ 
                p: 2, 
                backgroundColor: '#1e1e1e', 
                borderRadius: 2,
                border: `1px solid ${selectedEventInfo.color}20`
              }}
            >
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                Event Preview:
              </Typography>
              <Typography variant="body1" sx={{ color: selectedEventInfo.color, fontWeight: 600 }}>
                {selectedEventInfo.label}
                {selectedPlayer && ` - ${selectedPlayer.name}`}
                {` at ${minute}${extraTime ? `+${extraTime}` : ''}'`}
                {` (${selectedHalf === 1 ? 'First' : 'Second'} Half)`}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || (needsPlayer && !selectedPlayer)}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? 'Adding...' : 'Add Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnhancedEventForm;
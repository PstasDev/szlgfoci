// Enhanced event display component that supports all event types
import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Paper,
} from '@mui/material';
import {
  SportsScore as GoalIcon,
  Warning as YellowCardIcon,
  Block as RedCardIcon,
  PlayArrow as StartIcon,
  Pause as HalfTimeIcon,
  Stop as EndIcon,
  Timer as ExtraTimeIcon,
  Flag as FullTimeIcon,
} from '@mui/icons-material';
import type { EnhancedEventSchema, Team } from '@/types/api';
import { getTeamColor } from '@/utils/dataUtils';

interface EnhancedEventDisplayProps {
  event: EnhancedEventSchema;
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  variant?: 'compact' | 'detailed' | 'timeline';
  legacyTeam?: 'home' | 'away'; // For backward compatibility with legacy events
}

const EnhancedEventDisplay: React.FC<EnhancedEventDisplayProps> = ({
  event,
  homeTeam,
  awayTeam,
  variant = 'compact',
  legacyTeam
}) => {
  // Get event type info
  const getEventInfo = (eventType: string) => {
    switch (eventType) {
      case 'match_start':
        return {
          label: 'Kezdőrugás',
          icon: <StartIcon sx={{ color: '#4caf50' }} />,
          emoji: '🚀',
          color: '#4caf50',
          bgColor: 'rgba(76, 175, 80, 0.1)',
          borderColor: 'rgba(76, 175, 80, 0.3)'
        };
      case 'goal':
        return {
          label: 'Gól',
          icon: <GoalIcon sx={{ color: '#4caf50' }} />,
          emoji: '⚽',
          color: '#4caf50',
          bgColor: 'rgba(76, 175, 80, 0.1)',
          borderColor: 'rgba(76, 175, 80, 0.3)'
        };
      case 'yellow_card':
        return {
          label: 'Sárga lap',
          icon: <YellowCardIcon sx={{ color: '#ff9800' }} />,
          emoji: '🟨',
          color: '#ff9800',
          bgColor: 'rgba(255, 152, 0, 0.1)',
          borderColor: 'rgba(255, 152, 0, 0.3)'
        };
      case 'red_card':
        return {
          label: 'Piros lap',
          icon: <RedCardIcon sx={{ color: '#f44336' }} />,
          emoji: '🟥',
          color: '#f44336',
          bgColor: 'rgba(244, 67, 54, 0.1)',
          borderColor: 'rgba(244, 67, 54, 0.3)'
        };
      case 'half_time':
        return {
          label: 'Félidő',
          icon: <HalfTimeIcon sx={{ color: '#ff9800' }} />,
          emoji: '⏸️',
          color: '#ff9800',
          bgColor: 'rgba(255, 152, 0, 0.1)',
          borderColor: 'rgba(255, 152, 0, 0.3)'
        };
      case 'full_time':
        return {
          label: 'Rendes játékidő vége',
          icon: <FullTimeIcon sx={{ color: '#9c27b0' }} />,
          emoji: '🏁',
          color: '#9c27b0',
          bgColor: 'rgba(156, 39, 176, 0.1)',
          borderColor: 'rgba(156, 39, 176, 0.3)'
        };
      case 'extra_time':
        return {
          label: 'Hosszabbítás',
          icon: <ExtraTimeIcon sx={{ color: '#f44336' }} />,
          emoji: '⏰',
          color: '#f44336',
          bgColor: 'rgba(244, 67, 54, 0.1)',
          borderColor: 'rgba(244, 67, 54, 0.3)'
        };
      case 'match_end':
        return {
          label: 'Meccs vége',
          icon: <EndIcon sx={{ color: '#757575' }} />,
          emoji: '🔚',
          color: '#757575',
          bgColor: 'rgba(117, 117, 117, 0.1)',
          borderColor: 'rgba(117, 117, 117, 0.3)'
        };
      default:
        return {
          label: 'Esemény',
          icon: <StartIcon sx={{ color: '#2196f3' }} />,
          emoji: '📋',
          color: '#2196f3',
          bgColor: 'rgba(33, 150, 243, 0.1)',
          borderColor: 'rgba(33, 150, 243, 0.3)'
        };
    }
  };

  // Get display time
  const getDisplayTime = () => {
    const baseMinute = event.minute;
    const extraTime = event.minute_extra_time;
    
    if (extraTime && extraTime > 0) {
      return `${baseMinute}+${extraTime}'`;
    }
    return `${baseMinute}'`;
  };

  // Determine which team (for goals/cards)
  const getPlayerTeam = (): 'home' | 'away' | null => {
    // Use legacy team info if available (for backward compatibility)
    if (legacyTeam) {
      return legacyTeam;
    }
    
    if (!event.player || !homeTeam || !awayTeam) return null;
    
    const isHomePlayer = homeTeam.players?.some(p => p.id === event.player?.id);
    return isHomePlayer ? 'home' : 'away';
  };

  const eventInfo = getEventInfo(event.event_type);
  const playerTeam = getPlayerTeam();
  const teamColor = playerTeam === 'home' ? getTeamColor(homeTeam) : 
                   playerTeam === 'away' ? getTeamColor(awayTeam) : '#9e9e9e';

  // Compact variant for live matches
  if (variant === 'compact') {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 0.5,
        p: 1,
        borderRadius: 1,
        backgroundColor: eventInfo.bgColor,
        border: `1px solid ${eventInfo.borderColor}`
      }}>
        <Box sx={{ fontSize: '16px' }}>{eventInfo.emoji}</Box>
        <Typography variant="body2" sx={{ 
          fontWeight: 600, 
          color: eventInfo.color,
          minWidth: '35px'
        }}>
          {getDisplayTime()}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', flex: 1 }}>
          {eventInfo.label}
          {event.player && (
            <span style={{ fontWeight: 600, marginLeft: 4 }}>
              - {event.player.name}
            </span>
          )}
        </Typography>
        {playerTeam && (
          <Chip
            label={playerTeam === 'home' ? homeTeam?.tagozat : awayTeam?.tagozat}
            size="small"
            sx={{
              backgroundColor: teamColor,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              height: '20px'
            }}
          />
        )}
      </Box>
    );
  }

  // Detailed variant for match detail pages
  if (variant === 'detailed') {
    // Special handling for goals
    if (event.event_type === 'goal' && event.player) {
      return (
        <Paper sx={{
          background: 'linear-gradient(135deg, #4285f4 0%, #1976d2 100%)',
          borderRadius: '16px',
          p: 3,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(66, 133, 244, 0.3)',
          mb: 2
        }}>
          <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            fontSize: '4rem',
            opacity: 0.2
          }}>
            ⚽
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              GÓÓÓÓÓÓL!!!
            </Typography>
            <Box sx={{ fontSize: '2rem' }}>⚽</Box>
          </Box>

          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: 1,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            {getDisplayTime()} - {event.player.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 48, 
              height: 48,
              border: '2px solid white',
              bgcolor: teamColor,
              fontWeight: 'bold'
            }}>
              {playerTeam === 'home' ? homeTeam?.tagozat?.charAt(0) : awayTeam?.tagozat?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {playerTeam === 'home' ? homeTeam?.name || homeTeam?.tagozat : awayTeam?.name || awayTeam?.tagozat}
              </Typography>
            </Box>
          </Box>
        </Paper>
      );
    }

    // Special handling for system events (no player)
    if (['match_start', 'half_time', 'full_time', 'extra_time', 'match_end'].includes(event.event_type)) {
      return (
        <Paper sx={{
          backgroundColor: '#2d2d2d',
          border: `2px solid ${eventInfo.color}`,
          borderRadius: '16px',
          p: 2,
          mb: 2,
          textAlign: 'center'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 2,
            mb: 1
          }}>
            <Box sx={{
              backgroundColor: eventInfo.color,
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem'
            }}>
              {eventInfo.emoji}
            </Box>
            <Typography variant="h5" sx={{ 
              color: '#e8eaed', 
              fontWeight: 600 
            }}>
              {eventInfo.label}
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ 
            color: eventInfo.color, 
            fontWeight: 'bold' 
          }}>
            {getDisplayTime()}
            {event.event_type === 'extra_time' && event.extra_time && (
              <span> (+{event.extra_time} perc)</span>
            )}
          </Typography>
        </Paper>
      );
    }

    // Default detailed view for cards and other events
    return (
      <Paper sx={{
        backgroundColor: '#2d2d2d',
        border: `1px solid ${eventInfo.color}`,
        borderRadius: '16px',
        p: 2,
        mb: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              backgroundColor: eventInfo.color,
              borderRadius: '8px',
              p: 1,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {eventInfo.emoji}
            </Box>
            <Typography variant="h6" sx={{ color: '#e8eaed', fontWeight: 600 }}>
              {eventInfo.label}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ 
            color: '#9aa0a6',
            backgroundColor: '#404040',
            px: 1.5,
            py: 0.5,
            borderRadius: '12px',
            fontWeight: 600
          }}>
            {getDisplayTime()}
          </Typography>
        </Box>

        {event.player && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 48, 
              height: 48,
              bgcolor: teamColor,
              color: 'white',
              fontWeight: 'bold'
            }}>
              {playerTeam === 'home' ? homeTeam?.tagozat?.charAt(0) : awayTeam?.tagozat?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                {event.player.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                {playerTeam === 'home' ? homeTeam?.name || homeTeam?.tagozat : awayTeam?.name || awayTeam?.tagozat}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    );
  }

  // Timeline variant
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      p: 1,
      borderLeft: `4px solid ${eventInfo.color}`,
      backgroundColor: eventInfo.bgColor,
      borderRadius: '0 8px 8px 0'
    }}>
      <Box sx={{
        minWidth: 48,
        height: 48,
        borderRadius: '50%',
        backgroundColor: eventInfo.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9rem'
      }}>
        {getDisplayTime()}
      </Box>
      
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" sx={{ 
          fontWeight: 600, 
          color: 'text.primary',
          mb: 0.5
        }}>
          {eventInfo.emoji} {eventInfo.label}
        </Typography>
        
        {event.player && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {event.player.name}
            {playerTeam && (
              <Chip
                label={playerTeam === 'home' ? homeTeam?.tagozat : awayTeam?.tagozat}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: teamColor,
                  color: 'white',
                  height: '20px'
                }}
              />
            )}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EnhancedEventDisplay;
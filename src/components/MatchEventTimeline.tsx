'use client';

import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from '@mui/lab';
import {
  Typography,
  Box,
  Paper,
  // Avatar replaced by TeamLogo for logo-first rendering
} from '@mui/material';
import TeamLogo from './TeamLogo';
import {
  SportsSoccer as GoalIcon,
  Warning as YellowCardIcon,
  Block as RedCardIcon,
  SwapHoriz as SubstitutionIcon,
  PlayArrow as StartIcon,
  Stop as EndIcon,
} from '@mui/icons-material';
import type { EnhancedEventSchema, Team } from '@/types/api';

interface MatchEventTimelineProps {
  events: EnhancedEventSchema[];
  homeTeam?: Team;
  awayTeam?: Team;
  isLive?: boolean;
}

const MatchEventTimeline: React.FC<MatchEventTimelineProps> = ({
  events,
  homeTeam,
  awayTeam,
  isLive = false
}) => {
  // Sort events by minute
  const sortedEvents = [...events].sort((a, b) => (a.minute || 0) - (b.minute || 0));

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return <GoalIcon sx={{ color: 'white' }} />;
      case 'yellow_card':
        return <YellowCardIcon sx={{ color: 'white' }} />;
      case 'red_card':
        return <RedCardIcon sx={{ color: 'white' }} />;
      case 'match_start':
        return <StartIcon sx={{ color: 'white' }} />;
      case 'half_time':
        return <SubstitutionIcon sx={{ color: 'white' }} />;
      case 'full_time':
      case 'match_end':
        return <EndIcon sx={{ color: 'white' }} />;
      default:
        return <GoalIcon sx={{ color: 'white' }} />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return 'success.main';
      case 'yellow_card':
        return 'warning.main';
      case 'red_card':
        return 'error.main';
      case 'match_start':
        return 'primary.main';
      case 'half_time':
        return 'info.main';
      case 'full_time':
      case 'match_end':
        return 'grey.600';
      default:
        return 'primary.main';
    }
  };

  const getEventTitle = (event: EnhancedEventSchema) => {
    switch (event.event_type) {
      case 'goal':
        return 'Gól';
      case 'yellow_card':
        return 'Sárga lap';
      case 'red_card':
        return 'Piros lap';
      case 'match_start':
        return 'Kezdés';
      case 'half_time':
        return 'Félidő';
      case 'full_time':
        return 'Befejezés';
      case 'match_end':
        return 'Vége';
      default:
        return 'Esemény';
    }
  };

  const getTeamSide = (event: EnhancedEventSchema) => {
    // Team-neutral events should be displayed in the center
    const neutralEvents = ['match_start', 'half_time', 'full_time', 'match_end', 'kezdes'];
    
    if (neutralEvents.includes(event.event_type)) {
      return 'neutral';
    }
    
    // If event has a player, determine side based on player's team
    if (event.player && homeTeam && awayTeam) {
      // You might need to adjust this logic based on how player team is determined
      // For now, we'll use a simple approach - check player name against team
      return Math.random() > 0.5 ? 'home' : 'away';
    }
    
    // Fallback to home side if no team information
    return 'home';
  };

  if (sortedEvents.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Még nincsenek események ebben a mérkőzésben
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 1 }}>
      <Timeline position="alternate">
        {sortedEvents.map((event, index) => {
          const teamSide = getTeamSide(event);
          const isHomeEvent = teamSide === 'home';
          const isNeutralEvent = teamSide === 'neutral';
          
          return (
            <TimelineItem key={event.id || index}>
              <TimelineOppositeContent
                sx={{ 
                  m: 'auto 0',
                  flex: 0.3,
                  fontSize: '0.875rem'
                }}
                align={isNeutralEvent ? "center" : (isHomeEvent ? "right" : "left")}
                variant="body2"
                color="text.secondary"
              >
                {Math.max(1, event.minute)}&apos;
                {event.minute_extra_time && (
                  <Typography 
                    component="span" 
                    variant="caption" 
                    sx={{ color: 'warning.main' }}
                  >
                    +{event.minute_extra_time}
                  </Typography>
                )}
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot 
                  sx={{ 
                    bgcolor: getEventColor(event.event_type),
                    p: 1,
                    boxShadow: 2
                  }}
                >
                  {getEventIcon(event.event_type)}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              
              <TimelineContent sx={{ py: '12px', px: 2, flex: 0.7 }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 1.5, 
                    backgroundColor: isNeutralEvent 
                      ? 'rgba(158, 158, 158, 0.05)' 
                      : (isHomeEvent ? 'rgba(25, 118, 210, 0.05)' : 'rgba(76, 175, 80, 0.05)'),
                    border: isNeutralEvent 
                      ? '1px solid rgba(158, 158, 158, 0.2)' 
                      : `1px solid ${isHomeEvent ? 'rgba(25, 118, 210, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`,
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography 
                      variant="subtitle2" 
                      component="span" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: getEventColor(event.event_type)
                      }}
                    >
                      {getEventTitle(event)}
                    </Typography>
                    
                    {/* Team indicator */}
                    {!isNeutralEvent && (
                      <TeamLogo
                        team={isHomeEvent ? homeTeam : awayTeam}
                        teamName={(isHomeEvent ? homeTeam?.name : awayTeam?.name) || undefined}
                        size={20}
                        fontSize="0.7rem"
                      />
                    )}
                  </Box>
                  
                  {event.player && (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {event.player.name}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    {event.half === 1 ? '1. félido' : '2. félidő'}
                    {event.extra_time && ' (hosszabbítás)'}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
        
        {/* Live indicator if match is ongoing */}
        {isLive && (
          <TimelineItem>
            <TimelineOppositeContent />
            <TimelineSeparator>
              <TimelineDot 
                sx={{ 
                  bgcolor: 'success.main',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { 
                      transform: 'scale(1)',
                      opacity: 1 
                    },
                    '50%': { 
                      transform: 'scale(1.1)',
                      opacity: 0.7 
                    }
                  }
                }}
              >
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'white'
                }} />
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'success.main',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              >
                ÉLŐ
              </Typography>
            </TimelineContent>
          </TimelineItem>
        )}
      </Timeline>
    </Box>
  );
};

export default MatchEventTimeline;
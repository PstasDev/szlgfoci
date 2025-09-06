'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Stack,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  SportsScore as GoalIcon,
  Warning as YellowCardIcon,
  Block as RedCardIcon,
  SwapHoriz as SubstitutionIcon,
} from '@mui/icons-material';
import { Match, getClassColor, getTeamById } from '@/data/mockData';
import LiveMatchTimer from './LiveMatchTimer';

interface MatchDetailViewProps {
  match: Match;
}

const MatchDetailView: React.FC<MatchDetailViewProps> = ({ match }) => {
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return <GoalIcon sx={{ color: 'success.main' }} />;
      case 'yellow_card':
        return <YellowCardIcon sx={{ color: 'warning.main' }} />;
      case 'red_card':
        return <RedCardIcon sx={{ color: 'error.main' }} />;
      case 'substitution':
        return <SubstitutionIcon sx={{ color: 'info.main' }} />;
      default:
        return <GoalIcon />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return 'success';
      case 'yellow_card':
        return 'warning';
      case 'red_card':
        return 'error';
      case 'substitution':
        return 'info';
      default:
        return 'primary';
    }
  };

  const formatEventDescription = (event: any) => {
    switch (event.type) {
      case 'goal':
        return `⚽ ${event.player}`;
      case 'yellow_card':
        return `🟨 ${event.player}`;
      case 'red_card':
        return `🟥 ${event.player}`;
      case 'substitution':
        return `🔄 ${event.player}`;
      default:
        return event.player;
    }
  };

  // Sort events by minute
  const sortedEvents = [...match.events].sort((a, b) => a.minute - b.minute);

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* Match Header */}
      <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {match.round}
          </Typography>
          {match.status === 'live' && (
            <LiveMatchTimer startTime={`${match.date}T${match.time}`} />
          )}
          {match.status === 'finished' && (
            <Chip label="Befejezett" color="success" size="small" />
          )}
          {match.status === 'upcoming' && (
            <Chip label="Közelgő" color="info" size="small" />
          )}
        </Box>

        {/* Teams and Score */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 2, alignItems: 'center' }}>
          {/* Home Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: homeTeam ? getClassColor(homeTeam.className) : 'grey.300',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {homeTeam?.className.split(' ')[1] || 'H'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'left' }}>
                {match.homeTeam}
              </Typography>
              {homeTeam && (
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {homeTeam.className}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Score */}
          <Box sx={{ textAlign: 'center', minWidth: 80 }}>
            {match.status !== 'upcoming' ? (
              <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                {match.homeScore} - {match.awayScore}
              </Typography>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {match.date}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {match.time}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Away Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'right' }}>
                {match.awayTeam}
              </Typography>
              {awayTeam && (
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {awayTeam.className}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: awayTeam ? getClassColor(awayTeam.className) : 'grey.300',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {awayTeam?.className.split(' ')[1] || 'A'}
            </Avatar>
          </Box>
        </Box>

        {/* Venue */}
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center', 
            mt: 2, 
            opacity: 0.9 
          }}
        >
          📍 {match.venue}
        </Typography>
      </Box>

      {/* Match Events Timeline */}
      {sortedEvents.length > 0 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Mérkőzés Eseményei
          </Typography>

          <Stack spacing={2}>
            {sortedEvents.map((event, index) => (
              <Card 
                key={event.id}
                variant="outlined" 
                sx={{ 
                  backgroundColor: event.team === 'home' ? 'primary.50' : 'warning.50',
                  border: '2px solid',
                  borderColor: `${getEventColor(event.type)}.main`,
                  borderLeft: '4px solid',
                  borderLeftColor: `${getEventColor(event.type)}.main`
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getEventIcon(event.type)}
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatEventDescription(event)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.team === 'home' ? match.homeTeam : match.awayTeam}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${event.minute}'`}
                      size="small"
                      color={getEventColor(event.type) as any}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* Match Statistics - placeholder for future expansion */}
      {match.status === 'finished' && (
        <Box sx={{ p: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Mérkőzés Statisztikák
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 3, alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {match.events.filter(e => e.type === 'goal' && e.team === 'home').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Gólok
              </Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {match.events.filter(e => e.type === 'goal' && e.team === 'away').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Gólok
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default MatchDetailView;

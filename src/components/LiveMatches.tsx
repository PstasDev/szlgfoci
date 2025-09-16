'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Sports as SportsIcon,
  SportsSoccer as BallIcon,
  Schedule as ClockIcon,
  Rectangle as CardIcon,
} from '@mui/icons-material';
import { getClassColor, Match, MatchEvent } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { useMatchesByStatus } from '@/hooks/useMatchesByStatus';
import LiveMatchTimer from './LiveMatchTimer';
import ErrorDisplay from './ErrorDisplay';

const LiveMatches: React.FC = () => {
  const router = useRouter();
  const { matches, loading, error, refetch } = useTournamentContext();
  const { liveMatches, upcomingMatches, recentMatches } = useMatchesByStatus(matches);

  if (loading) {
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#42a5f5' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error || (isEmptyDataError(matches) && !loading)) {
    const errorInfo = getErrorInfo('matches', error);
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <ErrorDisplay 
            errorInfo={errorInfo}
            onRetry={refetch}
            variant="box"
          />
        </CardContent>
      </Card>
    );
  }

  const MatchCard = ({ match, isLive = false }: { match: Match, isLive?: boolean }) => (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 1.5,
        border: isLive ? '1px solid' : '1px solid',
        borderColor: isLive ? 'success.main' : 'divider',
        backgroundColor: isLive ? 'rgba(76, 175, 80, 0.08)' : 'background.paper',
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s ease'
      }}
      onClick={() => router.push(`/merkozesek/${match.id}`)}
    >
      {isLive && (
        <Box sx={{ 
          height: 2, 
          backgroundColor: 'success.main',
          borderRadius: '2px 2px 0 0'
        }} />
      )}
      
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          {/* Match Status/Round */}
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {match.round}
          </Typography>
          
          {/* Venue */}
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            📍 {match.venue}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Home Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: getClassColor(match.homeTeam),
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {match.homeTeam.split(' ')[1]}
            </Avatar>
            <Typography 
              variant="body1" 
              fontWeight="500" 
              noWrap
              sx={{ color: 'text.primary', fontSize: '0.95rem' }}
            >
              {match.homeTeam}
            </Typography>
          </Box>
          
          {/* Score/Time */}
          <Box sx={{ textAlign: 'center', minWidth: 90, px: 1 }}>
            {match.status === 'finished' ? (
              <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary' }}>
                {match.homeScore} - {match.awayScore}
              </Typography>
            ) : match.status === 'live' ? (
              <Box>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {match.homeScore} - {match.awayScore}
                </Typography>
                <LiveMatchTimer startTime={`${match.date}T${match.time}`} />
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {match.time}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {match.date}
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Away Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'flex-end' }}>
            <Typography 
              variant="body1" 
              fontWeight="500" 
              noWrap 
              textAlign="right"
              sx={{ color: 'text.primary', fontSize: '0.95rem' }}
            >
              {match.awayTeam}
            </Typography>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: getClassColor(match.awayTeam),
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {match.awayTeam.split(' ')[1]}
            </Avatar>
          </Box>
        </Box>

        {/* Live match events */}
        {isLive && match.events.length > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
            {match.events.slice(-3).map((event: MatchEvent) => (
              <Box key={event.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {event.type === 'goal' ? (
                  <BallIcon sx={{ fontSize: 16, color: 'success.main' }} />
                ) : event.type === 'yellow_card' ? (
                  <CardIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                ) : (
                  <CardIcon sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {event.minute}&apos; {event.player}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <Box sx={{ flex: 1 }}>
          <Card sx={{ backgroundColor: 'background.paper' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  color: 'success.main',
                  fontWeight: 600
                }}
              >
                <SportsIcon />
                Élő Mérkőzések
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 2 }}>
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} isLive />
              ))}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Upcoming Matches */}
      <Box sx={{ flex: 1 }}>
        <Card sx={{ backgroundColor: 'background.paper' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'text.primary',
                fontWeight: 600
              }}
            >
              <ClockIcon color="primary" />
              Következő Meccsek
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 2 }}>
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* Recent Results */}
      <Box sx={{ flex: 1 }}>
        <Card sx={{ backgroundColor: 'background.paper' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'text.primary',
                fontWeight: 600
              }}
            >
              <SportsIcon color="primary" />
              Utolsó Eredmények
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 2 }}>
            {recentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
};

export default LiveMatches;

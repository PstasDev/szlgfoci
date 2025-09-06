'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  Sports as SportsIcon,
  SportsSoccer as BallIcon,
  Schedule as ClockIcon,
  Rectangle as CardIcon,
} from '@mui/icons-material';
import { getLiveMatches, getUpcomingMatches, getRecentMatches, getClassColor } from '@/data/mockData';
import LiveMatchTimer from './LiveMatchTimer';

const LiveMatches: React.FC = () => {
  const router = useRouter();
  const liveMatches = getLiveMatches();
  const upcomingMatches = getUpcomingMatches(3);
  const recentMatches = getRecentMatches(3);
  
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const MatchCard = ({ match, isLive = false }: { match: any, isLive?: boolean }) => (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 1,
        border: isLive ? '2px solid' : '1px solid',
        borderColor: isLive ? 'success.main' : 'divider',
        backgroundColor: isLive ? 'success.50' : 'background.paper',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s ease'
      }}
      onClick={() => router.push(`/merkozesek/${match.id}`)}
    >
      {isLive && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <LinearProgress color="success" />
        </Box>
      )}
      
      <CardContent sx={{ pb: '12px !important', pt: isLive ? 2 : 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Home Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: getClassColor(match.homeTeam),
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {match.homeTeam.split(' ')[1]} {/* Shows just the class letter */}
            </Avatar>
            <Typography variant="body2" fontWeight="500" noWrap>
              {match.homeTeam}
            </Typography>
          </Box>
          
          {/* Score/Time */}
          <Box sx={{ textAlign: 'center', minWidth: 80 }}>
            {match.status === 'finished' ? (
              <Typography variant="h6" fontWeight="bold">
                {match.homeScore} - {match.awayScore}
              </Typography>
            ) : match.status === 'live' ? (
              <>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {match.homeScore} - {match.awayScore}
                </Typography>
                <LiveMatchTimer startTime={`${match.date}T${match.time}`} />
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {match.time}
              </Typography>
            )}
          </Box>
          
          {/* Away Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
            <Typography variant="body2" fontWeight="500" noWrap textAlign="right">
              {match.awayTeam}
            </Typography>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: getClassColor(match.awayTeam),
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {match.awayTeam.split(' ')[1]} {/* Shows just the class letter */}
            </Avatar>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {match.venue}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {match.round}
          </Typography>
        </Box>

        {/* Live match events */}
        {isLive && match.events.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Divider sx={{ my: 1 }} />
            {match.events.slice(-3).map((event: any) => (
              <Box key={event.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {event.type === 'goal' ? (
                  <BallIcon sx={{ fontSize: 14, color: 'success.main' }} />
                ) : event.type === 'yellow_card' ? (
                  <CardIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                ) : (
                  <CardIcon sx={{ fontSize: 14, color: 'error.main' }} />
                )}
                <Typography variant="caption">
                  {event.minute}' {event.player}
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
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                <SportsIcon />
                Élő Mérkőzések
              </Typography>
              
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} isLive />
              ))}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Upcoming Matches */}
      <Box sx={{ flex: 1 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ClockIcon color="primary" />
              Következő Meccsek
            </Typography>
            
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* Recent Results */}
      <Box sx={{ flex: 1 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SportsIcon color="primary" />
              Utolsó Eredmények
            </Typography>
            
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

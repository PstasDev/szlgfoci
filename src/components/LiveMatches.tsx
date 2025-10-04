'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import TeamLogo from './TeamLogo';
import {
  Sports as SportsIcon,
  Schedule as ClockIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getTeamColor, Match } from '@/utils/dataUtils';
import { LiveMatch } from '@/types/api';
import { getErrorInfo, isEmptyDataScenario } from '@/utils/errorUtils';
import { useTournamentData } from '@/contexts/TournamentDataContext';
import { useMatchesByStatus } from '@/hooks/useMatchesByStatus';
import useLiveMatchPolling from '@/hooks/useLiveMatchPolling';
import LoadingSkeleton from './LoadingSkeleton';
import ImprovedLiveMatchTimer from './ImprovedLiveMatchTimer';
import ErrorDisplay from './ErrorDisplay';
import EmptyDataDisplay from './EmptyDataDisplay';

const LiveMatches: React.FC = () => {
  const router = useRouter();
  const { matches, loading, error, refetch } = useTournamentData();
  const { liveMatches, upcomingMatches, recentMatches } = useMatchesByStatus(matches);
  
  // Real-time live match polling
  const {
    liveMatches: polledLiveMatches,
    isPolling,
    error: _pollingError,
    lastUpdated: _lastUpdated,
    refresh: refreshLiveData
  } = useLiveMatchPolling({
    pollingInterval: 1000, // 1 second for accurate live timing
    enablePolling: true,
    autoStart: true
  });

  // Use polled data if available, fallback to context data
  const displayMatches = polledLiveMatches.length > 0 ? polledLiveMatches : liveMatches;

  if (loading) {
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <LoadingSkeleton variant="matches" count={3} />
        </CardContent>
      </Card>
    );
  }

  // Handle empty data scenario vs actual errors
  if (isEmptyDataScenario(error ? new Error(error) : null, matches) && !loading) {
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <EmptyDataDisplay 
            type="matches"
            onRetry={refetch}
            variant="box"
          />
        </CardContent>
      </Card>
    );
  }

  // Handle actual errors
  if (error && !loading) {
    const errorInfo = getErrorInfo('matches', new Error(error));
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
        border: isLive ? '2px solid' : '1px solid',
        borderColor: isLive ? 'success.main' : 'divider',
        backgroundColor: isLive ? 'rgba(76, 175, 80, 0.05)' : 'background.paper',
        borderRadius: 2,
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s ease'
      }}
      onClick={() => router.push(`/merkozesek/${match.id}`)}
    >      
      <CardContent sx={{ p: 2 }}>
        {/* Live badge */}
        {isLive && (
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'success.main',
            color: 'white',
            px: 1,
            py: 0.25,
            borderRadius: '8px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 1
          }}>
            <Box sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'white',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            ÉLŐ
          </Box>
        )}

        {/* Teams and Score */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }, 
          justifyContent: { xs: 'stretch', sm: 'space-between' }, 
          mb: 1,
          gap: { xs: 0.5, sm: 0 }
        }}>
          {/* Mobile Layout: Stacked teams with scores */}
          <Box sx={{ 
            display: { xs: 'flex', sm: 'none' },
            flexDirection: 'column',
            gap: 0.5
          }}>
            {/* Home Team Row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={24} fontSize="0.65rem" />
                <Typography 
                  variant="body2" 
                  fontWeight="500" 
                  sx={{ color: 'text.primary', fontSize: '0.85rem' }}
                >
                  {match.homeTeam}
                </Typography>
              </Box>
              {/* Home Score */}
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  color: match.status === 'live' ? 'success.main' : 'text.primary',
                  minWidth: '20px',
                  textAlign: 'center'
                }}
              >
                {match.status === 'finished' || match.status === 'live' ? (match.homeScore ?? 0) : '-'}
              </Typography>
            </Box>
            
            {/* Away Team Row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={24} fontSize="0.65rem" />
                <Typography 
                  variant="body2" 
                  fontWeight="500" 
                  sx={{ color: 'text.primary', fontSize: '0.85rem' }}
                >
                  {match.awayTeam}
                </Typography>
              </Box>
              {/* Away Score */}
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  color: match.status === 'live' ? 'success.main' : 'text.primary',
                  minWidth: '20px',
                  textAlign: 'center'
                }}
              >
                {match.status === 'finished' || match.status === 'live' ? (match.awayScore ?? 0) : '-'}
              </Typography>
            </Box>
            
            {/* Mobile Time/Date Info */}
            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              {match.status === 'live' ? (
                <ImprovedLiveMatchTimer 
                  startTime={`${match.date}T${match.time}`}
                  events={match.events}
                />
              ) : match.status === 'upcoming' ? (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {match.time}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>
                    {new Date(match.date).toLocaleDateString('hu-HU', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  {new Date(match.date).toLocaleDateString('hu-HU', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} • {match.time}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Desktop Layout: Original horizontal layout */}
          <Box sx={{ 
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            {/* Home Team */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              flex: 1
            }}>
              <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={28} fontSize="0.7rem" />
              <Typography 
                variant="body2" 
                fontWeight="500" 
                noWrap
                sx={{ color: 'text.primary' }}
              >
                {match.homeTeam}
              </Typography>
            </Box>
            
            {/* Score/Time */}
            <Box sx={{ textAlign: 'center', px: 2 }}>
              {match.status === 'finished' ? (
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    {match.homeScore ?? 0} - {match.awayScore ?? 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
                    {new Date(match.date).toLocaleDateString('hu-HU', { 
                      month: 'short', 
                      day: 'numeric' 
                    })} • {match.time}
                  </Typography>
                </Box>
              ) : match.status === 'live' ? (
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {match.homeScore ?? 0} - {match.awayScore ?? 0}
                  </Typography>
                  <ImprovedLiveMatchTimer 
                    startTime={`${match.date}T${match.time}`}
                    events={match.events}
                  />
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    {match.time}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
                    {new Date(match.date).toLocaleDateString('hu-HU', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Away Team */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              flex: 1,
              justifyContent: 'flex-end'
            }}>
              <Typography 
                variant="body2" 
                fontWeight="500" 
                noWrap 
                textAlign="right"
                sx={{ color: 'text.primary' }}
              >
                {match.awayTeam}
              </Typography>
              <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={28} fontSize="0.7rem" />
            </Box>
          </Box>
        </Box>

        {/* Match info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {match.round}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            📍 {match.venue}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
      {/* Live Matches */}
      {displayMatches.length > 0 && (
        <Box sx={{ flex: 1 }}>
          <Card sx={{ backgroundColor: 'background.paper' }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid', 
              borderBottomColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
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
              
              {/* Live polling status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isPolling && (
                  <Chip
                    label="Élő frissítés"
                    size="small"
                    sx={{
                      backgroundColor: 'success.main',
                      color: 'white',
                      fontSize: '0.7rem',
                      '& .MuiChip-label': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }
                    }}
                    icon={
                      <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        animation: 'pulse 2s infinite'
                      }} />
                    }
                  />
                )}
                <Tooltip title="Frissítés">
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      refreshLiveData();
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <CardContent sx={{ p: 2 }}>
              {displayMatches.map((match) => {
                // Convert LiveMatch to Match for compatibility
                const isLiveMatch = 'live_status' in match;
                const matchData: Match = {
                  ...match,
                  status: isLiveMatch ? (match as LiveMatch).live_status.status as 'upcoming' | 'live' | 'finished' : 'live' as const
                };
                return (
                  <MatchCard key={match.id} match={matchData} isLive />
                );
              })}
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
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 4,
                color: 'text.secondary'
              }}>
                <Typography variant="body2">
                  Nincsenek közelgő mérkőzések
                </Typography>
              </Box>
            )}
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
            {recentMatches.length > 0 ? (
              recentMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 4,
                color: 'text.secondary'
              }}>
                <Typography variant="body2">
                  Nincsenek legutóbbi eredmények
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
};

export default LiveMatches;

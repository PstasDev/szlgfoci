'use client';

import React, { memo, useCallback } from 'react';
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
  SportsSoccer as BallIcon,
  Schedule as ClockIcon,
  Rectangle as CardIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getTeamColor, Match, MatchEvent, isMatchCancelled, getStatusBadgeProps } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataScenario } from '@/utils/errorUtils';
import { useOptimizedTournamentData } from '@/contexts/OptimizedTournamentDataContext';
import { useOptimizedLiveMatches } from '@/hooks/useOptimizedLiveMatches';
import { usePerformanceOptimizedMatches } from '@/hooks/usePerformanceOptimizedMatches';
import LoadingSkeleton from './LoadingSkeleton';
import ImprovedLiveMatchTimer from './ImprovedLiveMatchTimer';
import ErrorDisplay from './ErrorDisplay';
import EmptyDataDisplay from './EmptyDataDisplay';

// Memoized MatchCard component to prevent unnecessary re-renders
const MatchCard = memo(({ match, isLive = false, onClick }: { 
  match: Match, 
  isLive?: boolean,
  onClick: () => void 
}) => {
  // Get cancellation status badge if applicable
  const statusBadge = getStatusBadgeProps(match.cancellationStatus);
  // Never show live indicator for cancelled matches
  const showLiveIndicator = isLive && !isMatchCancelled(match);
  
  return (
  <Card 
    variant="outlined" 
    sx={{ 
      mb: 1.5,
      border: '1px solid',
      borderColor: showLiveIndicator ? 'success.main' : 'divider',
      backgroundColor: showLiveIndicator ? 'rgba(76, 175, 80, 0.08)' : 'background.paper',
      borderRadius: 2,
      cursor: 'pointer',
      opacity: isMatchCancelled(match) ? 0.7 : 1,
      '&:hover': {
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transform: 'translateY(-1px)',
      },
      transition: 'all 0.2s ease'
    }}
    onClick={onClick}
  >
    {showLiveIndicator && (
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
        
        {/* Status badges - cancellation takes priority over live */}
        {statusBadge ? (
          <Chip 
            label={statusBadge.text}
            size="small" 
            color={statusBadge.color}
            variant="filled"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        ) : showLiveIndicator ? (
          <Chip 
            label="ÉLŐ" 
            size="small" 
            color="success" 
            variant="filled"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        ) : null}
        
        {/* Venue */}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          📍 {match.venue}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Home Team */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={32} fontSize="0.8rem" />
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
              <ImprovedLiveMatchTimer 
                startTime={`${match.date}T${match.time}`}
                events={match.events}
              />
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
          <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={32} fontSize="0.8rem" />
        </Box>
      </Box>

      {/* Live match events */}
      {isLive && match.events && match.events.length > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
          {match.events.slice(-3).map((event: MatchEvent) => (
            <Box key={event.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              {event.event_type === 'goal' ? (
                <BallIcon sx={{ fontSize: 16, color: 'success.main' }} />
              ) : event.event_type === 'yellow_card' ? (
                <CardIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              ) : (
                <CardIcon sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {Math.max(1, event.minute)}&apos; {event.playerName || event.player}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </CardContent>
  </Card>
);
});

MatchCard.displayName = 'MatchCard';

// Memoized section component
const MatchSection = memo(({ 
  title, 
  icon, 
  matches, 
  onMatchClick, 
  isLiveSection = false,
  onRefresh,
  lastUpdated,
  loading = false 
}: {
  title: string;
  icon: React.ReactNode;
  matches: Match[];
  onMatchClick: (match: Match) => void;
  isLiveSection?: boolean;
  onRefresh?: () => void;
  lastUpdated?: number;
  loading?: boolean;
}) => {
  if (!matches.length && !loading) {
    return null; // Don't render empty sections
  }

  return (
    <Box sx={{ flex: 1 }}>
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid', 
          borderBottomColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              color: isLiveSection ? 'success.main' : 'text.primary',
              fontWeight: 600
            }}
          >
            {icon}
            {title}
          </Typography>
          
          {isLiveSection && onRefresh && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {lastUpdated && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {new Date(lastUpdated).toLocaleTimeString('hu-HU')}
                </Typography>
              )}
              <Tooltip title="Élő adatok frissítése">
                <IconButton 
                  size="small" 
                  onClick={onRefresh}
                  disabled={loading}
                  sx={{ color: 'success.main' }}
                >
                  <RefreshIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        
        <CardContent sx={{ p: 2 }}>
          {loading ? (
            <LoadingSkeleton variant="matches" count={2} />
          ) : (
            matches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                isLive={isLiveSection}
                onClick={() => onMatchClick(match)}
              />
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
});

MatchSection.displayName = 'MatchSection';

const OptimizedLiveMatches: React.FC = () => {
  const router = useRouter();
  const { matches, teams, loading, error, refetch } = useOptimizedTournamentData();
  
  // Use optimized live matches hook for real-time updates
  const { 
    liveMatches: realTimeLiveMatches, 
    loading: liveLoading, 
    refresh: refreshLiveMatches,
    lastUpdated: liveLastUpdated
  } = useOptimizedLiveMatches(teams, { 
    refreshInterval: 30000, // 30 seconds for live matches
    enabled: true 
  });

  // Use performance optimized matches for non-live data
  const { 
    upcomingMatches, 
    recentMatches,
    hasUpcomingMatches,
    hasRecentMatches
  } = usePerformanceOptimizedMatches(matches, {
    upcomingLimit: 5,
    recentLimit: 5
  });

  const handleMatchClick = useCallback((match: Match) => {
    router.push(`/merkozesek/${match.id}`);
  }, [router]);

  const handleRefreshLive = useCallback(() => {
    refreshLiveMatches();
  }, [refreshLiveMatches]);

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

  const hasLiveMatches = realTimeLiveMatches.length > 0;

  return (
    <Stack 
      spacing={3} 
      direction={{ xs: 'column', md: hasLiveMatches ? 'row' : 'column', lg: 'row' }}
    >
      {/* Live Matches - Always prioritized */}
      {hasLiveMatches && (
        <MatchSection
          title="Élő Mérkőzések"
          icon={<SportsIcon />}
          matches={realTimeLiveMatches}
          onMatchClick={handleMatchClick}
          isLiveSection={true}
          onRefresh={handleRefreshLive}
          lastUpdated={liveLastUpdated}
          loading={liveLoading}
        />
      )}

      {/* Upcoming Matches */}
      {hasUpcomingMatches && (
        <MatchSection
          title="Következő Meccsek"
          icon={<ClockIcon color="primary" />}
          matches={upcomingMatches}
          onMatchClick={handleMatchClick}
        />
      )}

      {/* Recent Results */}
      {hasRecentMatches && (
        <MatchSection
          title="Utolsó Eredmények"
          icon={<SportsIcon color="primary" />}
          matches={recentMatches}
          onMatchClick={handleMatchClick}
        />
      )}

      {/* Show message if no matches at all */}
      {!hasLiveMatches && !hasUpcomingMatches && !hasRecentMatches && (
        <Card sx={{ backgroundColor: 'background.paper' }}>
          <CardContent>
            <EmptyDataDisplay 
              type="matches"
              onRetry={refetch}
              variant="box"
            />
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default OptimizedLiveMatches;
'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as LiveIcon,
  Schedule as UpcomingIcon,
  CheckCircle as FinishedIcon,
  SportsScore as GoalIcon,
  EmojiEvents as TrophyIcon,
  Group as TeamsIcon,
  DateRange as CalendarIcon,
  TrendingUp as TrendIcon,
  Sports as SportIcon,
} from '@mui/icons-material';
import { Match } from '@/utils/dataUtils';

interface MatchInsightsProps {
  matches: Match[];
}

const MatchInsights: React.FC<MatchInsightsProps> = ({ matches }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const insights = useMemo(() => {
    const liveMatches = matches.filter(match => match.status === 'live');
    const upcomingMatches = matches.filter(match => match.status === 'upcoming');
    const finishedMatches = matches.filter(match => match.status === 'finished');

    // Calculate total goals
    const totalGoals = finishedMatches.reduce((sum, match) => {
      const homeScore = match.homeScore ?? 0;
      const awayScore = match.awayScore ?? 0;
      return sum + homeScore + awayScore;
    }, 0);

    // Calculate average goals per match
    const avgGoalsPerMatch = finishedMatches.length > 0 ? (totalGoals / finishedMatches.length).toFixed(1) : '0.0';

    // Find highest scoring match
    const highestScoringMatch = finishedMatches.reduce((highest, match) => {
      const currentTotal = (match.homeScore ?? 0) + (match.awayScore ?? 0);
      const highestTotal = (highest?.homeScore ?? 0) + (highest?.awayScore ?? 0);
      return currentTotal > highestTotal ? match : highest;
    }, finishedMatches[0]);

    // Get upcoming matches in next 7 days
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingThisWeek = upcomingMatches.filter(match => {
      const matchDate = new Date(match.date + ' ' + match.time);
      return matchDate <= nextWeek;
    });

    // Get unique teams
    const teams = new Set();
    matches.forEach(match => {
      teams.add(match.homeTeam);
      teams.add(match.awayTeam);
    });

    // Get today's matches
    const today = new Date().toDateString();
    const todayMatches = matches.filter(match => {
      const matchDate = new Date(match.date + ' ' + match.time);
      return matchDate.toDateString() === today;
    });

    return {
      total: matches.length,
      live: liveMatches.length,
      upcoming: upcomingMatches.length,
      finished: finishedMatches.length,
      totalGoals,
      avgGoalsPerMatch,
      highestScoringMatch,
      upcomingThisWeek: upcomingThisWeek.length,
      totalTeams: teams.size,
      todayMatches: todayMatches.length
    };
  }, [matches]);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }> = ({ icon, title, value, subtitle, color = '#4285f4' }) => (
    <Card
      sx={{
        backgroundColor: '#2d2d2d',
        border: '1px solid #404040',
        borderRadius: 2,
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Box
            sx={{
              p: 1,
              borderRadius: '50%',
              backgroundColor: `${color}20`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box flex={1}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#e8eaed',
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
        <Typography
          variant="body1"
          sx={{
            color: '#9aa0a6',
            fontWeight: 500,
            mb: subtitle ? 0.5 : 0
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ color: '#6c757d', fontSize: '0.875rem' }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const QuickStatChip: React.FC<{
    icon: React.ReactElement;
    label: string;
    value: number;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  }> = ({ icon, label, value, color = 'default' }) => (
    <Chip
      icon={icon}
      label={`${value} ${label}`}
      color={color}
      variant="filled"
      sx={{
        fontWeight: 600,
        px: 1,
        '& .MuiChip-icon': { fontSize: '1rem' }
      }}
    />
  );

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <TrophyIcon sx={{ color: '#4285f4', fontSize: '2rem' }} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#e8eaed',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Liga Áttekintés
        </Typography>
      </Stack>

      {/* Quick Stats */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 3,
          flexWrap: 'wrap',
          gap: 1,
          '& > *': { flexShrink: 0 }
        }}
      >
        {insights.live > 0 && (
          <QuickStatChip
            icon={<LiveIcon />}
            label="élő"
            value={insights.live}
            color="error"
          />
        )}
        {insights.todayMatches > 0 && (
          <QuickStatChip
            icon={<CalendarIcon />}
            label="ma"
            value={insights.todayMatches}
            color="primary"
          />
        )}
        <QuickStatChip
          icon={<UpcomingIcon />}
          label="közelgő"
          value={insights.upcoming}
          color="info"
        />
        <QuickStatChip
          icon={<FinishedIcon />}
          label="befejezett"
          value={insights.finished}
          color="success"
        />
      </Stack>

      {/* Main Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(6, 1fr)',
          },
          gap: 3,
        }}
      >
        <StatCard
          icon={<SportIcon />}
          title="Összes mérkőzés"
          value={insights.total}
          color="#4285f4"
        />

        <StatCard
          icon={<TeamsIcon />}
          title="Csapatok"
          value={insights.totalTeams}
          color="#34a853"
        />

        <StatCard
          icon={<GoalIcon />}
          title="Összes gól"
          value={insights.totalGoals}
          color="#ea4335"
        />

        <StatCard
          icon={<TrendIcon />}
          title="Átlag gól/meccs"
          value={insights.avgGoalsPerMatch}
          color="#fbbc04"
        />

        <StatCard
          icon={<CalendarIcon />}
          title="Következő 7 nap"
          value={insights.upcomingThisWeek}
          subtitle="mérkőzés"
          color="#9c27b0"
        />

        <StatCard
          icon={<LiveIcon />}
          title="Élő meccsek"
          value={insights.live}
          color="#ff4444"
        />
      </Box>
    </Box>
  );
};

export default MatchInsights;
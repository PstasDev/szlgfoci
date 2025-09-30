'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Avatar,
  Chip,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  SportsScore as GoalIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { getClassColor } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const { topScorers, teams, matches, loading, error, refetch } = useTournamentContext();

  const playerId = parseInt(params.id as string);
  const player = topScorers.find(p => p.id === playerId);
  const playerTeam = player ? teams.find(t => t.id === player.teamId) : null;
  const teamMatches = playerTeam ? matches.filter(m => 
    m.homeTeam === playerTeam.name || m.awayTeam === playerTeam.name
  ) : [];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted
  if (!mounted) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
      </Box>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress sx={{ color: '#42a5f5' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  // Show error state
  if (error || (isEmptyDataError(topScorers) && !loading)) {
    const errorInfo = getErrorInfo('players', error);
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <ErrorDisplay 
            errorInfo={errorInfo}
            onRetry={refetch}
            fullPage
          />
        </Container>
      </Box>
    );
  }

  if (!player || !playerTeam) {
    const errorInfo = getErrorInfo('player');
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <ErrorDisplay 
            errorInfo={errorInfo}
            fullPage
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Back Button */}
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.back()}
            sx={{ alignSelf: 'flex-start' }}
          >
            Vissza
          </Button>

          {/* Player Header */}
          <Paper elevation={2} sx={{ p: 4, backgroundColor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: playerTeam?.className ? getClassColor(playerTeam.className) : 'grey.500',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                <PersonIcon sx={{ fontSize: '2rem' }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {player.name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {playerTeam.name || 'Unknown team'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<TrophyIcon />}
                    label={`#${player.position} scorer`}
                    color={(player.position || 0) <= 3 ? 'success' : 'default'}
                    sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip
                    icon={<GoalIcon />}
                    label={`${player.goals} goals`}
                    sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Player Stats Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {player.goals}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Goals
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  #{player.position}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  League Position
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {playerTeam?.played || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Team Matches
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {playerTeam?.points || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Team Points
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Recent Team Matches */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Recent Team Matches ({teamMatches.length})
            </Typography>
            
            <Stack spacing={2}>
              {teamMatches.slice(0, 5).map((match) => (
                <Card 
                  key={match.id}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4, transform: 'translateY(-1px)' },
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => router.push(`/merkozesek/${match.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {match.date}
                        </Typography>
                        <Typography variant="h6">
                          {match.homeTeam} vs {match.awayTeam}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {match.status === 'finished' && (
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {match.homeScore} - {match.awayScore}
                          </Typography>
                        )}
                        <Chip
                          label={match.status === 'finished' ? 'Finished' : match.status === 'live' ? 'Live' : 'Upcoming'}
                          size="small"
                          color={match.status === 'finished' ? 'default' : match.status === 'live' ? 'success' : 'info'}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

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
import { tournamentService } from '@/services/apiService';
import { getTeamColor, getTeamDisplayName } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';
import type { Team } from '@/types/api';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [fallbackTeams, setFallbackTeams] = React.useState<Team[]>([]);
  const [fallbackLoading, setFallbackLoading] = React.useState(false);
  
  const { topScorers, teams, matches, loading, error, refetch } = useTournamentContext();

  const playerId = parseInt(params.id as string);
  
  // Use teams from context or fallback teams
  const allTeams = teams.length > 0 ? teams : fallbackTeams;
  
  // Find player in any team's players array
  let player = null;
  let playerTeam = null;
  
  for (const team of allTeams) {
    const foundPlayer = team.players?.find(p => p.id === playerId);
    if (foundPlayer) {
      player = foundPlayer;
      playerTeam = team;
      break;
    }
  }
  
  // Find goal scoring data for this player
  const goalData = topScorers.find(scorer => 
    scorer.player_id === playerId || scorer.player_name === player?.name
  );
  
  const teamDisplayName = playerTeam ? getTeamDisplayName(playerTeam) : '';
  const teamMatches = playerTeam ? matches.filter(m => 
    m.homeTeam === teamDisplayName || m.awayTeam === teamDisplayName
  ) : [];

  // Fallback: If no teams are loaded, load teams directly to find the player
  React.useEffect(() => {
    if (mounted && !loading && teams.length === 0 && fallbackTeams.length === 0 && !fallbackLoading) {
      setFallbackLoading(true);
      
      tournamentService.getTeams()
        .then((teamsData) => {
          setFallbackTeams(teamsData);
        })
        .catch((err) => {
          console.error('Failed to load teams directly:', err);
          // Try to load specific player if available
          return tournamentService.getPlayer(playerId);
        })
        .then((playerData) => {
          if (playerData && !Array.isArray(playerData)) {
            // If we got player data, we'd need team info too
            // For now, just log that we found the player
            console.log('Found player:', playerData);
          }
        })
        .catch((err) => {
          console.error('Failed to load player:', err);
        })
        .finally(() => {
          setFallbackLoading(false);
        });
    }
  }, [playerId, mounted, loading, teams.length, fallbackTeams.length, fallbackLoading]);

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
  if (loading || fallbackLoading) {
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
  if (error || (isEmptyDataError(allTeams) && !loading && !fallbackLoading)) {
    const errorInfo = getErrorInfo('players', error ? { message: error } : undefined);
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
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Stack spacing={4} alignItems="center">
            <Button
              startIcon={<BackIcon />}
              onClick={() => router.push('/jatekosok')}
              sx={{ alignSelf: 'flex-start' }}
            >
              Vissza a játékosokhoz
            </Button>
            
            <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 600 }}>
              <Typography variant="h4" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                Játékos nem található
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                A {playerId}. számú játékos nem létezik, vagy még nem érhető el nyilvánosan.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/jatekosok')}
                sx={{ mt: 2 }}
              >
                Vissza a játékosokhoz
              </Button>
            </Paper>
          </Stack>
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
                  bgcolor: getTeamColor(playerTeam),
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
                  {getTeamDisplayName(playerTeam)} - {playerTeam.start_year}. évfolyam {playerTeam.tagozat} tagozat
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {player.csk && (
                    <Chip
                      icon={<TrophyIcon />}
                      label="Csapatkapitány"
                      color="success"
                      sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                  )}
                  {goalData && (
                    <>
                      <Chip
                        icon={<TrophyIcon />}
                        label={`#${goalData.position} góllövő`}
                        color={(goalData.position || 0) <= 3 ? 'success' : 'default'}
                        sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                      />
                      <Chip
                        icon={<GoalIcon />}
                        label={`${goalData.goals} gól`}
                        sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                      />
                    </>
                  )}
                  {!goalData && (
                    <Chip
                      label="Még nincs gól"
                      sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Player Stats Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {goalData?.goals || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Gólok
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {goalData ? `#${goalData.position}` : '-'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Liga Pozíció
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {player.csk ? 'Igen' : 'Nem'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Kapitány
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {teamMatches.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Csapat Meccsek
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Recent Team Matches */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Csapat Meccsek ({teamMatches.length})
            </Typography>
            
            {teamMatches.length > 0 ? (
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
                            label={match.status === 'finished' ? 'Befejezett' : match.status === 'live' ? 'Élő' : 'Közelgő'}
                            size="small"
                            color={match.status === 'finished' ? 'default' : match.status === 'live' ? 'success' : 'info'}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Még nincsenek meccsek
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A csapat meccsei itt jelennek majd meg.
                </Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

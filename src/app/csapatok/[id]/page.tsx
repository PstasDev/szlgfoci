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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  SportsScore as GoalIcon,
  EmojiEvents as TrophyIcon,
  Warning as WarningIcon,
  Gavel as SanctionIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { tournamentService } from '@/services/apiService';
import { getTeamColor, getTeamDisplayName, getTeamClassName } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataScenario } from '@/utils/errorUtils';
import EmptyDataDisplay from '@/components/EmptyDataDisplay';
import type { Team, SzankcioSchema } from '@/types/api';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [fallbackTeams, setFallbackTeams] = React.useState<Team[]>([]);
  const [fallbackLoading, setFallbackLoading] = React.useState(false);
  const [sanctions, setSanctions] = React.useState<SzankcioSchema[]>([]);
  const [sanctionsLoading, setSanctionsLoading] = React.useState(false);
  const [sanctionsError, setSanctionsError] = React.useState<string | null>(null);
  
  const { standings, topScorers, teams, matches, loading, error, refetch } = useTournamentContext();
  
  const teamId = parseInt(params.id as string);
  
  // Use teams from context or fallback teams
  const allTeams = teams.length > 0 ? teams : fallbackTeams;
  const team = allTeams.find(t => t.id === teamId);
  
  const standing = standings.find(s => s.team_id === teamId);
  const teamDisplayName = team ? getTeamDisplayName(team) : '';
  const teamMatches = matches.filter(match => 
    match.homeTeam === teamDisplayName || match.awayTeam === teamDisplayName
  );
  const teamPlayers = topScorers.filter(player => player.team_name === teamDisplayName);
  
  // Get actual team players from the team data
  const actualTeamPlayers = team?.players || [];

  // Fallback: If no teams are loaded (e.g., tournament hasn't started), load teams directly
  React.useEffect(() => {
    if (mounted && !loading && teams.length === 0 && fallbackTeams.length === 0 && !fallbackLoading) {
      setFallbackLoading(true);
      
      tournamentService.getTeams()
        .then((teamsData) => {
          setFallbackTeams(teamsData);
        })
        .catch((err) => {
          console.error('Failed to load teams directly:', err);
          // If loading all teams fails, try to load the specific team
          return tournamentService.getTeam(teamId);
        })
        .then((teamData) => {
          if (teamData && !Array.isArray(teamData)) {
            // Single team returned, add it to the fallback teams array
            setFallbackTeams([teamData]);
          }
        })
        .catch((err) => {
          console.error('Failed to load specific team:', err);
          // Don't set error, just continue without teams data
        })
        .finally(() => {
          setFallbackLoading(false);
        });
    }
  }, [teamId, mounted, loading, teams.length, fallbackTeams.length, fallbackLoading]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch sanctions when we have a team
  React.useEffect(() => {
    if (team && mounted) {
      setSanctionsLoading(true);
      setSanctionsError(null);
      
      tournamentService.getTeamSanctions(team.id!)
        .then((sanctionsData) => {
          setSanctions(sanctionsData);
        })
        .catch((err) => {
          console.error('Failed to load team sanctions:', err);
          setSanctionsError('Failed to load sanctions');
          setSanctions([]); // Set empty array on error
        })
        .finally(() => {
          setSanctionsLoading(false);
        });
    }
  }, [team, mounted]);

  // Don't render until mounted
  if (!mounted) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
      </Box>
    );
  }

  // Show loading state (either main loading or fallback loading)
  if (loading || fallbackLoading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Adatok betöltése...
          </Typography>
        </Container>
      </Box>
    );
  }

  // Show error state - handle empty data scenario vs actual errors
  if (isEmptyDataScenario(error ? new Error(error) : null, allTeams) && !loading && !fallbackLoading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <EmptyDataDisplay 
            type="teams"
            onRetry={refetch}
            variant="paper"
          />
        </Container>
      </Box>
    );
  }

  // Handle actual errors
  if (error && !loading && !fallbackLoading) {
    const errorInfo = getErrorInfo('teams', new Error(error));
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

  if (!team) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Stack spacing={4} alignItems="center">
            <Button
              startIcon={<BackIcon />}
              onClick={() => router.push('/csapatok')}
              sx={{ alignSelf: 'flex-start' }}
            >
              Vissza a csapatokhoz
            </Button>
            
            <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 600 }}>
              <Typography variant="h4" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                Csapat nem található
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                A {teamId}. számú csapat nem létezik, vagy még nem érhető el nyilvánosan.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/csapatok')}
                sx={{ mt: 2 }}
              >
                Vissza a csapatokhoz
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

          {/* Team Header */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              background: `linear-gradient(135deg, ${getTeamColor(team)} 0%, rgba(0,0,0,0.7) 100%)`,
              color: 'white',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 'inherit',
                zIndex: 1,
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: getTeamColor(team),
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {team ? getTeamClassName(team) : 'T'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {teamDisplayName}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {team ? `${team.start_year}. évfolyam ${team.tagozat} tagozat` : 'Ismeretlen osztály'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {standing && (
                    <>
                      <Chip
                        icon={<TrophyIcon />}
                        label={`${standing.position || '?'}. hely`}
                        color={(standing.position || 0) <= 3 ? 'success' : 'default'}
                        sx={{ 
                          color: 'white', 
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          '& .MuiChip-icon': { color: 'white' },
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                      <Chip
                        label={`${standing.points || 0} pont`}
                        sx={{ 
                          color: 'white', 
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    </>
                  )}
                  {!standing && (
                    <Chip
                      label="Még nincs rangsor adat"
                      sx={{ 
                        color: 'white', 
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    />
                  )}
                  {/* Show sanctions indicator */}
                  {sanctions.length > 0 && (
                    <Chip
                      icon={<SanctionIcon />}
                      label={`${sanctions.length} szankció`}
                      sx={{ 
                        color: 'white', 
                        backgroundColor: 'rgba(211, 47, 47, 0.8)',
                        '& .MuiChip-icon': { color: 'white' },
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Team Stats Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {standing?.played || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Meccsek
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.light' }}>
                  {standing?.won || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Győzelem
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.light' }}>
                  {standing?.drawn || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Döntetlen
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.light' }}>
                  {standing?.lost || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Vereség
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {standing?.goals_for || 0}:{standing?.goals_against || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Gólok
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: (standing?.goal_difference || 0) >= 0 ? 'success.light' : 'error.light'
                  }}
                >
                  {(standing?.goal_difference || 0) > 0 ? '+' : ''}{standing?.goal_difference || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Különbség
                </Typography>
              </Box>
              {/* Sanctions summary */}
              {sanctions.length > 0 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    -{sanctions.reduce((total, sanction) => total + sanction.minus_points, 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pontlevonás
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Team Sanctions */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Szankciók
            </Typography>
            
            {sanctionsLoading ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Szankciók betöltése...
                </Typography>
              </Paper>
            ) : sanctionsError ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                  Hiba történt
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sanctionsError}
                </Typography>
              </Paper>
            ) : sanctions.length > 0 ? (
              <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={2}>
                  {sanctions.map((sanction) => (
                    <Box 
                      key={sanction.id}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: sanctions.indexOf(sanction) < sanctions.length - 1 ? '1px solid' : 'none',
                        borderBottomColor: 'divider'
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        {sanction.reason && (
                          <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500 }}>
                            {sanction.reason}
                          </Typography>
                        )}
                        {sanction.date_created && (
                          <Typography variant="body2" color="text.secondary">
                            {new Date(sanction.date_created).toLocaleDateString('hu-HU')}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={`-${sanction.minus_points}`}
                        size="small"
                        sx={{
                          backgroundColor: 'error.main',
                          color: 'error.contrastText',
                          fontWeight: 'bold',
                          minWidth: '60px'
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Nincsenek szankciók
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ez a csapat még nem kapott pontlevonást vagy egyéb szankciót.
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Team Players */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Csapat Játékosai ({actualTeamPlayers.length})
            </Typography>
            
            {actualTeamPlayers.length > 0 ? (
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'action.selected' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', py: 2 }}>Játékos</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.primary', py: 2 }}>Szerepkör</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.primary', py: 2 }}>Gólok</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actualTeamPlayers.map((player) => {
                      // Find goal data for this player
                      const goalData = teamPlayers.find(scorer => 
                        scorer.player_name === player.name || scorer.player_id === player.id
                      );
                      
                      return (
                        <TableRow 
                          key={player.id}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'action.hover',
                            },
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                          }}
                          onClick={() => router.push(`/jatekosok/${player.id}`)}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {player.name}
                              </Typography>
                              {player.csk && (
                                <Chip 
                                  label="Kapitány" 
                                  size="small" 
                                  color="primary"
                                  sx={{ fontSize: '0.7rem', height: '20px' }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              {player.csk ? 'Csapatkapitány' : 'Játékos'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {goalData ? (
                              <Chip
                                icon={<GoalIcon />}
                                label={goalData.goals}
                                size="small"
                                color={goalData.goals >= 5 ? 'success' : 'default'}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                0
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Még nincsenek regisztrált játékosok
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A csapat játékosai itt jelennek majd meg, amikor befejeződik a regisztráció.
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Top Goal Scorers from Team */}
          {teamPlayers.length > 0 && (
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                Góllövők ({teamPlayers.length})
              </Typography>
              
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'action.selected' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', py: 2 }}>Játékos</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.primary', py: 2 }}>Gólok</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.primary', py: 2 }}>Liga Pozíció</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamPlayers
                      .sort((a, b) => b.goals - a.goals) // Sort by goals descending
                      .map((player) => (
                        <TableRow 
                          key={player.id}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'action.hover',
                            },
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                          }}
                          onClick={() => router.push(`/jatekosok/${player.id}`)}
                        >
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {player.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Chip
                              icon={<GoalIcon />}
                              label={player.goals}
                              size="small"
                              color={player.goals >= 5 ? 'success' : player.goals >= 3 ? 'warning' : 'default'}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              #{player.position}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Recent Matches */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Meccsek ({teamMatches.length})
            </Typography>
            
            {teamMatches.length > 0 ? (
              <Stack spacing={2}>
                {teamMatches.slice(0, 5).map((match) => (
                  <Card 
                    key={match.id}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        boxShadow: 6, 
                        transform: 'translateY(-2px)',
                        backgroundColor: 'action.hover',
                      },
                      transition: 'all 0.2s ease-in-out'
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
                  Még nincsenek meccsek meghirdetve
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A csapat meccsei itt jelennek majd meg, amikor elkezd működni a bajnokság.
                </Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  SportsScore as GoalIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTournamentData } from '@/hooks/useTournamentData';
import { useTournamentSelection } from '@/hooks/useTournamentContext';
import { getClassColor } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const { selectedTournamentId, setSelectedTournamentId, isReady } = useTournamentSelection();
  
  const { standings, topScorers, teams, matches, loading, error, refetch } = useTournamentData(selectedTournamentId || undefined);
  
  const teamId = parseInt(params.id as string);
  const team = teams.find(t => t.id === teamId);
  const standing = standings.find(s => s.team_id === teamId);
  const teamMatches = matches.filter(match => 
    match.homeTeam === team?.name || match.awayTeam === team?.name
  );
  const teamPlayers = topScorers.filter(player => player.teamId === teamId);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSeasonChange = (season: string) => {
    setSelectedTournamentId(parseInt(season));
  };

  // Don't render until mounted and tournament is ready
  if (!mounted || !isReady || selectedTournamentId === null) {
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
        <Header selectedSeason={selectedTournamentId.toString()} onSeasonChange={handleSeasonChange} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Adatok betöltése...
          </Typography>
        </Container>
      </Box>
    );
  }

  // Show error state
  if (error || (isEmptyDataError(teams) && !loading)) {
    const errorInfo = getErrorInfo('teams', error);
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header selectedSeason={selectedTournamentId.toString()} onSeasonChange={handleSeasonChange} />
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
    const errorInfo = getErrorInfo('team');
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header selectedSeason={selectedTournamentId.toString()} onSeasonChange={handleSeasonChange} />
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
      <Header selectedSeason={selectedTournamentId.toString()} onSeasonChange={handleSeasonChange} />
      
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
          <Paper elevation={2} sx={{ p: 4, backgroundColor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: team?.className ? getClassColor(team.className) : 'grey.500',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {team?.className ? team.className.split(' ')[1] : 'T'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {team.name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {team?.className || 'Ismeretlen osztály'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<TrophyIcon />}
                    label={`${standing?.position || '?'}. hely`}
                    color={(standing?.position || 0) <= 3 ? 'success' : 'default'}
                    sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip
                    label={`${standing?.points || 0} pont`}
                    sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
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
            </Box>
          </Paper>

          {/* Team Players */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Csapat Játékosai ({teamPlayers.length})
            </Typography>
            
            {teamPlayers.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#fafafa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Játékos</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Gólok</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Liga Pozíció</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamPlayers.map((player) => (
                      <TableRow 
                        key={player.id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f0f0f0' },
                          cursor: 'pointer'
                        }}
                        onClick={() => router.push(`/jatekosok/${player.id}`)}
                      >
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {player.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<GoalIcon />}
                            label={player.goals}
                            size="small"
                            color={player.goals >= 5 ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            #{player.position}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Nincs regisztrált góllövő játékos
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Recent Matches */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Legutóbbi Meccsek ({teamMatches.length})
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
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', py: 4, mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 SZLG - Labdarúgó Bajnokság
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

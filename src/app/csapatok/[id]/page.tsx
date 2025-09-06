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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  SportsScore as GoalIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import { teams, matches, topScorers, getClassColor, getMatchesByTeam } from '@/data/mockData';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [mounted, setMounted] = React.useState(false);

  const teamId = parseInt(params.id as string);
  const team = teams.find(t => t.id === teamId);
  const teamMatches = team ? getMatchesByTeam(team.id) : [];
  const teamPlayers = team ? topScorers.filter(p => p.teamId === team.id) : [];

  React.useEffect(() => {
    // Load selected season from localStorage
    const saved = localStorage.getItem('szlg-selected-season');
    if (saved) {
      setSelectedSeason(saved);
    }
    setMounted(true);
  }, []);

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    localStorage.setItem('szlg-selected-season', season);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
      </Box>
    );
  }

  if (!team) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" color="error.main" gutterBottom>
            Csapat nem található
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            A keresett csapat nem létezik vagy törölve lett.
          </Typography>
          <Button
            variant="contained"
            startIcon={<BackIcon />}
            onClick={() => router.push('/csapatok')}
          >
            Vissza a csapatokhoz
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
      
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
                  bgcolor: getClassColor(team.className),
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {team.className.split(' ')[1]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {team.name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {team.className}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<TrophyIcon />}
                    label={`${team.position}. hely`}
                    color={team.position <= 3 ? 'success' : 'default'}
                    sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip
                    label={`${team.points} pont`}
                    sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Team Stats Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {team.played}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Meccsek
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.light' }}>
                  {team.won}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Győzelem
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.light' }}>
                  {team.drawn}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Döntetlen
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.light' }}>
                  {team.lost}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Vereség
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {team.goalsFor}:{team.goalsAgainst}
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
                    color: team.goalDifference >= 0 ? 'success.light' : 'error.light'
                  }}
                >
                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
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

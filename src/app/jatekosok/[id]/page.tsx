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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  SportsScore as GoalIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import { topScorers, teams, matches, getClassColor, getMatchesByTeam } from '@/data/mockData';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [mounted, setMounted] = React.useState(false);

  const playerId = parseInt(params.id as string);
  const player = topScorers.find(p => p.id === playerId);
  const playerTeam = player ? teams.find(t => t.id === player.teamId) : null;
  const teamMatches = playerTeam ? getMatchesByTeam(playerTeam.id) : [];

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

  if (!player || !playerTeam) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" color="error.main" gutterBottom>
            Játékos nem található
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            A keresett játékos nem létezik vagy törölve lett.
          </Typography>
          <Button
            variant="contained"
            startIcon={<BackIcon />}
            onClick={() => router.push('/jatekosok')}
          >
            Vissza a játékosokhoz
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

          {/* Player Header */}
          <Paper elevation={2} sx={{ p: 4, backgroundColor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: getClassColor(playerTeam.className),
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
                  {playerTeam.name} ({playerTeam.className})
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<TrophyIcon />}
                    label={`#${player.position} góllövő`}
                    color={player.position <= 3 ? 'success' : 'default'}
                    sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Chip
                    icon={<GoalIcon />}
                    label={`${player.goals} gól`}
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
                  Gólok
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  #{player.position}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Liga Pozíció
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {playerTeam.played}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Csapat Meccsek
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {playerTeam.points}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Csapat Pontok
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Player Statistics */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Játékos Statisztikák
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#fafafa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Statisztika</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Érték</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Gólok száma</TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={<GoalIcon />}
                        label={player.goals}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Góllövőlista pozíció</TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        #{player.position}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Csapat</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={playerTeam.name}
                        sx={{ 
                          backgroundColor: getClassColor(playerTeam.className),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        onClick={() => router.push(`/csapatok/${playerTeam.id}`)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Csapat pozíció</TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">
                        {playerTeam.position}. hely
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Team Recent Matches */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Csapat Legutóbbi Meccsek ({teamMatches.length})
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

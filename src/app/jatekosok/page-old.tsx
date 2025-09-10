'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Stack,
  Divider,
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
  Alert,
} from '@mui/material';
import Header from '@/components/Header';
import SimpleLayout from '@/components/SimpleLayout';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTournamentData } from '@/hooks/useTournamentData';
import { getClassColor } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';

export default function PlayersPage() {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [mounted, setMounted] = React.useState(false);
  const { topScorers, teams, loading, error, refetch } = useTournamentData();

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

  // Show message for upcoming season
  if (selectedSeason === '2025-26') {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" color="primary.main" gutterBottom>
            Játékosok
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A SZLG Liga 25/26 játékos adatai elérhető lesznek a szezon kezdete után.
            <br />
            Kezdés: 2025. október 15.
          </Typography>
        </Container>
      </Box>
    );
  }

  // Get team info for each player
  const playersWithTeamInfo = topScorers.map(player => {
    const team = teams.find(t => t.id === player.teamId);
    return {
      ...player,
      team: team,
      className: team?.className || ''
    };
  });

  // Group players by team
  const playersByTeam = playersWithTeamInfo.reduce((acc, player) => {
    if (!acc[player.teamName]) {
      acc[player.teamName] = [];
    }
    acc[player.teamName].push(player);
    return acc;
  }, {} as Record<string, typeof playersWithTeamInfo>);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header selectedSeason={selectedSeason} onSeasonChange={handleSeasonChange} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Page Title */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1
              }}
            >
              Játékosok
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              SZLG Liga 24/25 - Játékos statisztikák
            </Typography>
          </Box>

          <Divider />

          {/* Top Goal Scorers Summary */}
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              Top 10 Góllövő
            </Typography>
            
            <TableContainer component={Paper} elevation={1}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: 'background.paper' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Játékos</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Csapat</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Osztály</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Gólok</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playersWithTeamInfo.slice(0, 10).map((player, index) => (
                    <TableRow 
                      key={player.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:hover': { backgroundColor: '#f0f0f0' },
                        cursor: 'pointer'
                      }}
                      onClick={() => router.push(`/jatekosok/${player.id}`)}
                    >
                      <TableCell>
                        <Chip
                          label={index + 1}
                          size="small"
                          color={index < 3 ? 'primary' : 'default'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {player.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {player.teamName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: getClassColor(player.className),
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            mx: 'auto'
                          }}
                        >
                          {player.className.split(' ')[1]}
                        </Avatar>
                      </TableCell>
                      <TableCell align="center">
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }}
                        >
                          {player.goals}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider />

          {/* Players by Team */}
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              Játékosok Csapat Szerint
            </Typography>

            <Stack spacing={3}>
              {Object.entries(playersByTeam)
                .sort(([, a], [, b]) => b.reduce((sum, p) => sum + p.goals, 0) - a.reduce((sum, p) => sum + p.goals, 0))
                .map(([teamName, teamPlayers]) => {
                  const firstPlayer = teamPlayers[0];
                  const totalGoals = teamPlayers.reduce((sum, p) => sum + p.goals, 0);
                  
                  return (
                    <Card key={teamName} elevation={1}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: getClassColor(firstPlayer.className),
                              color: 'white',
                              fontWeight: 'bold',
                              mr: 2
                            }}
                          >
                            {firstPlayer.className.split(' ')[1]}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {teamName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {teamPlayers.length} játékos • {totalGoals} összesített gól
                            </Typography>
                          </Box>
                        </Box>

                        <Box 
                          sx={{ 
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                            gap: 2
                          }}
                        >
                          {teamPlayers.map(player => (
                            <Paper 
                              key={player.id}
                              variant="outlined"
                              sx={{ 
                                p: 2,
                                backgroundColor: '#fafafa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: '#e0e0e0',
                                  transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease'
                              }}
                              onClick={() => router.push(`/jatekosok/${player.id}`)}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {player.name}
                              </Typography>
                              <Chip
                                label={`${player.goals} gól`}
                                size="small"
                                color={player.goals >= 5 ? 'success' : 'default'}
                                sx={{ fontWeight: 'bold' }}
                              />
                            </Paper>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
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

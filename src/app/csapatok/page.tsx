'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { ArrowBack, EmojiEvents, Person } from '@mui/icons-material';
import Header from '@/components/Header';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { getClassColor, getClassColorLight, hasTournamentStarted, getTeamDisplayName, getTeamClassName } from '@/utils/dataUtils';
import type { TeamRoster, Team } from '@/types/api';

function CsapatokContent() {
  const [selectedTeam, setSelectedTeam] = useState<TeamRoster | null>(null);
  const searchParams = useSearchParams();
  const { teams, standings, topScorers, tournament, loading, error } = useTournamentContext();

  // Auto-select team from URL parameter
  useEffect(() => {
    const teamParam = searchParams.get('team');
    if (teamParam && !selectedTeam && teams.length > 0) {
      const team = teams.find(t => t.tagozat === teamParam);
      if (team) {
        setSelectedTeam({
          teamId: team.id || 0,
          teamName: team.tagozat,
          className: team.tagozat,
          players: [] // Would need to fetch players separately
        });
      }
    }
  }, [searchParams, teams, selectedTeam]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Alert severity="error" sx={{ backgroundColor: '#d32f2f', color: '#fff' }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  // Check if tournament has started
  if (tournament && !hasTournamentStarted(tournament)) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Stack spacing={4} sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              A torna még nem kezdődött el
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {tournament.name}
            </Typography>
            {tournament.start_date && (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Kezdés dátuma: {new Date(tournament.start_date).toLocaleDateString('hu-HU')}
              </Typography>
            )}
            {tournament.registration_by_link ? (
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                  Regisztráció a tornára:
                </Typography>
                <a 
                  href={tournament.registration_by_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#42a5f5', 
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                >
                  Regisztrálok a tornára
                </a>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 4 }}>
                A regisztráció hamarosan elérhető lesz
              </Typography>
            )}
          </Stack>
        </Container>
      </Box>
    );
  }

  const getTeamStats = (teamId: number) => {
    return standings.find(standing => standing.team_id === teamId);
  };

  const getPlayerGoalPosition = (playerName: string, teamName: string) => {
    return topScorers.find(scorer => 
      scorer.player_name === playerName && scorer.team_name === teamName
    );
  };

  const handleTeamSelect = (team: Team) => {
    const teamDisplayName = getTeamDisplayName(team);
    setSelectedTeam({
      teamId: team.id || 0,
      teamName: teamDisplayName,
      className: getTeamClassName(team),
      players: [] // Would need to fetch players separately
    });
  };

  const handleBackToTeams = () => {
    setSelectedTeam(null);
  };

  if (selectedTeam) {
    const team = teams.find(t => t.id === selectedTeam.teamId);
    const teamStats = team ? getTeamStats(team.id || 0) : null;

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={handleBackToTeams} sx={{ mr: 1, color: 'text.primary' }}>
                <ArrowBack />
              </IconButton>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: getClassColor(selectedTeam.className)
                }}
              >
                {selectedTeam.className}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Team Stats Card */}
            {teamStats && (
              <Card 
                sx={{ 
                  border: `2px solid ${getClassColor(selectedTeam.className)}`,
                  backgroundColor: 'background.paper',
                  borderRadius: 2
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                    <EmojiEvents sx={{ mr: 1, color: getClassColor(selectedTeam.className) }} />
                    Csapat Statisztikái
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Helyezés</Typography>
                      <Typography variant="h6" sx={{ color: getClassColor(selectedTeam.className), fontWeight: 'bold' }}>
                        {teamStats.position}.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Pontok</Typography>
                      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{teamStats.points}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Mérk. / Győz. / Dönt. / Veszt.</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {teamStats.played} / {teamStats.won} / {teamStats.drawn} / {teamStats.lost}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Gólkülönbség</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {teamStats.goals_for}:{teamStats.goals_against} ({teamStats.goal_difference > 0 ? '+' : ''}{teamStats.goal_difference})
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 1,
              color: 'text.primary'
            }}
          >
            Csapatok
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              mb: 4
            }}
          >
            {tournament?.name || 'SZLG LIGA'} bajnokságban
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {teams
            .sort((a, b) => {
              const teamA = getTeamStats(a.id || 0);
              const teamB = getTeamStats(b.id || 0);
              return (teamA?.position || 999) - (teamB?.position || 999);
            })
            .map((team) => {
              const teamStats = getTeamStats(team.id || 0);
              const teamDisplayName = getTeamDisplayName(team);
              const teamClassName = getTeamClassName(team);
              const teamScorers = topScorers.filter(scorer => scorer.team_name === teamDisplayName).length;

              return (
                <Card 
                  key={team.id}
                  sx={{ 
                    height: '100%',
                    border: `2px solid ${getClassColor(teamClassName)}`,
                    backgroundColor: 'background.paper',
                    cursor: 'pointer',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                      borderColor: getClassColor(teamClassName)
                    }
                  }}
                  onClick={() => handleTeamSelect(team)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: getClassColor(teamClassName)
                        }}
                      >
                        {teamDisplayName}
                      </Typography>
                      {teamStats && (
                        <Chip 
                          label={`${teamStats.position}.`}
                          size="small"
                          sx={{ 
                            backgroundColor: getClassColor(teamClassName),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Góllövők
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                          {teamScorers}
                        </Typography>
                      </Box>
                      {teamStats && (
                        <>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Helyezés
                            </Typography>
                            <Typography variant="h6" sx={{ color: getClassColor(teamClassName), fontWeight: 'bold' }}>
                              {teamStats.position}.
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Pontok
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                              {teamStats.points}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ 
                        mt: 1,
                        backgroundColor: getClassColor(teamClassName),
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: getClassColor(teamClassName),
                          filter: 'brightness(0.9)'
                        }
                      }}
                    >
                      Részletek megtekintése
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </Box>
      </Container>
    </Box>
  );
}

export default function CsapatokPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    }>
      <CsapatokContent />
    </Suspense>
  );
}

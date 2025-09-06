'use client';

import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import { ArrowBack, EmojiEvents, Person } from '@mui/icons-material';
import Header from '@/components/Header';
import { 
  getAllTeamRosters, 
  getClassColor, 
  getClassColorLight, 
  getLeagueTable,
  getTopScorers,
  type TeamRoster,
  type Team,
  type Player
} from '@/data/mockData';

export default function CsapatokPage() {
  const [selectedTeam, setSelectedTeam] = useState<TeamRoster | null>(null);
  const searchParams = useSearchParams();
  const teamRosters = getAllTeamRosters();
  const leagueTable = getLeagueTable();
  const topScorers = getTopScorers();

  // Auto-select team from URL parameter
  useEffect(() => {
    const teamParam = searchParams.get('team');
    if (teamParam && !selectedTeam) {
      const team = teamRosters.find(roster => roster.teamName === teamParam);
      if (team) {
        setSelectedTeam(team);
      }
    }
  }, [searchParams, teamRosters, selectedTeam]);

  const getTeamStats = (teamName: string): Team | undefined => {
    return leagueTable.find(team => team.name === teamName);
  };

  const getPlayerGoalPosition = (playerName: string, teamName: string): Player | undefined => {
    return topScorers.find(scorer => 
      scorer.name === playerName && scorer.teamName === teamName
    );
  };

  const handleTeamSelect = (team: TeamRoster) => {
    setSelectedTeam(team);
  };

  const handleBackToTeams = () => {
    setSelectedTeam(null);
  };

  if (selectedTeam) {
    const teamStats = getTeamStats(selectedTeam.teamName);
    const teamScorers = selectedTeam.players
      .map(playerName => ({
        name: playerName,
        goalData: getPlayerGoalPosition(playerName, selectedTeam.teamName)
      }))
      .filter(player => player.goalData)
      .sort((a, b) => (a.goalData?.goals || 0) - (b.goalData?.goals || 0))
      .reverse();

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
          {/* Team Stats and Goal Scorers Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
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
                        {teamStats.goalsFor}:{teamStats.goalsAgainst} ({teamStats.goalDifference > 0 ? '+' : ''}{teamStats.goalDifference})
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Goal Scorers Card */}
            <Card sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  <EmojiEvents sx={{ mr: 1, color: '#ffd700' }} />
                  Csapat Gólkirályai
                </Typography>
                
                {teamScorers.length > 0 ? (
                  <List>
                    {teamScorers.map((scorer, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2, 
                              backgroundColor: index < 3 ? '#ffca28' : 'primary.main',
                              color: index < 3 ? '#000' : '#fff',
                              width: 32,
                              height: 32,
                              fontSize: '0.875rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {scorer.goalData?.position}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                              {scorer.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Liga helyezés: {scorer.goalData?.position}. hely
                            </Typography>
                          </Box>
                          <Chip 
                            label={`${scorer.goalData?.goals} gól`}
                            sx={{ 
                              backgroundColor: 'success.main',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                            size="small"
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nincs góllövő a csapatból a top 15-ben.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* All Players Card */}
          <Card sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                <Person sx={{ mr: 1, color: getClassColor(selectedTeam.className) }} />
                Összes Játékos ({selectedTeam.players.length})
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 1 }}>
                {selectedTeam.players.map((player, index) => {
                  const goalData = getPlayerGoalPosition(player, selectedTeam.teamName);
                  return (
                    <Card 
                      key={index}
                      variant="outlined" 
                      sx={{ 
                        backgroundColor: goalData ? 'rgba(76, 175, 80, 0.2)' : 'background.paper',
                        border: goalData ? '1px solid' : '1px solid',
                        borderColor: goalData ? 'success.main' : 'divider',
                        borderRadius: 1
                      }}
                    >
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                          {player}
                        </Typography>
                        {goalData && (
                          <Box sx={{ mt: 0.5 }}>
                            <Chip 
                              label={`#${goalData.position} - ${goalData.goals} gól`}
                              size="small"
                              sx={{ 
                                fontSize: '0.75rem',
                                backgroundColor: 'success.main',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
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
            SZLG LIGA 24/25 bajnokságban
          </Typography>
        </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {teamRosters
          .sort((a, b) => {
            const teamA = getTeamStats(a.teamName);
            const teamB = getTeamStats(b.teamName);
            return (teamA?.position || 999) - (teamB?.position || 999);
          })
          .map((roster) => {
            const teamStats = getTeamStats(roster.teamName);
            const teamScorers = roster.players.filter(playerName => 
              getPlayerGoalPosition(playerName, roster.teamName)
            ).length;

            return (
              <Card 
                key={roster.teamId}
                sx={{ 
                  height: '100%',
                  border: `2px solid ${getClassColor(roster.className)}`,
                  backgroundColor: 'background.paper',
                  cursor: 'pointer',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                    borderColor: getClassColor(roster.className)
                  }
                }}
                onClick={() => handleTeamSelect(roster)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: getClassColor(roster.className)
                      }}
                    >
                      {roster.className}
                    </Typography>
                    {teamStats && (
                      <Chip 
                        label={`${teamStats.position}.`}
                        size="small"
                        sx={{ 
                          backgroundColor: getClassColor(roster.className),
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
                        Játékosok
                      </Typography>
                      <Typography variant="h6" sx={{ color: getClassColor(roster.className), fontWeight: 'bold' }}>
                        {roster.players.length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Góllövők
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        {teamScorers}
                      </Typography>
                    </Box>
                    {teamStats && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Pontok
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                          {teamStats.points}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 1,
                      backgroundColor: getClassColor(roster.className),
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: getClassColor(roster.className),
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

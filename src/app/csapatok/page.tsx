'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  LinearProgress,
  Paper
} from '@mui/material';
import TeamLogo from '@/components/TeamLogo';
import {
  SportsScore as GoalIcon,
  Group as GroupIcon,
  Shield as ShieldIcon,
  Star as StarIcon
} from '@mui/icons-material';
import Header from '@/components/Header';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { getTeamColor, hasTournamentStarted, getTeamDisplayName, getTeamClassName } from '@/utils/dataUtils';

function CsapatokContent() {
  const router = useRouter();
  const { teams, standings, topScorers, tournament, loading, error } = useTournamentContext();

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

  // Calculate additional statistics
  const getTeamPlayersCount = (team: any) => team.players?.length || 0;
  const getTeamCaptainsCount = (team: any) => team.players?.filter((p: any) => p.csk).length || 0;
  const getTeamGoalScorers = (teamDisplayName: string) => 
    topScorers.filter(scorer => scorer.team_name === teamDisplayName);
  const getTeamTopScorer = (teamDisplayName: string) => {
    const scorers = getTeamGoalScorers(teamDisplayName);
    return scorers.length > 0 ? scorers.reduce((prev, current) => 
      (prev.goals > current.goals) ? prev : current
    ) : null;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
  <Header />
  <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Tournament Overview Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Csapatok
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.9,
                mb: 3
              }}
            >
              {tournament?.name || 'SZLG LIGA'} bajnokságban
            </Typography>
          </Box>

          {/* Tournament Statistics */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 3, textAlign: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {teams.length}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Regisztrált csapat
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {teams.reduce((total, team) => total + (team.players?.length || 0), 0)}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Összesen játékos
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {topScorers.length}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Góllövő
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {topScorers.reduce((total, scorer) => total + scorer.goals, 0)}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Összesen gól
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4 }}>
          {teams
            .map((team) => {
              const teamStats = getTeamStats(team.id || 0);
              const teamDisplayName = getTeamDisplayName(team);
              const teamClassName = getTeamClassName(team);
              const teamScorers = getTeamGoalScorers(teamDisplayName);
              const topScorer = getTeamTopScorer(teamDisplayName);
              const playersCount = getTeamPlayersCount(team);
              const captainsCount = getTeamCaptainsCount(team);

              return (
                <Card 
                  key={team.id}
                  sx={{ 
                    height: '100%',
                    border: `3px solid ${getTeamColor(team)}`,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#181c24' : 'background.paper',
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: (theme) => theme.palette.mode === 'dark' ? 4 : 2,
                    '&:hover': {
                      boxShadow: 12,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease-in-out',
                    }
                  }}
                  onClick={() => router.push(`/csapatok/${team.id}`)}
                >
                  {/* Team Header with Class Color */}
                  <Box 
                    sx={{ 
                      background: (theme) => theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${getTeamColor(team)} 0%, #232a36 100%)`
                        : `linear-gradient(135deg, ${getTeamColor(team)} 0%, ${getTeamColor(team)}dd 100%)`,
                      color: 'white',
                      p: 3,
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <TeamLogo team={team} teamName={teamDisplayName} size={50} fontSize="1.5rem" fallbackColor="rgba(255,255,255,0.2)" showBorder />
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {teamDisplayName}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {team.start_year}. évfolyam • {team.tagozat} tagozat
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* Team Composition */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                        Csapat összetétel
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Chip
                          icon={<GroupIcon />}
                          label={`${playersCount} játékos`}
                          variant="outlined"
                          size="small"
                          sx={{
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232a36' : 'background.paper',
                            color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                            borderColor: (theme) => theme.palette.mode === 'dark' ? '#232a36' : 'divider',
                          }}
                        />
                        {captainsCount > 0 && (
                          <Chip
                            icon={<ShieldIcon />}
                            label={`${captainsCount} kapitány`}
                            variant="outlined"
                            size="small"
                            color="primary"
                            sx={{
                              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232a36' : 'background.paper',
                              color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                              borderColor: (theme) => theme.palette.mode === 'dark' ? '#232a36' : 'divider',
                            }}
                          />
                        )}
                      </Box>
                      
                      {topScorer && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StarIcon sx={{ color: 'gold', fontSize: '1.2rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            Legjobb góllövő: <strong>{topScorer.name}</strong> ({topScorer.goals} gól)
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Team Statistics */}
                    {teamStats ? (
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                          Bajnoki statisztikák
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                          <Box sx={{ textAlign: 'center', p: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232a36' : 'action.hover', borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTeamColor(team) }}>
                              {teamStats.points}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pont
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center', p: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232a36' : 'action.hover', borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                              {teamStats.played}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Meccs
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Győzelmek aránya
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            {teamStats.played > 0 ? Math.round((teamStats.won / teamStats.played) * 100) : 0}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={teamStats.played > 0 ? (teamStats.won / teamStats.played) * 100 : 0}
                          sx={{ 
                            height: 8, 
                            borderRadius: 1,
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#232a36' : 'action.hover',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getTeamColor(team)
                            }
                          }}
                        />
                        {/* Combined G:D:V Format with Color Coding */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232a36' : 'action.hover',
                            borderRadius: 2,
                            p: 1.5,
                            gap: 0.5
                          }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: '#4caf50',
                                minWidth: '20px',
                                textAlign: 'center'
                              }}
                            >
                              {teamStats.won}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">:</Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: '#ff9800',
                                minWidth: '20px',
                                textAlign: 'center'
                              }}
                            >
                              {teamStats.drawn}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">:</Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: '#f44336',
                                minWidth: '20px',
                                textAlign: 'center'
                              }}
                            >
                              {teamStats.lost}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
                              •
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                              {teamStats.goals_for}:{teamStats.goals_against}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : null}

                {/* Goal Scorers Summary */}
                {teamScorers.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <GoalIcon sx={{ color: 'success.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {teamScorers.length} góllövő • {teamScorers.reduce((sum, s) => sum + s.goals, 0)} gól
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>

                  {/* Action Button */}
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/csapatok/${team.id}`);
                      }}
                      sx={{ 
                        backgroundColor: getTeamColor(team),
                        color: 'white',
                        fontWeight: 'bold',
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: getTeamColor(team),
                          filter: 'brightness(0.9)'
                        }
                      }}
                    >
                      Részletes nézet
                    </Button>
                  </Box>
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

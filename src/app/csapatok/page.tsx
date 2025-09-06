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
} from '@mui/material';
import Header from '@/components/Header';
import { teams, getClassColor } from '@/data/mockData';

export default function TeamsPage() {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [mounted, setMounted] = React.useState(false);

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
            Csapatok
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A SZLG Liga 25/26 csapatai elérhető lesznek a szezon kezdete után.
            <br />
            Kezdés: 2025. október 15.
          </Typography>
        </Container>
      </Box>
    );
  }

  // Group teams by class
  const teamsByClass = teams.reduce((acc, team) => {
    const classLetter = team.className.split(' ')[1];
    if (!acc[classLetter]) {
      acc[classLetter] = [];
    }
    acc[classLetter].push(team);
    return acc;
  }, {} as Record<string, typeof teams>);

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
              Csapatok
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              SZLG Liga 24/25 - Összes csapat osztály szerint
            </Typography>
          </Box>

          <Divider />

          {/* Teams by Class */}
          {Object.entries(teamsByClass).sort().map(([classLetter, classTeams]) => (
            <Box key={classLetter}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: getClassColor(`20 ${classLetter}`),
                    color: 'white',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                >
                  {classLetter}
                </Avatar>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  {classLetter} Osztály ({classTeams.length} csapat)
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                  gap: 3,
                  mb: 4
                }}
              >
                {classTeams.sort((a, b) => a.position - b.position).map((team) => (
                  <Card 
                    key={team.id}
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => router.push(`/csapatok/${team.id}`)}
                  >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: getClassColor(team.className),
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              mr: 2
                            }}
                          >
                            {classLetter}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600,
                                lineHeight: 1.2,
                                mb: 0.5
                              }}
                            >
                              {team.name}
                            </Typography>
                            <Chip 
                              label={`${team.position}. hely`}
                              size="small"
                              color={team.position <= 3 ? 'success' : 'default'}
                              sx={{ fontSize: '0.75rem' }}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Meccsek
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {team.played}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Pontok
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary.main">
                              {team.points}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Győzelem
                            </Typography>
                            <Typography variant="body2" color="success.main">
                              {team.won}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Vereség
                            </Typography>
                            <Typography variant="body2" color="error.main">
                              {team.lost}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                          <Typography variant="caption" color="text.secondary">
                            Gólkülönbség: 
                          </Typography>
                          <Typography 
                            variant="body2" 
                            component="span"
                            sx={{ 
                              fontWeight: 'bold',
                              color: team.goalDifference >= 0 ? 'success.main' : 'error.main',
                              ml: 1
                            }}
                          >
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            ({team.goalsFor}:{team.goalsAgainst})
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                ))}
              </Box>

              {Object.entries(teamsByClass).findIndex(([key]) => key === classLetter) < Object.keys(teamsByClass).length - 1 && (
                <Divider sx={{ my: 4 }} />
              )}
            </Box>
          ))}

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

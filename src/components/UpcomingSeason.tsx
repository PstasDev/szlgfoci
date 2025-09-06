'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Container,
  Chip,
} from '@mui/material';
import {
  HowToReg as RegisterIcon,
  SportsSoccer as SoccerIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

interface UpcomingSeasonProps {
  season?: {
    id: string;
    name: string;
    displayName: string;
    startDate?: string;
    registrationOpen?: boolean;
    registrationLink?: string;
  };
}

const UpcomingSeason: React.FC<UpcomingSeasonProps> = ({ season }) => {
  // Default season data if none provided
  const defaultSeason = {
    id: '2025-26',
    name: 'SZLG Liga 25/26',
    displayName: 'SZLG Liga 25/26 - Kezdés: 2025. október 15.',
    startDate: '2025-10-15',
    registrationOpen: true,
    registrationLink: '#'
  };

  const currentSeason = season || defaultSeason;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysUntilStart = (dateString: string) => {
    const startDate = new Date(dateString);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilStart = currentSeason.startDate ? calculateDaysUntilStart(currentSeason.startDate) : null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      <Stack spacing={{ xs: 3, sm: 4 }} alignItems="center">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box sx={{ 
            fontSize: { xs: '3rem', sm: '4rem' }, 
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            ⚽ 🚧 ⏰
          </Box>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#e8eaed',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              textAlign: 'center',
              mb: 2
            }}
          >
            {currentSeason.name}
          </Typography>
          <Chip 
            label="Hamarosan"
            sx={{ 
              backgroundColor: '#ff9800',
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              px: { xs: 1.5, sm: 2 },
              py: 1
            }}
          />
        </Box>

        {/* Coming Soon Card */}
        <Paper 
          elevation={3}
          sx={{ 
            p: { xs: 2.5, sm: 3, md: 4 },
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            borderRadius: '16px',
            width: '100%',
            maxWidth: 600
          }}
        >
          <Stack spacing={{ xs: 2.5, sm: 3 }} alignItems="center" textAlign="center">
            <SoccerIcon sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: '#4285f4' }} />
            
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#e8eaed',
                fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' }
              }}
            >
              A liga még nem kezdődött el!
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#9aa0a6',
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                maxWidth: 400,
                px: { xs: 1, sm: 0 }
              }}
            >
              Az új szezon előkészületei folyamatban vannak. Hamarosan jelentkezhetnek majd a csapatok!
            </Typography>

            {currentSeason.startDate && (
              <Box sx={{ 
                p: { xs: 2, sm: 3 },
                backgroundColor: '#1e1e1e',
                borderRadius: '12px',
                border: '1px solid #404040',
                width: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <CalendarIcon sx={{ color: '#4285f4', fontSize: { xs: 20, sm: 24 } }} />
                  <Typography variant="h6" sx={{ 
                    color: '#e8eaed', 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Tervezett kezdés
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#4285f4',
                    fontWeight: 'bold',
                    mb: 1,
                    fontSize: { xs: '1.3rem', sm: '1.5rem' }
                  }}
                >
                  {formatDate(currentSeason.startDate)}
                </Typography>
                {daysUntilStart && daysUntilStart > 0 && (
                  <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                    {daysUntilStart} nap múlva
                  </Typography>
                )}
              </Box>
            )}

            {currentSeason.registrationOpen && (
              <Box sx={{ 
                p: { xs: 2, sm: 3 },
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                width: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <RegisterIcon sx={{ color: '#4caf50', fontSize: { xs: 20, sm: 24 } }} />
                  <Typography variant="h6" sx={{ 
                    color: '#e8eaed', 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Jelentkezés
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#9aa0a6', mb: 3 }}>
                  A csapatok már jelentkezhetnek az új szezonra!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<RegisterIcon />}
                  href={currentSeason.registrationLink}
                  sx={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontWeight: 'bold',
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: '8px',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    '&:hover': {
                      backgroundColor: '#388e3c',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Jelentkezés a ligába
                </Button>
              </Box>
            )}

            <Box sx={{ 
              p: { xs: 2, sm: 3 },
              backgroundColor: '#1e1e1e',
              borderRadius: '12px',
              border: '1px solid #404040',
              width: '100%'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#e8eaed', 
                fontWeight: 600, 
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                Mit várhatnak?
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: '#4285f4', fontSize: '1.2rem' }}>⚽</Box>
                  <Typography variant="body2" sx={{ color: '#9aa0a6', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                    Élő meccskövetés és eredmények
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: '#4285f4', fontSize: '1.2rem' }}>🏆</Box>
                  <Typography variant="body2" sx={{ color: '#9aa0a6', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                    Liga tabella és statisztikák
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: '#4285f4', fontSize: '1.2rem' }}>📱</Box>
                  <Typography variant="body2" sx={{ color: '#9aa0a6', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                    Modern, mobilbarát felület
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: '#4285f4', fontSize: '1.2rem' }}>👥</Box>
                  <Typography variant="body2" sx={{ color: '#9aa0a6', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                    Játékos és csapat statisztikák
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Additional Info */}
        <Box sx={{ textAlign: 'center', mt: { xs: 3, sm: 4 } }}>
          <Typography variant="body2" sx={{ 
            color: '#9aa0a6', 
            mb: 2,
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            px: { xs: 2, sm: 0 }
          }}>
            További információkért kövesse figyelemmel az oldalt vagy lépjen kapcsolatba a szervezőkkel.
          </Typography>
          <Typography variant="caption" sx={{ 
            color: '#666',
            fontSize: { xs: '0.7rem', sm: '0.75rem' }
          }}>
            &copy; 2025 - Szent László Gimnázium 
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default UpcomingSeason;

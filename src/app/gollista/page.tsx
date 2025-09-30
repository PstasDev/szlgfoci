'use client';

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import { Search as SearchIcon, EmojiEvents } from '@mui/icons-material';
import SimpleLayout from '@/components/SimpleLayout';
import ErrorDisplay from '@/components/ErrorDisplay';
import { getClassColor, hasTournamentStarted } from '@/utils/dataUtils';
import { useTournamentContext } from '@/hooks/useTournamentContext';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';
import { convertTopScorerToPlayer } from '@/utils/dataUtils';

export default function GoalListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { topScorers, tournament, loading, error, refetch } = useTournamentContext();
  const allScorers = topScorers.map(convertTopScorerToPlayer); // Convert to display format
  
  // Filter scorers based on search term
  const filteredScorers = allScorers.filter((scorer: import('@/types/api').Player) => 
    scorer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (scorer.teamName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <SimpleLayout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <Typography variant="h6" sx={{ color: '#e8eaed' }}>
            Betöltés...
          </Typography>
        </Box>
      </SimpleLayout>
    );
  }

  // Check if tournament has started
  if (tournament && !hasTournamentStarted(tournament)) {
    return (
      <SimpleLayout>
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
      </SimpleLayout>
    );
  }

  if (error || (isEmptyDataError(topScorers) && !loading)) {
    const errorInfo = getErrorInfo('goalscorers', error ? { message: error } : undefined);
    return (
      <SimpleLayout>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
          <ErrorDisplay 
            errorInfo={errorInfo}
            onRetry={refetch}
            fullPage
          />
        </Box>
      </SimpleLayout>
    );
  }

  const getRankDisplay = (position: number, prevPosition?: number) => {
    if (prevPosition && position === prevPosition) {
      return '';
    }
    return `${position}.`;
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return '#ffd700'; // Gold
    if (position === 2) return '#c0c0c0'; // Silver  
    if (position === 3) return '#cd7f32'; // Bronze
    return 'text.primary';
  };

  return (
    <SimpleLayout>
      <Stack spacing={4}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <EmojiEvents sx={{ fontSize: 48, color: '#ffd700' }} />
            SZLG LIGA 24/25 góllövőlistája
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              mb: 3
            }}
          >
            {allScorers.length} játékos szerepel a gólszerzők listáján
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Keresés játékos vagy csapat alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              width: { xs: '100%', sm: '400px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Top 3 Highlight Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
          {allScorers.slice(0, 3).map((scorer, index) => (
            <Card 
              key={scorer.id}
              sx={{ 
                backgroundColor: 'background.paper',
                border: `2px solid ${getPositionColor(scorer.position || 1)}`,
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: getPositionColor(scorer.position || 1),
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: '0 auto',
                    mb: 2
                  }}
                >
                  {scorer.position}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {scorer.name}
                </Typography>
                <Chip 
                  label={scorer.teamName || 'Unknown Team'}
                  size="small"
                  sx={{
                    backgroundColor: getClassColor(scorer.teamName || 'Unknown'),
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1
                  }}
                />
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: getPositionColor(scorer.position || 1),
                  mb: 0
                }}>
                  {scorer.goals || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  gól
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Full Table */}
        <Paper sx={{ backgroundColor: 'background.paper', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 800 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    backgroundColor: 'background.default',
                    fontWeight: 'bold',
                    width: '80px'
                  }}>
                    Helyezés
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: 'background.default',
                    fontWeight: 'bold' 
                  }}>
                    Játékos
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: 'background.default',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '120px'
                  }}>
                    Gólok száma
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: 'background.default',
                    fontWeight: 'bold',
                    width: '140px'
                  }}>
                    Játékos csapata
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredScorers.map((scorer, index) => {
                  const prevScorer = index > 0 ? filteredScorers[index - 1] : null;
                  const showRank = !prevScorer || scorer.position !== prevScorer.position;
                  
                  return (
                    <TableRow 
                      key={scorer.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        backgroundColor: (scorer.position || 1) <= 3 ? `${getPositionColor(scorer.position || 1)}15` : 'inherit'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {showRank && (
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: getPositionColor(scorer.position || 1),
                                minWidth: '40px'
                              }}
                            >
                              {(scorer.position || 1)}.
                            </Typography>
                          )}
                          {(scorer.position || 1) <= 3 && showRank && (
                            <EmojiEvents 
                              sx={{ 
                                ml: 1, 
                                color: getPositionColor(scorer.position || 1),
                                fontSize: 20 
                              }} 
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {scorer.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip 
                          label={scorer.goals}
                          color="primary"
                          sx={{ 
                            fontWeight: 'bold',
                            minWidth: '50px'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={scorer.teamName || 'Unknown Team'}
                          size="small"
                          sx={{
                            backgroundColor: getClassColor(scorer.teamName || 'Unknown'),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Statistics Summary */}
        <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Statisztikák
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, textAlign: 'center' }}>
            <Box>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {allScorers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gólszerző játékos
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {allScorers.reduce((sum, scorer) => sum + (scorer.goals || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Összes gól
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {allScorers[0]?.goals || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Legtöbb gól (egy játékos)
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {Math.round((allScorers.reduce((sum, scorer) => sum + (scorer.goals || 0), 0) / allScorers.length) * 10) / 10}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Átlagos gólszám
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </SimpleLayout>
  );
}

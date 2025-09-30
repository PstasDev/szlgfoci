'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { SportsSoccer as BallIcon } from '@mui/icons-material';
import { getClassColor, convertTopScorerToPlayer } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataScenario } from '@/utils/errorUtils';
import { useTournamentData } from '@/contexts/TournamentDataContext';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import EmptyDataDisplay from './EmptyDataDisplay';
import type { Player } from '@/types/api';

const GoalScorersList: React.FC = () => {
  const { topScorers, loading, error, refetch } = useTournamentData();

  const getPositionColor = (position: number) => {
    if (position === 1) return '#ffd700'; // Gold
    if (position === 2) return '#c0c0c0'; // Silver  
    if (position === 3) return '#cd7f32'; // Bronze
    return 'transparent';
  };

  const getPositionIcon = (position: number) => {
    if (position <= 3) {
      return (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: getPositionColor(position),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: position === 1 ? 'black' : 'white',
            fontWeight: 'bold',
            fontSize: '0.7rem'
          }}
        >
          {position}
        </Box>
      );
    }
    return (
      <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
        {position}.
      </Typography>
    );
  };

  if (loading) {
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <LoadingSkeleton variant="topscorers" count={5} />
        </CardContent>
      </Card>
    );
  }

  // Handle empty data scenario vs actual errors
  if (isEmptyDataScenario(error ? new Error(error) : null, topScorers) && !loading) {
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <EmptyDataDisplay 
            type="goalscorers"
            onRetry={refetch}
            variant="box"
          />
        </CardContent>
      </Card>
    );
  }

  // Handle actual errors
  if (error && !loading) {
    const errorInfo = getErrorInfo('goalscorers', new Error(error));
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <ErrorDisplay 
            errorInfo={errorInfo}
            onRetry={refetch}
            variant="box"
          />
        </CardContent>
      </Card>
    );
  }

  const topScorersData = topScorers.slice(0, 15).map(convertTopScorerToPlayer);

  return (
    <Card sx={{ backgroundColor: 'background.paper' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'text.primary',
              fontWeight: 600
            }}
          >
            <BallIcon color="primary" />
            Góllövőlista - SZLG Liga 24/25
          </Typography>
        </Box>

        <TableContainer sx={{ 
          backgroundColor: 'background.paper', 
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: { xs: 500, sm: 600 }
          }
        }}>
          <Table size="small" sx={{ 
            minWidth: { xs: 500, sm: 600 },
            '& .MuiTableCell-root': {
              px: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }
          }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 40, sm: 50 }, 
                  color: 'text.primary' 
                }}>
                  H
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary',
                  minWidth: { xs: 120, sm: 150 }
                }}>
                  JÁTÉKOS
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary',
                  minWidth: { xs: 100, sm: 120 },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  CSAPAT
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 60, sm: 80 }, 
                  color: 'text.primary' 
                }}>
                  GÓLOK
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topScorersData.map((player: Player, index: number) => (
                <TableRow
                  key={player.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    borderBottom: '1px solid',
                    borderBottomColor: 'divider',
                  }}
                >
                  <TableCell sx={{ color: 'text.primary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getPositionIcon(index + 1)}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={index < 3 ? 'bold' : 'normal'}
                        sx={{ 
                          color: 'text.primary',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        {player.name}
                      </Typography>
                      {/* Show team on mobile under player name */}
                      <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: getClassColor(player.teamName || ''),
                            fontSize: '0.5rem',
                            fontWeight: 'bold',
                            color: 'white'
                          }}
                        >
                          {(player.teamName || '').split(' ')[1] || (player.teamName || '').charAt((player.teamName || '').length - 1)}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                          {player.teamName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: getClassColor(player.teamName || ''),
                          fontSize: '0.6rem',
                          fontWeight: 'bold',
                          color: 'white'
                        }}
                      >
                        {(player.teamName || '').split(' ')[1] || (player.teamName || '').charAt((player.teamName || '').length - 1)}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {player.teamName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={player.goals}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: index === 0 ? 'warning.main' : 
                                       index < 3 ? 'success.main' : 
                                       index < 10 ? 'info.main' : 'default',
                        color: 'white',
                        minWidth: '35px'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap', 
          fontSize: '0.8rem',
          borderTop: '1px solid',
          borderTopColor: 'divider',
          backgroundColor: 'action.hover'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: 'warning.main', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Góllövőkirály (1.)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: 'success.main', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Top 3 (2-3.)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: 'info.main', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Top 10 (4-10.)</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoalScorersList;

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
  // Avatar replaced by TeamLogo for team badges
  // Avatar,
  Chip,
  ButtonBase,
} from '@mui/material';
import TeamLogo from './TeamLogo';
import { SportsSoccer as BallIcon } from '@mui/icons-material';
import { convertTopScorerToPlayer } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataScenario } from '@/utils/errorUtils';
import { useTournamentData } from '@/contexts/TournamentDataContext';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import EmptyDataDisplay from './EmptyDataDisplay';
import type { Player } from '@/types/api';

const GoalScorersList: React.FC = () => {
  const router = useRouter();
  const { topScorers, teams, loading, error, refetch } = useTournamentData();

  // Helper function to get team by name
  const getTeamByName = (teamName: string) => {
    return teams.find(team => 
      team.name === teamName || 
      `${team.start_year}${team.tagozat}` === teamName ||
      team.tagozat === teamName
    );
  };

  // Click handlers
  const handlePlayerClick = (_player: Player) => {
    // For now, just navigate to players page - could be enhanced to show player details
    router.push('/jatekosok');
  };

  const handleTeamClick = (teamName: string) => {
    const team = getTeamByName(teamName);
    if (team?.id) {
      router.push(`/csapatok/${team.id}`);
    }
  };

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
            width: { xs: 20, sm: 24 },
            height: { xs: 20, sm: 24 },
            borderRadius: '50%',
            backgroundColor: getPositionColor(position),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: position === 1 ? 'black' : 'white',
            fontWeight: 'bold',
            fontSize: { xs: '0.6rem', sm: '0.7rem' }
          }}
        >
          {position}
        </Box>
      );
    }
    return (
      <Typography variant="body2" fontWeight="bold" sx={{ 
        color: 'text.primary',
        fontSize: { xs: '0.75rem', sm: '0.875rem' }
      }}>
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
          overflowX: { xs: 'hidden', sm: 'auto' },
          '& .MuiTable-root': {
            minWidth: { xs: '100%', sm: 600 }
          }
        }}>
          <Table size="small" sx={{ 
            minWidth: { xs: '100%', sm: 600 },
            '& .MuiTableCell-root': {
              px: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }
          }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary' 
                }}>
                  H
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary',
                  minWidth: { xs: 'auto', sm: 150 }
                }}>
                  JÁTÉKOS
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary',
                  minWidth: { xs: 'auto', sm: 120 },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  CSAPAT
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 50, sm: 80 }, 
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
                      <ButtonBase
                        onClick={() => handlePlayerClick(player)}
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          textAlign: 'left',
                          borderRadius: 1,
                          p: 0.5,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          fontWeight={index < 3 ? 'bold' : 'normal'}
                          sx={{ 
                            color: 'text.primary',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {player.name}
                        </Typography>
                      </ButtonBase>
                      {/* Show team on mobile under player name */}
                      <ButtonBase
                        onClick={() => handleTeamClick(player.teamName || '')}
                        sx={{ 
                          display: { xs: 'flex', sm: 'none' }, 
                          alignItems: 'center', 
                          gap: 0.5,
                          justifyContent: 'flex-start',
                          borderRadius: 1,
                          p: 0.25,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <TeamLogo teamName={player.teamName || undefined} size={14} fontSize="0.45rem" />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary', 
                              fontSize: '0.65rem',
                              lineHeight: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '120px'
                            }}
                          >
                            {player.teamName}
                          </Typography>
                          {player.teamName && getTeamByName(player.teamName) && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary', 
                                fontSize: '0.6rem',
                                lineHeight: 1,
                                opacity: 0.8
                              }}
                            >
                              ({(() => {
                                const team = getTeamByName(player.teamName || '');
                                return team?.start_year && team?.tagozat 
                                  ? `${team.start_year.toString().slice(-2)}${team.tagozat.toUpperCase()}`
                                  : team?.tagozat?.toUpperCase() || '?';
                              })()})
                            </Typography>
                          )}
                        </Box>
                      </ButtonBase>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <ButtonBase
                      onClick={() => handleTeamClick(player.teamName || '')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        borderRadius: 1,
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TeamLogo teamName={player.teamName || undefined} size={20} fontSize="0.6rem" />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {player.teamName}
                        </Typography>
                        {player.teamName && getTeamByName(player.teamName) && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary', 
                              fontSize: '0.65rem',
                              lineHeight: 1,
                              opacity: 0.8
                            }}
                          >
                            ({(() => {
                              const team = getTeamByName(player.teamName || '');
                              return team?.start_year && team?.tagozat 
                                ? `${team.start_year.toString().slice(-2)}${team.tagozat.toUpperCase()}`
                                : team?.tagozat?.toUpperCase() || '?';
                            })()})
                          </Typography>
                        )}
                      </Box>
                    </ButtonBase>
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
                        minWidth: { xs: '28px', sm: '35px' },
                        height: { xs: '20px', sm: '24px' },
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          flexWrap: 'wrap', 
          fontSize: '0.8rem',
          borderTop: '1px solid',
          borderTopColor: 'divider',
          backgroundColor: 'action.hover',
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: { xs: 10, sm: 12 }, height: 3, bgcolor: 'warning.main', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}>
              Góllövőkirály (1.)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: { xs: 10, sm: 12 }, height: 3, bgcolor: 'success.main', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}>
              Top 3 (2-3.)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: { xs: 10, sm: 12 }, height: 3, bgcolor: 'info.main', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}>
              Top 10 (4-10.)
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoalScorersList;

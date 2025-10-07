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
  Chip,
  ButtonBase,
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTournamentData } from '@/contexts/TournamentDataContext';
import LoadingSkeleton from './LoadingSkeleton';
import TeamLogo from './TeamLogo';
import { getErrorInfo, isEmptyDataScenario } from '@/utils/errorUtils';
import ErrorDisplay from './ErrorDisplay';
import EmptyDataDisplay from './EmptyDataDisplay';
import { getTeamClassDisplayName } from '@/utils/dataUtils';

const LeagueTable: React.FC = () => {
  const { standings, teams, loading, error, refetch } = useTournamentData();
  const router = useRouter();



  const handleTeamClick = (teamId: number) => {
    // Navigate to the Csapatok page for the team
    router.push(`/csapatok/${teamId}`);
  };

  if (loading) {
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <LoadingSkeleton variant="standings" count={8} />
        </CardContent>
      </Card>
    );
  }

  // Handle empty data scenario vs actual errors
  if (isEmptyDataScenario(error ? new Error(error) : null, standings)) {
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <EmptyDataDisplay 
            type="standings"
            onRetry={refetch}
            variant="box"
          />
        </CardContent>
      </Card>
    );
  }

  // Handle actual errors
  if (error) {
    const errorInfo = getErrorInfo('standings', new Error(error));
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

  // The standings data already contains the needed information
  // Merge standings with teams data to get complete team information including tagozat
  const teamsWithStandings = standings.map(standing => {
    const teamData = teams.find(team => team.id === standing.team_id);
    return {
      ...standing,
      teamData: teamData || null
    };
  });

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
            <TrophyIcon color="primary" />
            SZLG Liga 24/25 - Bajnoki Tabella
          </Typography>
        </Box>
        
        <TableContainer sx={{ 
          backgroundColor: 'background.paper', 
          overflowX: { xs: 'hidden', sm: 'auto' },
          '& .MuiTable-root': {
            minWidth: { xs: '100%', sm: 700 }
          }
        }}>
          <Table size="small" sx={{ 
            minWidth: { xs: '100%', sm: 700 },
            '& .MuiTableCell-root': {
              px: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }
          }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary',
                  minWidth: { xs: 120, sm: 100 }
                }}>
                  OSZT
                </TableCell>
                {/* Hide M column on mobile */}
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  M
                </TableCell>
                {/* Show merged GY:D:V on mobile, separate on desktop */}
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 70, sm: 50 }, 
                  color: 'text.primary',
                  display: { xs: 'table-cell', sm: 'none' }
                }}>
                  GY:D:V
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  GY
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  D
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  V
                </TableCell>
                {/* Hide goal-related columns on mobile */}
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 45, sm: 60 }, 
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  LG
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 45, sm: 60 }, 
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  KG
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 45, sm: 60 }, 
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  GA
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 50, sm: 50 }, 
                  color: 'text.primary' 
                }}>
                  P
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamsWithStandings.map((teamStanding) => (
                <TableRow
                  key={teamStanding.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    borderBottom: '1px solid',
                    borderBottomColor: 'divider',
                  }}
                >
                  <TableCell>
                    <ButtonBase
                      onClick={() => handleTeamClick(teamStanding.team_id || 0)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.5, sm: 1.5 },
                        p: 0.5,
                        borderRadius: 1,
                        width: '100%',
                        justifyContent: 'flex-start',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <TeamLogo
                          team={teamStanding.teamData}
                          size={24}
                          fontSize="0.7rem"
                          showBorder={true}
                        />
                      </Box>
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <TeamLogo
                          team={teamStanding.teamData}
                          size={32}
                          fontSize="0.9rem"
                          showBorder={true}
                        />
                      </Box>
                      {/* Team name and tagozat */}
                      <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: 'text.primary',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          {teamStanding.teamData?.name || teamStanding.name || `${teamStanding.teamData?.tagozat || 'N/A'} osztály`}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: { xs: '0.65rem', sm: '0.75rem' }
                          }}
                        >
                          ({getTeamClassDisplayName(teamStanding.teamData || null)})
                        </Typography>
                      </Box>
                    </ButtonBase>
                  </TableCell>
                  {/* Hide M column on mobile */}
                  <TableCell align="center" sx={{ 
                    color: 'text.primary',
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {teamStanding.played || 0}
                  </TableCell>
                  {/* Show merged GY:D:V on mobile */}
                  <TableCell align="center" sx={{ 
                    display: { xs: 'table-cell', sm: 'none' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: 'success.main', 
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }}
                      >
                        {teamStanding.won || 0}
                      </Typography>
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.75rem'
                        }}
                      >
                        :
                      </Typography>
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: 'warning.main', 
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }}
                      >
                        {teamStanding.drawn || 0}
                      </Typography>
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.75rem'
                        }}
                      >
                        :
                      </Typography>
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: 'error.main', 
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }}
                      >
                        {teamStanding.lost || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  {/* Show separate GY:D:V on desktop */}
                  <TableCell align="center" sx={{ 
                    color: 'success.main', 
                    fontWeight: 'bold',
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {teamStanding.won || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    color: 'warning.main', 
                    fontWeight: 'bold',
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {teamStanding.drawn || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    color: 'error.main', 
                    fontWeight: 'bold',
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {teamStanding.lost || 0}
                  </TableCell>
                  {/* Hide goal-related columns on mobile */}
                  <TableCell align="center" sx={{ 
                    color: 'text.primary',
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {teamStanding.goalsFor || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    color: 'text.primary',
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {teamStanding.goalsAgainst || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    color: (teamStanding.goalDifference || 0) > 0 ? 'success.main' : (teamStanding.goalDifference || 0) < 0 ? 'error.main' : 'text.primary',
                    fontWeight: 'bold',
                    display: { xs: 'none', sm: 'table-cell' }
                  }}>
                    {(teamStanding.goalDifference || 0) > 0 ? '+' : ''}{teamStanding.goalDifference || 0}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={teamStanding.points || 0}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'primary.main',
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


      </CardContent>
    </Card>
  );
};

export default LeagueTable;

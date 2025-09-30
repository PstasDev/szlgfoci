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
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: { xs: 650, sm: 700 }
          }
        }}>
          <Table size="small" sx={{ 
            minWidth: { xs: 650, sm: 700 },
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
                  minWidth: { xs: 80, sm: 100 }
                }}>
                  OSZT
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary' 
                }}>
                  M
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary' 
                }}>
                  GY
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary' 
                }}>
                  D
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 35, sm: 50 }, 
                  color: 'text.primary' 
                }}>
                  V
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 45, sm: 60 }, 
                  color: 'text.primary' 
                }}>
                  LG
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 45, sm: 60 }, 
                  color: 'text.primary' 
                }}>
                  KG
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 45, sm: 60 }, 
                  color: 'text.primary' 
                }}>
                  GA
                </TableCell>
                <TableCell align="center" sx={{ 
                  fontWeight: 'bold', 
                  width: { xs: 40, sm: 50 }, 
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
                          {teamStanding.teamData?.tagozat || 'N/A'} tagozat
                        </Typography>
                      </Box>
                    </ButtonBase>
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>{teamStanding.played || 0}</TableCell>
                  <TableCell align="center" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {teamStanding.won || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                    {teamStanding.drawn || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {teamStanding.lost || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>{teamStanding.goalsFor || 0}</TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>{teamStanding.goalsAgainst || 0}</TableCell>
                  <TableCell align="center" sx={{ 
                    color: (teamStanding.goalDifference || 0) > 0 ? 'success.main' : (teamStanding.goalDifference || 0) < 0 ? 'error.main' : 'text.primary',
                    fontWeight: 'bold'
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

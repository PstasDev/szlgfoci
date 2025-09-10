'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
} from '@mui/material';
import { getClassColor } from '@/utils/dataUtils';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';
import { useTournamentData } from '@/hooks/useTournamentData';
import { convertStandingToTeam } from '@/utils/dataUtils';
import ErrorDisplay from './ErrorDisplay';

const GoogleSportsLeagueTable: React.FC = () => {
  const { standings, loading, error, refetch } = useTournamentData();
  const teams = standings.map((standing, index) => convertStandingToTeam(standing, index));

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <Typography sx={{ color: '#9aa0a6' }}>Betöltés...</Typography>
      </Box>
    );
  }

  if (error || (isEmptyDataError(standings) && !loading)) {
    const errorInfo = getErrorInfo('standings', error);
    return (
      <ErrorDisplay 
        errorInfo={errorInfo}
        onRetry={refetch}
        variant="box"
      />
    );
  }

  const getFormIndicator = (position: number) => {
    // Mock recent form - in real app this would come from data
    const forms = ['W', 'W', 'L', 'D', 'W']; // Win, Loss, Draw
    return forms.map((result, index) => (
      <Box
        key={index}
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 
            result === 'W' ? '#34a853' : // Green for win
            result === 'L' ? '#ea4335' : // Red for loss
            '#fbbc04', // Yellow for draw
          display: 'inline-block',
          mr: 0.5,
        }}
      />
    ));
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return '#fbbc04'; // Gold for champion
    if (position <= 3) return '#34a853'; // Green for top 3
    if (position >= 15) return '#ea4335'; // Red for relegation
    return 'transparent';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#2d2d2d',
        border: '1px solid #404040',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#1e1e1e',
        borderBottom: '1px solid #404040'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#e8eaed',
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          LIGA TABELLA
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#9aa0a6',
            textTransform: 'uppercase',
            fontSize: '0.7rem'
          }}
        >
          A CSOPORT
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1e1e1e' }}>
              <TableCell 
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 60
                }}
              >
                Klub
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 40
                }}
              >
                M
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 40
                }}
              >
                Gy
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 40
                }}
              >
                D
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 40
                }}
              >
                V
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 40
                }}
              >
                LG
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 40
                }}
              >
                KG
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 40
                }}
              >
                GK
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 40
                }}
              >
                P
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  color: '#9aa0a6', 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #404040',
                  width: 100
                }}
              >
                Utolsó öt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.slice(0, 4).map((team) => ( // Show only top 4 like in the screenshot
              <TableRow
                key={team.id}
                sx={{
                  backgroundColor: '#2d2d2d',
                  '&:hover': {
                    backgroundColor: '#363636',
                  },
                  borderBottom: '1px solid #404040'
                }}
              >
                {/* Position and Team */}
                <TableCell sx={{ borderBottom: '1px solid #404040' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 3,
                          height: 24,
                          backgroundColor: getPositionColor(team.position),
                          borderRadius: 1,
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#e8eaed', 
                          fontWeight: 600,
                          minWidth: 20
                        }}
                      >
                        {team.position}
                      </Typography>
                    </Box>
                    
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: getClassColor(team.className),
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        color: 'white'
                      }}
                    >
                      {team.className.split(' ')[1]}
                    </Avatar>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#e8eaed',
                        fontWeight: 500
                      }}
                    >
                      {team.className}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="center" sx={{ color: '#e8eaed', borderBottom: '1px solid #404040' }}>
                  {team.played}
                </TableCell>
                <TableCell align="center" sx={{ color: '#34a853', fontWeight: 'bold', borderBottom: '1px solid #404040' }}>
                  {team.won}
                </TableCell>
                <TableCell align="center" sx={{ color: '#fbbc04', fontWeight: 'bold', borderBottom: '1px solid #404040' }}>
                  {team.drawn}
                </TableCell>
                <TableCell align="center" sx={{ color: '#ea4335', fontWeight: 'bold', borderBottom: '1px solid #404040' }}>
                  {team.lost}
                </TableCell>
                <TableCell align="center" sx={{ color: '#e8eaed', borderBottom: '1px solid #404040' }}>
                  {team.goalsFor}
                </TableCell>
                <TableCell align="center" sx={{ color: '#e8eaed', borderBottom: '1px solid #404040' }}>
                  {team.goalsAgainst}
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    color: team.goalDifference > 0 ? '#34a853' : team.goalDifference < 0 ? '#ea4335' : '#e8eaed',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #404040'
                  }}
                >
                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: '1px solid #404040' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#e8eaed',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    {team.points}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: '1px solid #404040' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    {getFormIndicator(team.position)}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#1e1e1e',
        borderTop: '1px solid #404040',
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap'
      }}>
        <Typography variant="caption" sx={{ color: '#9aa0a6', fontWeight: 600 }}>
          Legutöbbi öt mérkőzés:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34a853' }} />
          <Typography variant="caption" sx={{ color: '#9aa0a6' }}>Győzelem</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ea4335' }} />
          <Typography variant="caption" sx={{ color: '#9aa0a6' }}>Vereség</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fbbc04' }} />
          <Typography variant="caption" sx={{ color: '#9aa0a6' }}>Nem játszott</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GoogleSportsLeagueTable;

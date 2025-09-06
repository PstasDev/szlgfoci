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
  Paper,
  Box,
  Chip,
  Avatar,
  ButtonBase,
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { getLeagueTable, getClassColor, getAllTeamRosters } from '@/data/mockData';

const LeagueTable: React.FC = () => {
  const teams = getLeagueTable();
  const router = useRouter();

  const getPositionColor = (position: number) => {
    if (position === 1) return 'warning.main'; // Gold for champion
    if (position <= 3) return 'success.main'; // Green for top 3
    if (position >= 15) return 'error.main'; // Red for relegation
    return 'transparent';
  };

  const handleTeamClick = (teamName: string) => {
    // Navigate to the Csapatok page with team selection
    // We'll create a URL parameter to auto-select the team
    router.push(`/csapatok?team=${encodeURIComponent(teamName)}`);
  };

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
        
        <TableContainer sx={{ backgroundColor: 'background.paper' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 'bold', width: 50, color: 'text.primary' }}>H</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>OSZT</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50, color: 'text.primary' }}>M</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50, color: 'text.primary' }}>GY</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50, color: 'text.primary' }}>D</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50, color: 'text.primary' }}>V</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 60, color: 'text.primary' }}>LG</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 60, color: 'text.primary' }}>KG</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 60, color: 'text.primary' }}>GA</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50, color: 'text.primary' }}>P</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => (
                <TableRow
                  key={team.id}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 20,
                          backgroundColor: getPositionColor(team.position),
                          borderRadius: 1,
                        }}
                      />
                      <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                        {team.position}.
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <ButtonBase
                      onClick={() => handleTeamClick(team.className)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 0.5,
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
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
                        {team.className.split(' ')[1]} {/* Shows just the letter (A, B, C, etc.) */}
                      </Avatar>
                      <Typography 
                        variant="body2" 
                        fontWeight={team.position <= 3 ? 'bold' : 'normal'}
                        sx={{ 
                          color: 'text.primary',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        {team.className}
                      </Typography>
                    </ButtonBase>
                  </TableCell>
                  
                  <TableCell align="center" sx={{ color: 'text.primary' }}>{team.played}</TableCell>
                  <TableCell align="center" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {team.won}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                    {team.drawn}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {team.lost}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>{team.goalsFor}</TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>{team.goalsAgainst}</TableCell>
                  <TableCell align="center" sx={{ 
                    color: team.goalDifference > 0 ? 'success.main' : team.goalDifference < 0 ? 'error.main' : 'text.primary',
                    fontWeight: 'bold'
                  }}>
                    {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={team.points}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: team.position === 1 ? 'warning.main' : 
                                       team.position <= 3 ? 'success.main' : 
                                       team.position >= 15 ? 'error.main' : 'primary.main',
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
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Bajnok (1.)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: 'success.main', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Döntő (2-3.)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: 'error.main', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Kiesés (15-17.)</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeagueTable;

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
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { getLeagueTable, getClassColor } from '@/data/mockData';

const LeagueTable: React.FC = () => {
  const teams = getLeagueTable();

  const getPositionColor = (position: number) => {
    if (position === 1) return 'warning.main'; // Gold for champion
    if (position <= 3) return 'success.main'; // Green for top 3
    if (position >= 15) return 'error.main'; // Red for relegation
    return 'transparent';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrophyIcon color="primary" />
          SZLG Liga 24/25 - Bajnoki Tabella
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.50' }}>
                <TableCell sx={{ fontWeight: 'bold', width: 50 }}>H</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>OSZT</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>M</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>GY</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>D</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>V</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 60 }}>LG</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 60 }}>KG</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 60 }}>GA</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>P</TableCell>
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
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 20,
                          backgroundColor: getPositionColor(team.position),
                          borderRadius: 1,
                        }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {team.position}.
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      <Typography variant="body2" fontWeight={team.position <= 3 ? 'bold' : 'normal'}>
                        {team.className}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">{team.played}</TableCell>
                  <TableCell align="center" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {team.won}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                    {team.drawn}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {team.lost}
                  </TableCell>
                  <TableCell align="center">{team.goalsFor}</TableCell>
                  <TableCell align="center">{team.goalsAgainst}</TableCell>
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
                        color: team.position === 1 ? 'warning.contrastText' : 'white',
                        minWidth: '35px'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', fontSize: '0.8rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: 'warning.main', borderRadius: 1 }} />
            <Typography variant="caption">Bajnok (1.)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: 'success.main', borderRadius: 1 }} />
            <Typography variant="caption">Döntő (2-3.)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: 'error.main', borderRadius: 1 }} />
            <Typography variant="caption">Kiesés (15-17.)</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeagueTable;

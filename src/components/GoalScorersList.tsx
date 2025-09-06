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
  Avatar,
  Chip,
} from '@mui/material';
import { SportsSoccer as BallIcon } from '@mui/icons-material';
import { getTopScorers, getClassColor } from '@/data/mockData';

const GoalScorersList: React.FC = () => {
  const topScorers = getTopScorers(15);

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
            fontSize: '0.8rem',
            mr: 1,
          }}
        >
          {position}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BallIcon color="primary" />
          Góllövőlista - SZLG Liga 24/25
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.50' }}>
                <TableCell sx={{ fontWeight: 'bold', width: 60 }}>Hely</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Játékos</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Csapat</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 80 }}>Gólok</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topScorers.map((player) => (
                <TableRow
                  key={player.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    backgroundColor: player.position <= 3 ? 'rgba(76, 175, 80, 0.05)' : 'inherit',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getPositionIcon(player.position)}
                      <Typography variant="body2" fontWeight="bold">
                        {player.position}.
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: getClassColor(player.teamName),
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          color: 'white'
                        }}
                      >
                        {player.teamName.split(' ')[1]} {/* Shows just the class letter */}
                      </Avatar>
                      <Typography 
                        variant="body2" 
                        fontWeight={player.position <= 3 ? 'bold' : 'normal'}
                        sx={{
                          color: player.position <= 3 ? 'primary.main' : 'inherit',
                        }}
                      >
                        {player.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {player.teamName}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={player.goals}
                      size="small"
                      icon={<BallIcon sx={{ fontSize: '0.8rem !important' }} />}
                      sx={{
                        backgroundColor: player.position <= 3 ? 'success.main' : 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: '50px',
                        '& .MuiChip-icon': { color: 'white' },
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
            <Box sx={{ width: 12, height: 12, bgcolor: 'warning.main', borderRadius: '50%' }} />
            <Typography variant="caption">1. hely - Aranylábú</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: 'grey.400', borderRadius: '50%' }} />
            <Typography variant="caption">2. hely - Ezüstlábú</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: 'warning.dark', borderRadius: '50%' }} />
            <Typography variant="caption">3. hely - Bronzlábú</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoalScorersList;

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
  CircularProgress,
  Alert,
} from '@mui/material';
import { SportsSoccer as BallIcon } from '@mui/icons-material';
import { getClassColor, convertTopScorerToPlayer } from '@/utils/dataUtils';
import { useTournamentData } from '@/hooks/useTournamentData';
import type { Player } from '@/types/api';

const GoalScorersList: React.FC = () => {
  const { topScorers, loading, error } = useTournamentData();

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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#42a5f5' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent>
          <Alert severity="error" sx={{ backgroundColor: '#d32f2f', color: '#fff' }}>
            Hiba a góllövők betöltésekor: {error}
          </Alert>
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

        <TableContainer sx={{ backgroundColor: 'background.paper' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 'bold', width: 50, color: 'text.primary' }}>H</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>JÁTÉKOS</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>CSAPAT</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: 80, color: 'text.primary' }}>GÓLOK</TableCell>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={index < 3 ? 'bold' : 'normal'}
                        sx={{ 
                          color: 'text.primary',
                        }}
                      >
                        {player.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
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

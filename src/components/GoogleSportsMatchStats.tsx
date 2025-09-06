'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { Match, getClassColor } from '@/data/mockData';

interface GoogleSportsMatchStatsProps {
  match: Match;
}

interface StatItem {
  label: string;
  homeValue: number;
  awayValue: number;
  homeDisplay?: string;
  awayDisplay?: string;
}

const GoogleSportsMatchStats: React.FC<GoogleSportsMatchStatsProps> = ({ match }) => {
  // Mock statistics - in real app this would come from match data
  const stats: StatItem[] = [
    {
      label: 'Lövések',
      homeValue: 8,
      awayValue: 14,
    },
    {
      label: 'Kapura tartó lövések',
      homeValue: 5,
      awayValue: 4,
    },
    {
      label: 'Labdabirtoklás',
      homeValue: 30,
      awayValue: 70,
      homeDisplay: '30%',
      awayDisplay: '70%',
    },
    {
      label: 'Passzok',
      homeValue: 263,
      awayValue: 616,
    },
    {
      label: 'Passz pontosság',
      homeValue: 80,
      awayValue: 88,
      homeDisplay: '80%',
      awayDisplay: '88%',
    },
    {
      label: 'Szabálytalanságok',
      homeValue: 12,
      awayValue: 18,
    },
    {
      label: 'Sárga lap',
      homeValue: 1,
      awayValue: 2,
    },
    {
      label: 'Piros lap',
      homeValue: 0,
      awayValue: 0,
    },
    {
      label: 'Les',
      homeValue: 1,
      awayValue: 0,
    },
    {
      label: 'Szögletek',
      homeValue: 5,
      awayValue: 8,
    },
  ];

  const StatRow = ({ stat }: { stat: StatItem }) => {
    const total = stat.homeValue + stat.awayValue;
    const homePercentage = total > 0 ? (stat.homeValue / total) * 100 : 50;
    const awayPercentage = total > 0 ? (stat.awayValue / total) * 100 : 50;

    return (
      <Box sx={{ mb: 3 }}>
        {/* Stat values and label */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto 1fr', 
          gap: 2, 
          alignItems: 'center',
          mb: 1
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              color: '#e8eaed',
              fontWeight: 'bold'
            }}
          >
            {stat.homeDisplay || stat.homeValue}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9aa0a6',
              textAlign: 'center',
              minWidth: 120,
              fontSize: '0.85rem'
            }}
          >
            {stat.label}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              color: '#e8eaed',
              fontWeight: 'bold'
            }}
          >
            {stat.awayDisplay || stat.awayValue}
          </Typography>
        </Box>

        {/* Progress bar */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: '#404040',
          borderRadius: '4px',
          overflow: 'hidden',
          height: 6
        }}>
          <Box
            sx={{
              width: `${homePercentage}%`,
              height: '100%',
              backgroundColor: '#4285f4',
              transition: 'width 0.3s ease',
            }}
          />
          <Box
            sx={{
              width: `${awayPercentage}%`,
              height: '100%',
              backgroundColor: '#ea4335',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>
    );
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
            fontSize: '1.1rem',
            textAlign: 'center'
          }}
        >
          CSAPAT STATISZTIKÁI
        </Typography>
      </Box>

      {/* Team Headers */}
      <Box sx={{ 
        p: 2, 
        display: 'grid', 
        gridTemplateColumns: '1fr auto 1fr', 
        gap: 2, 
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderBottom: '1px solid #404040'
      }}>
        {/* Home Team */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: getClassColor(match.homeTeam),
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {match.homeTeam.split(' ')[1]}
          </Avatar>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#e8eaed', 
              fontWeight: 600
            }}
          >
            {match.homeTeam.split(' ')[1]} osztály
          </Typography>
        </Box>

        {/* VS */}
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#e8eaed',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {match.homeScore} - {match.awayScore}
        </Typography>

        {/* Away Team */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          justifyContent: 'flex-end' 
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#e8eaed', 
              fontWeight: 600,
              textAlign: 'right'
            }}
          >
            {match.awayTeam.split(' ')[1]} osztály
          </Typography>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: getClassColor(match.awayTeam),
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {match.awayTeam.split(' ')[1]}
          </Avatar>
        </Box>
      </Box>

      {/* Statistics */}
      <Box sx={{ p: 3 }}>
        {stats.map((stat, index) => (
          <StatRow key={index} stat={stat} />
        ))}
      </Box>

      {/* Group Position */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#1e1e1e',
        borderTop: '1px solid #404040',
        textAlign: 'center'
      }}>
        <Typography variant="caption" sx={{ color: '#9aa0a6', textTransform: 'uppercase' }}>
          HELYEZÉS
        </Typography>
        <Typography variant="h6" sx={{ color: '#e8eaed', fontWeight: 'bold' }}>
          A CSOPORT
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 2, 
          mt: 2 
        }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#e8eaed', fontWeight: 'bold' }}>
              1
            </Typography>
            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
              Meccsek: 1, Győzelem: 1, Döntetlen: 0, Vereség: 0, Lőtt gól: 3, Kapott gól: 1, Gólkülönbség: 2, Pont: 3
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h4" sx={{ color: '#e8eaed', fontWeight: 'bold' }}>
              2
            </Typography>
            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
              Meccsek: 1, Győzelem: 1, Döntetlen: 0, Vereség: 0, Lőtt gól: 2, Kapott gól: 0, Gólkülönbség: 2, Pont: 3
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default GoogleSportsMatchStats;

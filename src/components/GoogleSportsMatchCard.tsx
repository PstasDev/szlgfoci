'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Sports as SportsIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Match, getClassColor } from '@/data/mockData';

interface GoogleSportsMatchCardProps {
  match: Match;
  variant?: 'detailed' | 'compact';
}

const GoogleSportsMatchCard: React.FC<GoogleSportsMatchCardProps> = ({ 
  match, 
  variant = 'detailed' 
}) => {
  const router = useRouter();

  const handleMatchClick = () => {
    router.push(`/merkozesek/${match.id}`);
  };

  if (variant === 'detailed') {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#2d2d2d',
          border: '1px solid #404040',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#363636',
            border: '1px solid #4285f4',
          },
        }}
        onClick={handleMatchClick}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid #404040'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#9aa0a6', textTransform: 'uppercase' }}>
              {match.round}
            </Typography>
            {match.status === 'live' && (
              <Chip 
                label="ÉLŐ" 
                size="small" 
                sx={{ 
                  backgroundColor: '#ea4335', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem'
                }} 
              />
            )}
            {match.status === 'finished' && (
              <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                VÉGE
              </Typography>
            )}
            {match.status === 'upcoming' && (
              <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                {match.date} • {match.time}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Main Match Info */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr auto 1fr', 
            gap: 2, 
            alignItems: 'center',
            mb: 2
          }}>
            {/* Home Team */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: getClassColor(match.homeTeam),
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                {match.homeTeam.split(' ')[1]}
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#e8eaed', 
                  fontWeight: 500,
                  fontSize: '1.1rem'
                }}
              >
                {match.homeTeam}
              </Typography>
            </Box>

            {/* Score */}
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              {match.status !== 'upcoming' ? (
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#e8eaed',
                    lineHeight: 1
                  }}
                >
                  {match.homeScore}
                </Typography>
              ) : (
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#9aa0a6',
                    fontWeight: 500
                  }}
                >
                  VS
                </Typography>
              )}
            </Box>

            {/* Away Team */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              justifyContent: 'flex-end' 
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#e8eaed', 
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  textAlign: 'right'
                }}
              >
                {match.awayTeam}
              </Typography>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: getClassColor(match.awayTeam),
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                {match.awayTeam.split(' ')[1]}
              </Avatar>
            </Box>
          </Box>

          {/* Score continuation for larger display */}
          {match.status !== 'upcoming' && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#e8eaed',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {match.homeScore} - {match.awayScore}
              </Typography>
            </Box>
          )}

          {/* Venue */}
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center',
              color: '#9aa0a6',
              fontSize: '0.85rem'
            }}
          >
            📍 {match.venue}
          </Typography>

          {/* Action Buttons */}
          {match.status === 'finished' && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                startIcon={<PlayIcon />}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#4285f4',
                  color: '#4285f4',
                  '&:hover': {
                    backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    borderColor: '#4285f4',
                  },
                }}
              >
                Összefogoló megtekintése • 2:00
              </Button>
            </Box>
          )}
        </Box>

        {/* Match Events for Live Games */}
        {match.status === 'live' && match.events.length > 0 && (
          <Box sx={{ 
            px: 3, 
            pb: 3, 
            pt: 0,
            borderTop: '1px solid #404040'
          }}>
            <Typography variant="body2" sx={{ color: '#9aa0a6', mb: 1 }}>
              Legutóbbi események:
            </Typography>
            {match.events.slice(-2).map((event) => (
              <Box key={event.id} sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#e8eaed' }}>
                  {event.minute}' {event.type === 'goal' ? '⚽' : event.type === 'yellow_card' ? '🟨' : '🟥'} {event.player}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    );
  }

  // Compact variant for lists
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#2d2d2d',
        border: '1px solid #404040',
        borderRadius: '6px',
        p: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#363636',
        },
      }}
      onClick={handleMatchClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Teams */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: getClassColor(match.homeTeam),
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              {match.homeTeam.split(' ')[1]}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#e8eaed' }}>
              {match.homeTeam}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: getClassColor(match.awayTeam),
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              {match.awayTeam.split(' ')[1]}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#e8eaed' }}>
              {match.awayTeam}
            </Typography>
          </Box>
        </Box>

        {/* Score/Status */}
        <Box sx={{ textAlign: 'center', minWidth: 60 }}>
          {match.status === 'finished' ? (
            <Box>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#e8eaed' }}>
                {match.homeScore}
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#e8eaed' }}>
                {match.awayScore}
              </Typography>
            </Box>
          ) : match.status === 'live' ? (
            <Box>
              <Typography variant="body1" fontWeight="bold" color="success.main">
                {match.homeScore}
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="success.main">
                {match.awayScore}
              </Typography>
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
              {match.time}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default GoogleSportsMatchCard;

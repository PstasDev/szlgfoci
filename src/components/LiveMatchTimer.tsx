'use client';

import React from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';

interface LiveMatchTimerProps {
  startTime: string; // ISO string
  isHalfTime?: boolean;
  isPaused?: boolean;
}

const LiveMatchTimer: React.FC<LiveMatchTimerProps> = ({ 
  startTime, 
  isHalfTime = false, 
  isPaused = false 
}) => {
  const [elapsedMinutes, setElapsedMinutes] = React.useState(0);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);

  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      const diff = now.getTime() - start.getTime();
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      setElapsedMinutes(minutes);
      setElapsedSeconds(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused]);

  const getDisplayTime = () => {
    if (isHalfTime) {
      return 'HT';
    }
    
    // Calculate half-time display
    if (elapsedMinutes <= 45) {
      return `${elapsedMinutes}'`;
    } else if (elapsedMinutes <= 60) {
      return 'HT';
    } else {
      const secondHalfMinutes = elapsedMinutes - 60;
      if (secondHalfMinutes <= 45) {
        return `${45 + secondHalfMinutes}'`;
      } else {
        const extraTime = secondHalfMinutes - 45;
        return `90+${extraTime}'`;
      }
    }
  };

  const getTimerColor = () => {
    if (isHalfTime) return 'warning';
    if (elapsedMinutes >= 90) return 'error';
    if (elapsedMinutes >= 45) return 'info';
    return 'success';
  };

  const getStatus = () => {
    if (isHalfTime) return 'Félidő';
    if (isPaused) return 'Szünet';
    if (elapsedMinutes >= 90) return 'Hosszabbítás';
    if (elapsedMinutes >= 45 && elapsedMinutes < 60) return 'Félidő';
    return 'Élő';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        icon={isPaused ? <PauseIcon /> : <PlayIcon />}
        label={getDisplayTime()}
        color={getTimerColor()}
        variant="filled"
        size="small"
        sx={{
          fontWeight: 'bold',
          fontSize: '0.8rem',
          animation: !isPaused && !isHalfTime ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.7 },
            '100%': { opacity: 1 },
          },
        }}
      />
      
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary',
          fontWeight: 500,
          display: { xs: 'none', sm: 'block' }
        }}
      >
        {getStatus()}
      </Typography>
    </Box>
  );
};

export default LiveMatchTimer;

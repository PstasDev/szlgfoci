'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper
} from '@mui/material';
import {
  EventAvailable as EventIcon,
  SportsScore as ScoreIcon,
  Groups as TeamsIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface EmptyDataDisplayProps {
  type: 'matches' | 'teams' | 'players' | 'goalscorers' | 'standings' | 'tournaments';
  onRetry?: () => void;
  variant?: 'paper' | 'box';
}

const EmptyDataDisplay: React.FC<EmptyDataDisplayProps> = ({ 
  type, 
  onRetry,
  variant = 'paper'
}) => {
  const getEmptyDataInfo = (dataType: string) => {
    switch (dataType) {
      case 'matches':
        return {
          icon: <EventIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.7 }} />,
          title: 'Még nincsenek meccsek',
          message: 'A mérkőzések hamarosan meghirdetésre kerülnek. Látogass vissza később a friss információkért!',
          encouragement: '⚽ Izgalmas meccsek várnak rád!'
        };
      case 'teams':
        return {
          icon: <TeamsIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.7 }} />,
          title: 'Csapatok még nem kerültek véglegesítésre',
          message: 'A nevezések feldolgozása folyamatban van. Hamarosan publikáljuk a résztvevő csapatokat!',
          encouragement: '🏆 Sok csapat készül a versenyre!'
        };
      case 'players':
        return {
          icon: <TeamsIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.7 }} />,
          title: 'Játékoslisták még nem elérhetők',
          message: 'A csapatok még összeállítják a kereteiket. Hamarosan láthatod a játékosokat!',
          encouragement: '⭐ Tehetséges játékosok várnak!'
        };
      case 'goalscorers':
        return {
          icon: <ScoreIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.7 }} />,
          title: 'Góllövőlista még üres',
          message: 'Az első mérkőzések után elkezdődik a gólvadászat! Látogass vissza az első gólok után.',
        };
      case 'standings':
        return {
          icon: <TrophyIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.7 }} />,
          title: 'Tabella még nem alakult ki',
          message: 'Az első mérkőzések lejátszása után formálódik a tabella. Kövess nyomon minden meccset!',
          encouragement: '📊 Izgalmas küzdelem vár!'
        };
      case 'tournaments':
        return {
          icon: <TrophyIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.7 }} />,
          title: 'Jelenleg nincs aktív bajnokság',
          message: 'A következő szezon hamarosan elindul. Kövesd az oldalt a legfrissebb hírekért!',
          encouragement: '🎯 Izgalmas szezon közeleg!'
        };
      default:
        return {
          icon: <TimeIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.7 }} />,
          title: 'Adatok még nem elérhetők',
          message: 'A tartalom hamarosan elérhető lesz. Látogass vissza később!',
          encouragement: '🚀 Izgalmas dolgok közelednek!'
        };
    }
  };

  const info = getEmptyDataInfo(type);

  const content = (
    <Stack spacing={3} alignItems="center" textAlign="center">
      {info.icon}
      <Stack spacing={1}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ color: 'text.primary', fontWeight: 600 }}
        >
          {info.title}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 500,
            lineHeight: 1.6,
            mb: 1
          }}
        >
          {info.message}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}
        >
          {info.encouragement}
        </Typography>
      </Stack>
      
      {onRetry && (
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'rgba(66, 165, 245, 0.1)'
            }
          }}
        >
          Frissítés
        </Button>
      )}
    </Stack>
  );

  if (variant === 'box') {
    return (
      <Box sx={{ py: { xs: 4, sm: 6 }, px: 2 }}>
        {content}
      </Box>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 3, sm: 4 },
        backgroundColor: 'background.paper',
        borderRadius: 2,
        maxWidth: 600,
        mx: 'auto',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {content}
    </Paper>
  );
};

export default EmptyDataDisplay;
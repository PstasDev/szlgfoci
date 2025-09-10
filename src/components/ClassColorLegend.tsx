'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import { getClassColor } from '@/utils/dataUtils';

const ClassColorLegend: React.FC = () => {
  const classes = [
    { letter: 'A', name: 'A osztályok', color: 'Zöld' },
    { letter: 'B', name: 'B osztályok', color: 'Sárga' },
    { letter: 'C', name: 'C osztályok', color: 'Lila' },
    { letter: 'D', name: 'D osztályok', color: 'Piros' },
    { letter: 'E', name: 'E osztályok', color: 'Szürke' },
    { letter: 'F', name: 'F osztályok', color: 'Sötétkék' },
  ];

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          color: 'text.primary',
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        Osztály Színkódok
      </Typography>
      
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 2
        }}
      >
        {classes.map((classItem) => (
          <Box 
            key={classItem.letter}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: 1,
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: getClassColor(`20 ${classItem.letter}`), // Use dummy class name
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {classItem.letter}
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                {classItem.letter} osztály
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                {classItem.color}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ClassColorLegend;

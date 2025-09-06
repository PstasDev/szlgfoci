'use client';

import React from 'react';
import {
  Typography,
  Box,
  Stack,
} from '@mui/material';
import SimpleLayout from '@/components/SimpleLayout';

export default function GoalListPage() {
  return (
    <SimpleLayout>
      <Stack spacing={4}>
        {/* Page Title */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#e8eaed',
              mb: 1
            }}
          >
            Góllista
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#9aa0a6',
              mb: 2 
            }}
          >
            SZLG Liga 24/25 - Gólszerzők ranglista
          </Typography>
        </Box>

        {/* Content Coming Soon */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: '#2d2d2d',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#e8eaed',
              fontWeight: 600,
              mb: 2
            }}
          >
            Hamarosan elérhető! ⚽
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#9aa0a6'
            }}
          >
            A gólszerzők ranglista fejlesztés alatt áll.
          </Typography>
        </Box>
      </Stack>
    </SimpleLayout>
  );
}

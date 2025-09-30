'use client';

import React from 'react';
import { Box, Typography, Link, Container, Divider, Stack, useTheme } from '@mui/material';
import { Info as InfoIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  // Determine admin URL based on environment
  const getAdminUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000/admin';
      }
    }
    return 'https://fociapi.szlg.info/admin';
  };

  return (
    <Box 
      component="footer"
      sx={{ 
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.grey[300],
        py: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        flexShrink: 0, // Prevent footer from shrinking
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'flex-start' }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Szlgfoci - Iskolai Foci Kupa
            </Typography>
          </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3}
            alignItems="center"
            sx={{ textAlign: { xs: 'center', sm: 'right' } }}
          >
            <Link
              href="/focikuparol"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: theme.palette.primary.light,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: theme.palette.primary.main,
                },
              }}
            >
              <InfoIcon fontSize="small" />
              <Typography variant="body2">
                A Focikupáról
              </Typography>
            </Link>

            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                borderColor: theme.palette.grey[700] 
              }} 
            />

            <Link
              href={getAdminUrl()}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: theme.palette.secondary.light,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: theme.palette.secondary.main,
                },
              }}
            >
              <AdminIcon fontSize="small" />
              <Typography variant="body2">
                Bíró vagyok
              </Typography>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
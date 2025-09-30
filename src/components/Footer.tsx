'use client';

import React from 'react';
import { Box, Typography, Link, Container, Divider, Stack, useTheme } from '@mui/material';
import { 
  Info as InfoIcon, 
  AdminPanelSettings as AdminIcon,
  GitHub as GitHubIcon,
  School as SchoolIcon,
  SportsSoccer as SoccerIcon
} from '@mui/icons-material';

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
        py: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                <SoccerIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  Focikupa
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Kőbányai Szent László Gimnázium Futballtornája
              </Typography>
            </Box>

            <Divider sx={{ borderColor: theme.palette.grey[700] }} />

            {/* Links Section */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Link
                href="/focikuparol"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.grey[400],
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}10`,
                    boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <InfoIcon fontSize="small" />
                <Typography variant="body2" fontWeight="500">
                  A Focikupáról
                </Typography>
              </Link>

              <Link
                href={getAdminUrl()}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.grey[400],
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    backgroundColor: `${theme.palette.secondary.main}10`,
                    boxShadow: `0 0 20px ${theme.palette.secondary.main}40`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <AdminIcon fontSize="small" />
                <Typography variant="body2" fontWeight="500">
                  Bíró vagyok
                </Typography>
              </Link>

              <Link
                href="https://szlgbp.hu"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.grey[400],
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.info.main,
                    backgroundColor: `${theme.palette.info.main}10`,
                    boxShadow: `0 0 20px ${theme.palette.info.main}40`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <SchoolIcon fontSize="small" />
                <Typography variant="body2" fontWeight="500">
                  SZLGBP
                </Typography>
              </Link>

              <Link
                href="https://github.com/PstasDev/szlgfoci"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.grey[400],
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.grey[200],
                    backgroundColor: `${theme.palette.grey[200]}10`,
                    boxShadow: `0 0 20px ${theme.palette.grey[200]}40`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <GitHubIcon fontSize="small" />
                <Typography variant="body2" fontWeight="500">
                  GitHub
                </Typography>
              </Link>
            </Stack>

            <Divider sx={{ borderColor: theme.palette.grey[700] }} />

            {/* Copyright Section */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                © {new Date().getFullYear()} SZLG Diákönkormányzata
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6, mt: 0.5, display: 'block' }}>
                Diákoktól diákoknak
              </Typography>
            </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
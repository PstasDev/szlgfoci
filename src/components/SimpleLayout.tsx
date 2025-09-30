'use client';

import React from 'react';
import { Box, GlobalStyles } from '@mui/material';
import Header from './Header';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

// Legacy context for backward compatibility
export const TournamentContext = React.createContext<{
  currentTournament: any | null;
  loading: boolean;
  error: string | null;
}>({
  currentTournament: null,
  loading: true,
  error: null
});

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header />
        <Box sx={{ 
          pt: 8, 
          px: { xs: 2, sm: 3 }, 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ color: '#e8eaed', textAlign: 'center', py: 4 }}>
            Betöltés...
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <GlobalStyles
        styles={{
          '@keyframes glow': {
            '0%': {
              boxShadow: '0 0 5px rgba(66, 165, 245, 0.3)',
            },
            '50%': {
              boxShadow: '0 0 20px rgba(66, 165, 245, 0.6), 0 0 30px rgba(66, 165, 245, 0.4)',
            },
            '100%': {
              boxShadow: '0 0 5px rgba(66, 165, 245, 0.3)',
            },
          },
          '@keyframes float': {
            '0%': {
              transform: 'translateY(0px)',
            },
            '50%': {
              transform: 'translateY(-10px)',
            },
            '100%': {
              transform: 'translateY(0px)',
            },
          },
          '.glow-effect': {
            animation: 'glow 3s ease-in-out infinite alternate',
          },
          '.float-effect': {
            animation: 'float 6s ease-in-out infinite',
          },
        }}
      />
      
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        <Header />
        
        <Box sx={{ 
          pt: { xs: 7, sm: 8 },
          px: { xs: 0, sm: 0 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default SimpleLayout;

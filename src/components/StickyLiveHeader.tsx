'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SportsSoccer as SoccerIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useLiveMatchPolling from '@/hooks/useLiveMatchPolling';
import TeamLogo from './TeamLogo';
import type { LiveMatch, Match } from '@/types/api';

interface StickyLiveHeaderProps {
  className?: string;
}

const StickyLiveHeader: React.FC<StickyLiveHeaderProps> = ({ className }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(false);

  const { liveMatches, isPolling } = useLiveMatchPolling({
    pollingInterval: 5000,
    enablePolling: true,
    autoStart: true
  });

  // Don't render if no live matches
  if (!liveMatches || liveMatches.length === 0) {
    return null;
  }

  const handleMatchClick = (matchId: number) => {
    router.push(`/merkozesek/${matchId}`);
  };

  const MatchItem = ({ match }: { match: LiveMatch }) => {
    // Convert to Match type for compatibility
    const matchData = { ...match, status: 'live' as const } as Match;
    
    return (
      <Box
        onClick={() => handleMatchClick(match.id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 1 : 2,
          py: 1,
          px: 2,
          borderRadius: 2,
          cursor: 'pointer',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
          minWidth: isMobile ? 'auto' : 280,
        }}
      >
        {/* Home Team */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <TeamLogo
            team={matchData.homeTeamObj}
            teamName={matchData.homeTeam}
            size={isMobile ? 20 : 24}
            fontSize={isMobile ? '0.6rem' : '0.7rem'}
          />
          {!isMobile && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                fontSize: '0.85rem'
              }}
              noWrap
            >
              {matchData.homeTeam}
            </Typography>
          )}
        </Box>

        {/* Score and Time */}
        <Box sx={{ textAlign: 'center', px: 1 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'success.main',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            {matchData.homeScore ?? 0} - {matchData.awayScore ?? 0}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'success.main',
              fontWeight: 600,
              fontSize: isMobile ? '0.65rem' : '0.7rem'
            }}
          >
            {match.display_time || matchData.time || '0\''}
          </Typography>
        </Box>

        {/* Away Team */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
          {!isMobile && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                fontSize: '0.85rem'
              }}
              noWrap
            >
              {matchData.awayTeam}
            </Typography>
          )}
          <TeamLogo
            team={matchData.awayTeamObj}
            teamName={matchData.awayTeam}
            size={isMobile ? 20 : 24}
            fontSize={isMobile ? '0.6rem' : '0.7rem'}
          />
        </Box>
      </Box>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={className}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1200,
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '2px solid',
            borderBottomColor: 'success.main',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Main header bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: { xs: 2, md: 3 },
              py: 1.5,
              minHeight: 60,
            }}
          >
            {/* Live indicator and count */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'success.main',
                  animation: isPolling ? 'pulse 2s infinite' : 'none'
                }} />
                <SoccerIcon sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                <Typography variant="h6" sx={{ 
                  color: 'success.main', 
                  fontWeight: 600,
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}>
                  ÉLŐ
                </Typography>
              </Box>
              
              <Chip
                label={`${liveMatches.length} meccs`}
                size="small"
                sx={{
                  backgroundColor: 'success.main',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>

            {/* First live match (always visible) */}
            {liveMatches.length > 0 && (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mx: 2 }}>
                <MatchItem match={liveMatches[0]} />
              </Box>
            )}

            {/* Expand/Collapse button */}
            {liveMatches.length > 1 && (
              <IconButton
                onClick={() => setExpanded(!expanded)}
                sx={{ 
                  color: 'success.main',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  }
                }}
                size="small"
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>

          {/* Expanded matches */}
          <Collapse in={expanded && liveMatches.length > 1}>
            <Box sx={{ 
              px: { xs: 2, md: 3 }, 
              pb: 2,
              borderTop: '1px solid rgba(76, 175, 80, 0.2)'
            }}>
              <Stack 
                direction={isMobile ? 'column' : 'row'} 
                spacing={2} 
                sx={{ mt: 2 }}
                flexWrap="wrap"
                useFlexGap
              >
                {liveMatches.slice(1).map((match) => (
                  <MatchItem key={match.id} match={match} />
                ))}
              </Stack>
            </Box>
          </Collapse>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickyLiveHeader;
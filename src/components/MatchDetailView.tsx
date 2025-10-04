'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
  Badge,
} from '@mui/material';
import TeamLogo from './TeamLogo';
import {
  Person as RefereeIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Match, getTeamColor, formatRefereeName } from '@/utils/dataUtils';
import ImprovedLiveMatchTimer from './ImprovedLiveMatchTimer';
import EnhancedEventDisplay from './EnhancedEventDisplay';
import type { EnhancedEventSchema } from '@/types/api';

interface MatchDetailViewProps {
  match: Match;
}

const MatchDetailView: React.FC<MatchDetailViewProps> = ({ match }) => {
  // Use team objects from match data (includes colors from backend)
  const homeTeam = match.homeTeamObj;
  const awayTeam = match.awayTeamObj;

  // Sort events by minute
  const sortedEvents = [...match.events].sort((a, b) => a.minute - b.minute);
  
  // Debug logging
  console.log('MatchDetailView - match.events:', match.events);
  console.log('MatchDetailView - sortedEvents:', sortedEvents);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Match Header Card */}
      <Paper 
        elevation={2} 
        sx={{ 
          overflow: 'hidden', 
          backgroundColor: '#2d2d2d',
          border: '1px solid #404040',
          borderRadius: '16px'
        }}
      >
        {/* Match Status Bar */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid #404040',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#9aa0a6' }}>
            {match.round}
          </Typography>
          {match.status === 'live' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: 'success.main',
                animation: 'pulse 2s infinite'
              }} />
              <ImprovedLiveMatchTimer 
                startTime={`${match.date}T${match.time}`}
                events={match.events as unknown as EnhancedEventSchema[]}
              />
              <Chip 
                label="ÉLŐ" 
                sx={{ 
                  bgcolor: 'success.main', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                }} 
                size="small" 
              />
            </Box>
          )}
          {match.status === 'finished' && (
            <Chip 
              label="VÉGE" 
              sx={{ 
                bgcolor: '#9aa0a6', 
                color: 'white',
                fontWeight: 'bold'
              }} 
              size="small" 
            />
          )}
          {match.status === 'upcoming' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
              <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                {match.date} • {match.time}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Teams and Score */}
        <Box sx={{ p: 4 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr auto 1fr', 
            gap: 4, 
            alignItems: 'center',
            mb: 3
          }}>
            {/* Home Team */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TeamLogo team={homeTeam} teamName={match.homeTeam} size={56} fontSize="1.2rem" showBorder />
              <Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#e8eaed',
                  lineHeight: 1.2
                }}>
                  {match.homeTeam}
                </Typography>
                {homeTeam && (
                  <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                    {homeTeam.className}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Score */}
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              {match.status !== 'upcoming' && typeof match.homeScore === 'number' && typeof match.awayScore === 'number' ? (
                <Box>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#e8eaed',
                      lineHeight: 1,
                      fontSize: '4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    {match.homeScore}
                    <Typography variant="h3" sx={{ color: '#9aa0a6' }}>-</Typography>
                    {match.awayScore}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h4" sx={{ color: '#4285f4', mb: 1 }}>
                    ⚽
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#9aa0a6', fontWeight: 500 }}>
                    VS
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Away Team */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              justifyContent: 'flex-end' 
            }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#e8eaed',
                  lineHeight: 1.2
                }}>
                  {match.awayTeam}
                </Typography>
                {awayTeam && (
                  <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                    {awayTeam.className}
                  </Typography>
                )}
              </Box>
              <TeamLogo team={awayTeam} teamName={match.awayTeam} size={56} fontSize="1.2rem" showBorder />
            </Box>
          </Box>

          {/* Match Info */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4,
            pt: 3,
            borderTop: '1px solid #404040'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon sx={{ fontSize: 18, color: '#9aa0a6' }} />
              <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                {match.venue}
              </Typography>
            </Box>
            {(match.referee || match.refereeObj) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RefereeIcon sx={{ fontSize: 18, color: '#9aa0a6' }} />
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  Bíró: {match.refereeObj ? formatRefereeName(match.refereeObj) : match.referee}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Match Events Timeline */}
      {sortedEvents.length > 0 && (
        <Paper 
          elevation={2} 
          sx={{ 
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            p: 3, 
            backgroundColor: '#1e1e1e',
            borderBottom: '1px solid #404040'
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: '#e8eaed',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              📋 Mérkőzés Eseményei
              <Badge 
                badgeContent={sortedEvents.length} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#4285f4',
                    color: 'white'
                  }
                }}
              >
                <Box />
              </Badge>
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              {sortedEvents.map((event) => {
                // Convert legacy event to enhanced event format
                const enhancedEvent: EnhancedEventSchema = {
                  id: event.id,
                  match: event.match,
                  event_type: event.event_type || event.type as any || 'goal',
                  minute: event.minute,
                  minute_extra_time: null, // Not available in legacy format
                  player: event.player ? { 
                    id: event.player, 
                    name: event.playerName || 'Unknown Player'
                  } : null,
                  half: 1, // Default to first half for legacy events
                  extra_time: null
                };

                return (
                  <EnhancedEventDisplay
                    key={event.id}
                    event={enhancedEvent}
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                    variant="detailed"
                    // Pass legacy team info for compatibility
                    legacyTeam={event.team}
                  />
                );
              })}
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Match Statistics */}
      {match.status === 'finished' && (
        <Paper 
          elevation={2} 
          sx={{ 
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            p: 3, 
            backgroundColor: '#1e1e1e',
            borderBottom: '1px solid #404040'
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: '#e8eaed',
              textAlign: 'center'
            }}>
              📊 Mérkőzés Statisztikák
            </Typography>
          </Box>
          
          <Box sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr auto 1fr', 
              gap: 4, 
              alignItems: 'center' 
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold', 
                  color: getTeamColor(homeTeam),
                  mb: 1
                }}>
                  {match.events.filter(e => e.type === 'goal' && e.team === 'home').length}
                </Typography>
                <Typography variant="body1" sx={{ color: '#9aa0a6', fontWeight: 500 }}>
                  Gólok
                </Typography>
                <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                  {match.homeTeam}
                </Typography>
              </Box>
              
              <Divider 
                orientation="vertical" 
                flexItem 
                sx={{ 
                  borderColor: '#404040',
                  borderWidth: 1
                }} 
              />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold', 
                  color: getTeamColor(awayTeam),
                  mb: 1
                }}>
                  {match.events.filter(e => e.type === 'goal' && e.team === 'away').length}
                </Typography>
                <Typography variant="body1" sx={{ color: '#9aa0a6', fontWeight: 500 }}>
                  Gólok
                </Typography>
                <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                  {match.awayTeam}
                </Typography>
              </Box>
            </Box>

            {/* Additional Stats */}
            <Box sx={{ 
              mt: 4, 
              pt: 3, 
              borderTop: '1px solid #404040',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 3
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 1 }}>
                  {match.events.filter(e => e.type === 'yellow_card').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  Sárga lapok
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336', mb: 1 }}>
                  {match.events.filter(e => e.type === 'red_card').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  Piros lapok
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3', mb: 1 }}>
                  {match.events.filter(e => e.type === 'substitution').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  Cserék
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MatchDetailView;

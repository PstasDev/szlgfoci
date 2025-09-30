'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Stack,
  Divider,
  Badge,
} from '@mui/material';
import {
  Person as RefereeIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Match, getTeamColor, getTeamColorLight } from '@/utils/dataUtils';
import LiveMatchTimer from './LiveMatchTimer';
import EnhancedEventDisplay from './EnhancedEventDisplay';
import type { EnhancedEventSchema } from '@/types/api';

interface BentoMatchDetailProps {
  match: Match;
}

const BentoMatchDetail: React.FC<BentoMatchDetailProps> = ({ match }) => {
  // Use team objects from match data (includes colors from backend)
  const homeTeam = match.homeTeamObj;
  const awayTeam = match.awayTeamObj;

  // Sort events by minute
  const sortedEvents = [...match.events].sort((a, b) => a.minute - b.minute);
  
  // Debug logging
  console.log('MatchDetailView - match.events:', match.events);
  console.log('MatchDetailView - sortedEvents:', sortedEvents);
  console.log('🔍 RAW EVENT DATA DEBUG:', match.events.map(e => ({
    id: e.id,
    event_type: (e as any).event_type,
    minute: e.minute,
    exact_time: (e as any).exact_time,
    minute_extra_time: (e as any).minute_extra_time,
    half: (e as any).half
  })));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Match Header Card */}
      <Paper 
        elevation={2} 
        sx={{ 
          overflow: 'hidden', 
          background: `linear-gradient(135deg, ${getTeamColorLight(homeTeam)} 0%, ${getTeamColorLight(awayTeam)} 100%)`,
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
              <LiveMatchTimer 
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
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: getTeamColor(homeTeam),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  border: '3px solid rgba(255,255,255,0.1)'
                }}
              >
                {homeTeam?.tagozat?.charAt(0) || homeTeam?.name?.charAt(0) || 'H'}
              </Avatar>
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
              {match.status !== 'upcoming' && match.homeScore !== null && match.awayScore !== null ? (
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
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: getTeamColor(awayTeam),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  border: '3px solid rgba(255,255,255,0.1)'
                }}
              >
                {awayTeam?.tagozat?.charAt(0) || awayTeam?.name?.charAt(0) || 'A'}
              </Avatar>
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
            {match.referee && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RefereeIcon sx={{ fontSize: 18, color: '#9aa0a6' }} />
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  Bíró: {match.referee}
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
                // Cast to any to access extended properties from API
                const eventData = event as any;
                
                const enhancedEvent: EnhancedEventSchema = {
                  id: eventData.id,
                  match: eventData.match,
                  event_type: eventData.event_type || eventData.type || 'goal',
                  minute: eventData.minute,
                  minute_extra_time: eventData.minute_extra_time || eventData.minuteExtraTime || null,
                  player: eventData.player ? { 
                    id: typeof eventData.player === 'object' ? eventData.player.id : eventData.player, 
                    name: typeof eventData.player === 'object' ? eventData.player.name : (eventData.playerName || 'Unknown Player')
                  } : null,
                  half: eventData.half || 1,
                  extra_time: eventData.extra_time || eventData.extraTime || null,
                  exact_time: eventData.exact_time || null
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

      {/* Team Lineups */}
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
            👥 Csapat Felállások
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, 
            gap: 4 
          }}>
            {/* Home Team Players */}
            <Box>
              <Typography variant="h6" sx={{ 
                color: getTeamColor(homeTeam), 
                mb: 2, 
                fontWeight: 600,
                textAlign: 'center'
              }}>
                {match.homeTeam}
              </Typography>
              <Stack spacing={1}>
                {homeTeam?.players?.slice(0, 11).map((player, index) => (
                  <Box key={player.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: 'rgba(255,255,255,0.02)'
                  }}>
                    <Box sx={{ 
                      minWidth: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: getTeamColor(homeTeam),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {index + 1}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#e8eaed' }}>
                      {player.name}
                    </Typography>
                    {player.csk && (
                      <Chip label="CSK" size="small" sx={{ 
                        backgroundColor: '#4285f4', 
                        color: 'white',
                        fontSize: '0.6rem',
                        height: 20
                      }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* VS Divider */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="h4" sx={{ color: '#9aa0a6', fontWeight: 'bold' }}>
                VS
              </Typography>
            </Box>

            {/* Away Team Players */}
            <Box>
              <Typography variant="h6" sx={{ 
                color: getTeamColor(awayTeam), 
                mb: 2, 
                fontWeight: 600,
                textAlign: 'center'
              }}>
                {match.awayTeam}
              </Typography>
              <Stack spacing={1}>
                {awayTeam?.players?.slice(0, 11).map((player, index) => (
                  <Box key={player.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: 'rgba(255,255,255,0.02)'
                  }}>
                    <Box sx={{ 
                      minWidth: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: getTeamColor(awayTeam),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {index + 1}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#e8eaed' }}>
                      {player.name}
                    </Typography>
                    {player.csk && (
                      <Chip label="CSK" size="small" sx={{ 
                        backgroundColor: '#4285f4', 
                        color: 'white',
                        fontSize: '0.6rem',
                        height: 20
                      }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Match Photos */}
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
            📸 Mérkőzés Fotók
            <Badge 
              badgeContent={0} 
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
          <Box sx={{ 
            textAlign: 'center',
            py: 4
          }}>
            <Typography variant="body1" sx={{ color: '#9aa0a6', mb: 2 }}>
              📷 Még nincsenek feltöltött fotók ehhez a mérkőzéshez
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              A fotók hamarosan elérhetőek lesznek!
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BentoMatchDetail;

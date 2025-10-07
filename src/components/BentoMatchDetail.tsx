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
import { Match, getTeamColor, getTeamColorLight, formatRefereeName } from '@/utils/dataUtils';
import ImprovedLiveMatchTimer from './ImprovedLiveMatchTimer';
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: { xs: 2, sm: 3 },
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Match Header Card */}
      <Paper 
        elevation={2} 
        sx={{ 
          overflow: 'hidden', 
          background: `linear-gradient(135deg, ${getTeamColorLight(homeTeam)} 0%, ${getTeamColorLight(awayTeam)} 100%)`,
          border: '1px solid #404040',
          borderRadius: '16px',
          width: '100%'
        }}
      >
        <Box sx={{ 
          p: { xs: 1.5, sm: 2 },
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid #404040',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="body1" sx={{ 
            fontWeight: 600, 
            color: '#9aa0a6',
            fontSize: { xs: '0.85rem', sm: '1rem' }
          }}>
            {match.round}
          </Typography>
          {match.status === 'live' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: 'success.main',
                animation: 'pulse 2s infinite'
              }} />
              <ImprovedLiveMatchTimer 
                startTime={`${match.date}T${match.time}`}
                events={match.events}
              />
              <Chip 
                label="ÉLŐ" 
                sx={{ 
                  bgcolor: 'success.main', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                  height: { xs: 20, sm: 24 }
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
                fontWeight: 'bold',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                height: { xs: 20, sm: 24 }
              }} 
              size="small" 
            />
          )}
          {match.status === 'upcoming' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <TimeIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#9aa0a6' }} />
              <Typography variant="body2" sx={{ 
                color: '#9aa0a6',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                {match.date} • {match.time}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Teams and Score */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 4 }, 
            alignItems: 'center',
            mb: 3
          }}>
            {/* Mobile Layout: Stacked teams with scores */}
            <Box sx={{ 
              display: { xs: 'flex', sm: 'none' },
              flexDirection: 'column',
              gap: 1.5,
              width: '100%'
            }}>
              {/* Home Team Row */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TeamLogo team={homeTeam} teamName={match.homeTeam} size={40} fontSize="0.9rem" showBorder />
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      color: '#e8eaed',
                      lineHeight: 1.2,
                      fontSize: '1.1rem'
                    }}>
                      {match.homeTeam}
                    </Typography>
                    {homeTeam && (
                      <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.75rem' }}>
                        {homeTeam.className}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {/* Home Score */}
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  sx={{ 
                    color: match.status === 'live' ? '#4caf50' : '#e8eaed',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}
                >
                  {match.status !== 'upcoming' && typeof match.homeScore === 'number' ? match.homeScore : '-'}
                </Typography>
              </Box>
              
              {/* Away Team Row */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TeamLogo team={awayTeam} teamName={match.awayTeam} size={40} fontSize="0.9rem" showBorder />
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      color: '#e8eaed',
                      lineHeight: 1.2,
                      fontSize: '1.1rem'
                    }}>
                      {match.awayTeam}
                    </Typography>
                    {awayTeam && (
                      <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.75rem' }}>
                        {awayTeam.className}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {/* Away Score */}
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  sx={{ 
                    color: match.status === 'live' ? '#4caf50' : '#e8eaed',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}
                >
                  {match.status !== 'upcoming' && typeof match.awayScore === 'number' ? match.awayScore : '-'}
                </Typography>
              </Box>

              {/* Mobile VS or Live indicator for upcoming matches */}
              {match.status === 'upcoming' && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="h4" sx={{ 
                    color: '#4285f4', 
                    mb: 1,
                    fontSize: '2rem'
                  }}>
                    ⚽
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    color: '#9aa0a6', 
                    fontWeight: 500,
                    fontSize: '1.25rem'
                  }}>
                    VS
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Desktop Layout: Original layout */}
            {/* Home Team */}
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              alignItems: 'center', 
              gap: 2,
              flex: 1,
              justifyContent: 'flex-start'
            }}>
              <TeamLogo team={homeTeam} teamName={match.homeTeam} size={64} fontSize="1.4rem" showBorder />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#e8eaed',
                  lineHeight: 1.2,
                  fontSize: { sm: '1.5rem', md: '1.75rem' }
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

            {/* Score - Desktop only */}
            <Box sx={{ 
              textAlign: 'center', 
              minWidth: 120,
              display: { xs: 'none', sm: 'block' }
            }}>
              {match.status !== 'upcoming' && typeof match.homeScore === 'number' && typeof match.awayScore === 'number' ? (
                <Box>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#e8eaed',
                      lineHeight: 1,
                      fontSize: { sm: '3rem', md: '4rem' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    {match.homeScore}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: '#9aa0a6',
                        fontSize: { sm: '2rem', md: '3rem' }
                      }}
                    >
                      -
                    </Typography>
                    {match.awayScore}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h4" sx={{ 
                    color: '#4285f4', 
                    mb: 1,
                    fontSize: { sm: '2.5rem', md: '3rem' }
                  }}>
                    ⚽
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    color: '#9aa0a6', 
                    fontWeight: 500,
                    fontSize: { sm: '1.5rem', md: '1.75rem' }
                  }}>
                    VS
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Away Team - Desktop only */}
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              alignItems: 'center', 
              gap: 2,
              flex: 1,
              justifyContent: 'flex-end'
            }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#e8eaed',
                  lineHeight: 1.2,
                  fontSize: { sm: '1.5rem', md: '1.75rem' }
                }}>
                  {match.awayTeam}
                </Typography>
                {awayTeam && (
                  <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                    {awayTeam.className}
                  </Typography>
                )}
              </Box>
              <TeamLogo team={awayTeam} teamName={match.awayTeam} size={64} fontSize="1.4rem" showBorder />
            </Box>
          </Box>

          {/* Match Info */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center', 
            gap: { xs: 2, sm: 4 },
            pt: 3,
            borderTop: '1px solid #404040'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <LocationIcon sx={{ fontSize: 18, color: '#9aa0a6' }} />
              <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                {match.venue}
              </Typography>
            </Box>
            {(match.referee || match.refereeObj) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <RefereeIcon sx={{ fontSize: 18, color: '#9aa0a6' }} />
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  Bíró: {match.refereeObj ? formatRefereeName(match.refereeObj) : match.referee}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Match Protocol / Jegyzőkönyv */}
      {sortedEvents.length > 0 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 900, 
                  color: '#e8eaed',
                  letterSpacing: '-1px',
                  fontSize: { xs: '1.75rem', sm: '2.125rem' },
                  mb: 1
                }}>
                  Jegyzőkönyv
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#9aa0a6',
                  fontWeight: 400,
                  fontSize: '0.95rem'
                }}>
                  Mérkőzés eseményei időrendi sorrendben
                </Typography>
              </Box>
              
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: '#2d2d2d',
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                border: '1px solid #404040'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: '#e8eaed',
                  fontSize: '1.1rem'
                }}>
                  {sortedEvents.length}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#9aa0a6',
                  fontWeight: 500,
                  fontSize: '0.85rem'
                }}>
                  esemény
                </Typography>
              </Box>
            </Stack>

          {/* Enhanced Events List (Dark Mode Style) */}
          <Box sx={{ 
            position: 'relative'
          }}>
            <Stack spacing={1}>
              {[...sortedEvents].reverse().map((event) => { // Create copy before reversing
                // Convert legacy event to enhanced event format
                const eventData = event as any;
                
                const enhancedEvent: EnhancedEventSchema = {
                  id: eventData.id,
                  match: eventData.match,
                  event_type: eventData.event_type || eventData.type || 'goal',
                  minute: eventData.minute,
                  minute_extra_time: eventData.minute_extra_time || eventData.minuteExtraTime || null,
                  formatted_time: eventData.formatted_time || (eventData.minute_extra_time ? `${eventData.minute}+${eventData.minute_extra_time}'` : `${eventData.minute}'`),
                  player: eventData.player ? { 
                    id: typeof eventData.player === 'object' ? eventData.player.id : eventData.player, 
                    name: typeof eventData.player === 'object' ? eventData.player.name : (eventData.playerName || 'Unknown Player')
                  } : null,
                  half: eventData.half || 1,
                  extra_time: eventData.extra_time || eventData.extraTime || null,
                  exact_time: eventData.exact_time || null
                };

                const getEventColor = (eventType: string) => {
                  switch (eventType) {
                    case 'goal': return '#10b981';
                    case 'yellow_card': return '#f59e0b';
                    case 'red_card': return '#ef4444';
                    case 'match_start': return '#4caf50';
                    case 'half_time': return '#ff9800';
                    case 'second_half_start': return '#2196f3';
                    case 'full_time': 
                    case 'match_end': return '#9e9e9e';
                    case 'extra_time': return '#9c27b0';
                    case 'substitution': return '#03a9f4';
                    default: return '#64748b';
                  }
                };

                const getEventLabel = (eventType: string, event: any) => {
                  switch (eventType) {
                    case 'goal': return 'GÓL';
                    case 'yellow_card': return 'SÁRGA LAP';
                    case 'red_card': return 'PIROS LAP';
                    case 'match_start': 
                      // Check if this is actually second half start (minute 11+)
                      return event.minute >= 11 ? 'MÁSODIK FÉLIDŐ KEZDETE' : 'KEZDŐRUGÁS';
                    case 'half_time': return 'FÉLIDŐ VÉGE';
                    case 'second_half_start': return 'MÁSODIK FÉLIDŐ KEZDETE';
                    case 'full_time': return 'RENDES JÁTÉKIDŐ VÉGE';
                    case 'match_end': return 'MECCS VÉGE';
                    case 'extra_time': return 'HOSSZABBÍTÁS';
                    case 'substitution': return 'CSERE';
                    default: return eventType?.toUpperCase() || 'ESEMÉNY';
                  }
                };

                return (
                  <Box 
                    key={event.id}
                    sx={{
                      backgroundColor: '#1e1e1e',
                      border: '1px solid #404040',
                      borderRadius: 2,
                      p: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#2a2a2a',
                        borderColor: getEventColor(enhancedEvent.event_type) + '40'
                      }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: getEventColor(enhancedEvent.event_type)
                        }} />
                        <Box>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 'bold',
                            color: getEventColor(enhancedEvent.event_type)
                          }}>
                            {getEventLabel(enhancedEvent.event_type, enhancedEvent)}
                          </Typography>
                          {enhancedEvent.player?.name && (
                            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                              {enhancedEvent.player.name}
                            </Typography>
                          )}
                          {enhancedEvent.event_type === 'extra_time' && enhancedEvent.extra_time && (
                            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                              +{enhancedEvent.extra_time} perc
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ 
                          color: getEventColor(enhancedEvent.event_type),
                          fontWeight: 'bold'
                        }}>
                          {enhancedEvent.formatted_time || `${enhancedEvent.minute}'`}
                        </Typography>
                        {enhancedEvent.half && (
                          <Typography variant="caption" sx={{ 
                            color: '#9aa0a6',
                            backgroundColor: '#404040',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}>
                            {enhancedEvent.half}. félidő
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Box>
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
          
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 3, sm: 4 }, 
              alignItems: 'center',
              justifyContent: 'space-around'
            }}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold', 
                  color: getTeamColor(homeTeam),
                  mb: 1,
                  fontSize: { xs: '3rem', sm: '4rem' }
                }}>
                  {match.events.filter(e => e.type === 'goal' && e.team === 'home').length}
                </Typography>
                <Typography variant="body1" sx={{ color: '#9aa0a6', fontWeight: 500 }}>
                  Gólok
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#9aa0a6',
                  display: 'block',
                  mt: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  {match.homeTeam}
                </Typography>
              </Box>
              
              <Divider 
                orientation="vertical"
                flexItem 
                sx={{ 
                  borderColor: '#404040',
                  borderWidth: 1,
                  width: { xs: '50%', sm: 'auto' },
                  display: { xs: 'none', sm: 'block' }
                }} 
              />
              <Divider 
                orientation="horizontal"
                sx={{ 
                  borderColor: '#404040',
                  borderWidth: 1,
                  width: '50%',
                  mx: 'auto',
                  display: { xs: 'block', sm: 'none' }
                }} 
              />
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 'bold', 
                  color: getTeamColor(awayTeam),
                  mb: 1,
                  fontSize: { xs: '3rem', sm: '4rem' }
                }}>
                  {match.events.filter(e => e.type === 'goal' && e.team === 'away').length}
                </Typography>
                <Typography variant="body1" sx={{ color: '#9aa0a6', fontWeight: 500 }}>
                  Gólok
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#9aa0a6',
                  display: 'block',
                  mt: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
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
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 3
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: '#ff9800', 
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem' }
                }}>
                  {match.events.filter(e => e.type === 'yellow_card').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  Sárga lapok
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: '#f44336', 
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem' }
                }}>
                  {match.events.filter(e => e.type === 'red_card').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  Piros lapok
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: '#2196f3', 
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem' }
                }}>
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
        
        <Box sx={{ p: { xs: 2, sm: 3, md: 3 } }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, 
            gap: { xs: 3, md: 4 }
          }}>
            {/* Home Team Players */}
            <Box>
              <Typography variant="h6" sx={{ 
                color: getTeamColor(homeTeam), 
                mb: 2, 
                fontWeight: 600,
                textAlign: 'center',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                {match.homeTeam}
              </Typography>
              <Stack spacing={1}>
                {homeTeam?.players?.slice(0, 11).map((player, index) => (
                  <Box key={player.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: { xs: 0.5, sm: 1 },
                    borderRadius: 1,
                    backgroundColor: 'rgba(255,255,255,0.02)'
                  }}>
                    <Box sx={{ 
                      minWidth: { xs: 20, sm: 24 }, 
                      height: { xs: 20, sm: 24 }, 
                      borderRadius: '50%', 
                      backgroundColor: getTeamColor(homeTeam),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {index + 1}
                    </Box>
                    <Typography variant="body2" sx={{ 
                      color: '#e8eaed',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      {player.name}
                    </Typography>
                    {player.csk && (
                      <Chip label="CSK" size="small" sx={{ 
                        backgroundColor: '#4285f4', 
                        color: 'white',
                        fontSize: '0.6rem',
                        height: { xs: 18, sm: 20 }
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
                textAlign: 'center',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                {match.awayTeam}
              </Typography>
              <Stack spacing={1}>
                {awayTeam?.players?.slice(0, 11).map((player, index) => (
                  <Box key={player.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: { xs: 0.5, sm: 1 },
                    borderRadius: 1,
                    backgroundColor: 'rgba(255,255,255,0.02)'
                  }}>
                    <Box sx={{ 
                      minWidth: { xs: 20, sm: 24 }, 
                      height: { xs: 20, sm: 24 }, 
                      borderRadius: '50%', 
                      backgroundColor: getTeamColor(awayTeam),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {index + 1}
                    </Box>
                    <Typography variant="body2" sx={{ 
                      color: '#e8eaed',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      {player.name}
                    </Typography>
                    {player.csk && (
                      <Chip label="CSK" size="small" sx={{ 
                        backgroundColor: '#4285f4', 
                        color: 'white',
                        fontSize: '0.6rem',
                        height: { xs: 18, sm: 20 }
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
        
        <Box sx={{ p: { xs: 2, sm: 3, md: 3 } }}>
          <Box sx={{ 
            textAlign: 'center',
            py: { xs: 3, sm: 4 }
          }}>
            <Typography variant="body1" sx={{ 
              color: '#9aa0a6', 
              mb: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}>
              📷 Még nincsenek feltöltött fotók ehhez a mérkőzéshez
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#666',
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}>
              Van fotód a mérkőzésről? Küldd el a szervezőknek!
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BentoMatchDetail;

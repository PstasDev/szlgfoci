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
  SportsScore as GoalIcon,
  Warning as YellowCardIcon,
  Block as RedCardIcon,
  SwapHoriz as SubstitutionIcon,
  Person as RefereeIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Match, getTeamColor, getClassColor, MatchEvent } from '@/utils/dataUtils';
import LiveMatchTimer from './LiveMatchTimer';

interface MatchDetailViewProps {
  match: Match;
}

const MatchDetailView: React.FC<MatchDetailViewProps> = ({ match }) => {
  // Use team objects from match data (includes colors from backend)
  const homeTeam = match.homeTeamObj;
  const awayTeam = match.awayTeamObj;

  // Helper function to get event type consistently
  const getEventType = (event: MatchEvent): string => {
    return event.type || event.event_type;
  };

  // Helper function to get team avatar letter
  const getTeamAvatarLetter = (team: typeof homeTeam, isHome: boolean): string => {
    if (team?.tagozat) {
      return team.tagozat.charAt(0);
    }
    if (team?.name) {
      return team.name.charAt(0);
    }
    return isHome ? 'H' : 'A';
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return <GoalIcon sx={{ color: '#4caf50', fontSize: 24 }} />;
      case 'yellow_card':
        return <YellowCardIcon sx={{ color: '#ff9800', fontSize: 24 }} />;
      case 'red_card':
        return <RedCardIcon sx={{ color: '#f44336', fontSize: 24 }} />;
      case 'substitution':
        return <SubstitutionIcon sx={{ color: '#2196f3', fontSize: 24 }} />;
      default:
        return <GoalIcon />;
    }
  };

  const getEventEmoji = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return '⚽';
      case 'yellow_card':
        return '🟨';
      case 'red_card':
        return '🟥';
      case 'substitution':
        return '🔄';
      default:
        return '⚽';
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return 'Gól';
      case 'yellow_card':
        return 'Sárga lap';
      case 'red_card':
        return 'Piros lap';
      case 'substitution':
        return 'Csere';
      default:
        return 'Esemény';
    }
  };

  // Sort events by minute
  const sortedEvents = [...match.events].sort((a, b) => a.minute - b.minute);

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
                bgcolor: '#ea4335',
                animation: 'pulse 2s infinite'
              }} />
              <LiveMatchTimer startTime={`${match.date}T${match.time}`} />
              <Chip 
                label="ÉLŐ" 
                sx={{ 
                  bgcolor: '#ea4335', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
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
              {sortedEvents.map((event, index) => {
                const isHomeTeam = event.team === 'home';
                const teamColor = isHomeTeam 
                  ? getTeamColor(homeTeam)
                  : getTeamColor(awayTeam);

                return (
                  <Box 
                    key={event.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2
                    }}
                  >
                    {/* Timeline Connector */}
                    {index < sortedEvents.length - 1 && (
                      <Box sx={{
                        position: 'absolute',
                        left: 24,
                        top: '100%',
                        width: 2,
                        height: 32,
                        backgroundColor: '#404040',
                        zIndex: 1
                      }} />
                    )}

                    {/* Event Time */}
                    <Box sx={{
                      minWidth: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: teamColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      position: 'relative',
                      zIndex: 2
                    }}>
                      {event.minute}&apos;
                    </Box>

                    {/* Event Card Based on Type */}
                    {getEventType(event) === 'goal' ? (
                      // Goal Celebration Card
                      <Box sx={{
                        flex: 1,
                        backgroundColor: 'linear-gradient(135deg, #4285f4 0%, #1976d2 100%)',
                        borderRadius: '16px',
                        p: 3,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(66, 133, 244, 0.3)'
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: -20,
                          right: -20,
                          fontSize: '4rem',
                          opacity: 0.2
                        }}>
                          ⚽
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h4" sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                          }}>
                            GÓÓÓÓÓÓL!!!
                          </Typography>
                          <Box sx={{ fontSize: '2rem' }}>⚽</Box>
                        </Box>

                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          mb: 1,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}>
                          {event.minute}&apos; - {event.player}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 48, 
                            height: 48,
                            border: '2px solid white',
                            bgcolor: teamColor,
                            fontWeight: 'bold'
                          }}>
                            {getTeamAvatarLetter(isHomeTeam ? homeTeam : awayTeam, isHomeTeam)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {isHomeTeam ? match.homeTeam : match.awayTeam}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {isHomeTeam ? homeTeam?.className : awayTeam?.className}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ 
                          mt: 2, 
                          pt: 2, 
                          borderTop: '1px solid rgba(255,255,255,0.2)',
                          textAlign: 'center' 
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {isHomeTeam ? `${(match.homeScore || 0)} - ${match.awayScore || 0}` : `${match.homeScore || 0} - ${(match.awayScore || 0)}`}
                          </Typography>
                        </Box>
                      </Box>
                    ) : getEventType(event) === 'substitution' ? (
                      // Substitution Card
                      <Box sx={{
                        flex: 1,
                        backgroundColor: '#2d2d2d',
                        border: '1px solid #404040',
                        borderRadius: '16px',
                        p: 2,
                        position: 'relative'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mb: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              backgroundColor: '#2196f3',
                              borderRadius: '8px',
                              p: 1,
                              color: 'white'
                            }}>
                              🔄
                            </Box>
                            <Typography variant="h6" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                              CSERE
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ 
                            color: '#9aa0a6',
                            backgroundColor: '#404040',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            fontWeight: 600
                          }}>
                            {event.minute}&apos;
                          </Typography>
                        </Box>

                        {/* Player Coming In */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          mb: 2,
                          p: 1.5,
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(76, 175, 80, 0.3)'
                        }}>
                          <Box sx={{
                            backgroundColor: '#4caf50',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.8rem'
                          }}>
                            ↑
                          </Box>
                          <Typography variant="caption" sx={{ 
                            color: '#4caf50', 
                            fontWeight: 600,
                            minWidth: 20
                          }}>
                            BE
                          </Typography>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: teamColor, color: 'white', fontWeight: 'bold' }}>
                            {getTeamAvatarLetter(isHomeTeam ? homeTeam : awayTeam, isHomeTeam)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                              {event.player}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                              {isHomeTeam ? match.homeTeam : match.awayTeam} • Középpályás #10
                            </Typography>
                          </Box>
                        </Box>

                        {/* Player Going Out */}
                        {/* Note: playerOut is not available in current MatchEvent type - would need API enhancement */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          p: 1.5,
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(244, 67, 54, 0.3)'
                        }}>
                          <Box sx={{
                            backgroundColor: '#f44336',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.8rem'
                          }}>
                            ↓
                          </Box>
                          <Typography variant="caption" sx={{ 
                            color: '#f44336', 
                            fontWeight: 600,
                            minWidth: 20
                          }}>
                            LE
                          </Typography>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: teamColor, color: 'white', fontWeight: 'bold' }}>
                            {getTeamAvatarLetter(isHomeTeam ? homeTeam : awayTeam, isHomeTeam)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                              TBD Player Out
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                              {isHomeTeam ? match.homeTeam : match.awayTeam} • Védő #3
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : getEventType(event) === 'yellow_card' ? (
                      // Yellow Card
                      <Box sx={{
                        flex: 1,
                        backgroundColor: '#2d2d2d',
                        border: '1px solid #ff9800',
                        borderRadius: '16px',
                        p: 2,
                        position: 'relative'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mb: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              backgroundColor: '#ff9800',
                              borderRadius: '8px',
                              p: 1,
                              color: 'white',
                              width: 32,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              🟨
                            </Box>
                            <Typography variant="h6" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                              SÁRGA LAP
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ 
                            color: '#9aa0a6',
                            backgroundColor: '#404040',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            fontWeight: 600
                          }}>
                            {event.minute}&apos;
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 48, 
                            height: 48,
                            bgcolor: teamColor,
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {getTeamAvatarLetter(isHomeTeam ? homeTeam : awayTeam, isHomeTeam)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                              {event.player}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                              {isHomeTeam ? match.homeTeam : match.awayTeam} • Védő #4
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : getEventType(event) === 'red_card' ? (
                      // Red Card
                      <Box sx={{
                        flex: 1,
                        backgroundColor: '#2d2d2d',
                        border: '1px solid #f44336',
                        borderRadius: '16px',
                        p: 2,
                        position: 'relative'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mb: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              backgroundColor: '#f44336',
                              borderRadius: '8px',
                              p: 1,
                              color: 'white',
                              width: 32,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              🟥
                            </Box>
                            <Typography variant="h6" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                              PIROS LAP
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ 
                            color: '#9aa0a6',
                            backgroundColor: '#404040',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            fontWeight: 600
                          }}>
                            {event.minute}&apos;
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 48, 
                            height: 48,
                            bgcolor: teamColor,
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {getTeamAvatarLetter(isHomeTeam ? homeTeam : awayTeam, isHomeTeam)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                              {event.player}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                              {isHomeTeam ? match.homeTeam : match.awayTeam} • Csatár #9
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      // Default Event Card
                      <Box sx={{
                        flex: 1,
                        p: 2,
                        backgroundColor: isHomeTeam ? 'rgba(66, 133, 244, 0.05)' : 'rgba(234, 67, 53, 0.05)',
                        borderRadius: '12px',
                        border: `1px solid ${isHomeTeam ? 'rgba(66, 133, 244, 0.2)' : 'rgba(234, 67, 53, 0.2)'}`,
                        position: 'relative'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '8px',
                            backgroundColor: '#404040',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getEventIcon(getEventType(event))}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body1" sx={{ 
                                fontWeight: 600, 
                                color: '#e8eaed',
                                fontSize: '1.1rem'
                              }}>
                                {getEventEmoji(getEventType(event))} {getEventLabel(getEventType(event))}
                              </Typography>
                              <Chip 
                                label={isHomeTeam ? match.homeTeam : match.awayTeam}
                                size="small"
                                sx={{
                                  backgroundColor: teamColor,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Box>
                            <Typography variant="body1" sx={{ 
                              color: '#e8eaed', 
                              fontWeight: 500
                            }}>
                              {event.player}
                            </Typography>
                          </Box>
                          <Box sx={{
                            width: 8,
                            height: 60,
                            borderRadius: '4px',
                            backgroundColor: teamColor,
                            opacity: 0.8
                          }} />
                        </Box>
                      </Box>
                    )}
                  </Box>
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

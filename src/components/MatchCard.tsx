'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import TeamLogo from './TeamLogo';
import {
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  SportsSoccer
} from '@mui/icons-material';
import { Match, getStatusBadgeProps, isMatchCancelled, getMatchStatusClassName } from '@/utils/dataUtils';
import { getTeamClassDisplayName } from '@/utils/dataUtils';

interface MatchCardProps {
  match: Match;
  variant?: 'detailed' | 'compact' | 'mini';
  showVenue?: boolean;
  showRound?: boolean;
  clickable?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  variant = 'detailed',
  showVenue = true,
  showRound = true,
  clickable = true
}) => {
  const router = useRouter();

  const handleMatchClick = () => {
    if (clickable) {
      router.push(`/merkozesek/${match.id}`);
    }
  };

  // Render status badge if match is cancelled/postponed
  const renderStatusBadge = () => {
    const statusBadge = getStatusBadgeProps(match.cancellationStatus);
    if (!statusBadge) return null;

    return (
      <Chip
        label={statusBadge.text}
        size="small"
        sx={{
          backgroundColor: statusBadge.color === 'warning' ? '#fd7e14' : '#dc3545',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.7rem',
          height: 22,
          boxShadow: statusBadge.color === 'warning' 
            ? '0 2px 4px rgba(253, 126, 20, 0.3)' 
            : '0 2px 4px rgba(220, 53, 69, 0.3)'
        }}
      />
    );
  };

  // Mini variant for sidebars and small spaces
  if (variant === 'mini') {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#2d2d2d',
          border: '1px solid #404040',
          borderRadius: '6px',
          p: 1.5,
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          '&:hover': clickable ? {
            backgroundColor: '#363636',
          } : {},
          opacity: isMatchCancelled(match) ? 0.7 : 1,
          borderLeft: isMatchCancelled(match) ? 
            (match.cancellationStatus === 'cancelled_no_date' ? '4px solid #dc3545' : '4px solid #fd7e14') :
            undefined,
        }}
        onClick={handleMatchClick}
      >
        {/* Status Badge */}
        {renderStatusBadge() && (
          <Box sx={{ mb: 1 }}>
            {renderStatusBadge()}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          {/* Teams */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#e8eaed',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.75rem',
                lineHeight: 1.1
              }}
            >
              {match.homeTeam}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#9aa0a6',
                fontSize: '0.6rem',
                lineHeight: 1,
                display: 'block'
              }}
            >
              ({getTeamClassDisplayName(match.homeTeamObj || null)})
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#e8eaed',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.75rem',
                lineHeight: 1.1
              }}
            >
              {match.awayTeam}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#9aa0a6',
                fontSize: '0.6rem',
                lineHeight: 1,
                display: 'block'
              }}
            >
              ({getTeamClassDisplayName(match.awayTeamObj || null)})
            </Typography>
          </Box>

          {/* Score/Status */}
          <Box sx={{ textAlign: 'right', minWidth: 40 }}>
            {match.status === 'finished' ? (
              <Box>
                <Typography variant="caption" sx={{ color: '#e8eaed', fontWeight: 'bold' }}>
                  {match.homeScore}
                </Typography>
                <Typography variant="caption" sx={{ color: '#e8eaed', display: 'block', fontWeight: 'bold' }}>
                  {match.awayScore}
                </Typography>
              </Box>
            ) : match.status === 'live' && !isMatchCancelled(match) ? (
              <Box>
                <Chip 
                  label="ÉLŐ" 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'success.main', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.6rem',
                    height: 20,
                    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
                  }} 
                />
                <Typography variant="caption" sx={{ color: '#4caf50', fontSize: '0.7rem', display: 'block' }}>
                  {match.homeScore}-{match.awayScore}
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.7rem' }}>
                {match.time}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    );
  }

  // Compact variant for match lists
  if (variant === 'compact') {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#2d2d2d',
          border: '1px solid #404040',
          borderRadius: '8px',
          p: 2,
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          '&:hover': clickable ? {
            backgroundColor: '#363636',
            border: '1px solid #4285f4',
          } : {},
          opacity: isMatchCancelled(match) ? 0.7 : 1,
          borderLeft: isMatchCancelled(match) ? 
            (match.cancellationStatus === 'cancelled_no_date' ? '4px solid #dc3545' : '4px solid #fd7e14') :
            undefined,
        }}
        onClick={handleMatchClick}
      >
        {/* Status Badge */}
        {renderStatusBadge() && (
          <Box sx={{ mb: 2 }}>
            {renderStatusBadge()}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Teams */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={32} fontSize="0.8rem" />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" sx={{ color: '#e8eaed', fontWeight: 500, lineHeight: 1.2 }}>
                  {match.homeTeam}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.7rem', lineHeight: 1 }}>
                  ({getTeamClassDisplayName(match.homeTeamObj || null)})
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={32} fontSize="0.8rem" />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" sx={{ color: '#e8eaed', fontWeight: 500, lineHeight: 1.2 }}>
                  {match.awayTeam}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.7rem', lineHeight: 1 }}>
                  ({getTeamClassDisplayName(match.awayTeamObj || null)})
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Score/Status and Info */}
          <Box sx={{ textAlign: 'center', minWidth: 80 }}>
            {match.status === 'finished' ? (
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#e8eaed' }}>
                  {match.homeScore}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>-</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#e8eaed' }}>
                  {match.awayScore}
                </Typography>
              </Box>
            ) : match.status === 'live' && !isMatchCancelled(match) ? (
              <Box sx={{ mb: 1 }}>
                <Chip 
                  label="ÉLŐ" 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'success.main', 
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
                  }} 
                />
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#4caf50' }}>
                  {match.homeScore} - {match.awayScore}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ color: '#9aa0a6', fontWeight: 500 }}>
                  VS
                </Typography>
                <Typography variant="caption" sx={{ color: '#9aa0a6', display: 'block' }}>
                  {match.date}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                  {match.time}
                </Typography>
              </Box>
            )}
            
            {showRound && (
              <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                {match.round}
              </Typography>
            )}
          </Box>
        </Box>

        {showVenue && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #404040' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#9aa0a6',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.85rem'
              }}
            >
              <LocationIcon sx={{ fontSize: 16 }} />
              {match.venue}
            </Typography>
          </Box>
        )}
      </Paper>
    );
  }

  // Detailed variant - default
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#2d2d2d',
        border: '1px solid #404040',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': clickable ? {
          backgroundColor: '#363636',
          border: '1px solid #4285f4',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        } : {},
        opacity: isMatchCancelled(match) ? 0.7 : 1,
        borderLeft: isMatchCancelled(match) ? 
          (match.cancellationStatus === 'cancelled_no_date' ? '4px solid #dc3545' : '4px solid #fd7e14') :
          undefined,
      }}
      onClick={handleMatchClick}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#1e1e1e',
        borderBottom: '1px solid #404040'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          {showRound && (
            <Typography variant="caption" sx={{ 
              color: '#9aa0a6', 
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
              {match.round}
            </Typography>
          )}
          
          {/* Status Badge */}
          {renderStatusBadge()}
          
          {match.status === 'live' && !isMatchCancelled(match) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: 'success.main',
                animation: 'pulse 2s infinite'
              }} />
              <Chip 
                label={`ÉLŐ • ${match.time}`}
                size="small" 
                sx={{ 
                  backgroundColor: 'success.main', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }} 
              />
            </Box>
          )}
          
          {match.status === 'finished' && !isMatchCancelled(match) && (
            <Typography variant="caption" sx={{ 
              color: '#9aa0a6',
              backgroundColor: '#404040',
              px: 1,
              py: 0.5,
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontWeight: 600
            }}>
              VÉGE
            </Typography>
          )}
          
          {match.status === 'upcoming' && !isMatchCancelled(match) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
              <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                {match.date} • {match.time}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Main Match Info */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: { xs: 'flex', sm: 'grid' },
          flexDirection: { xs: 'column', sm: 'initial' },
          gridTemplateColumns: { sm: '1fr auto 1fr' },
          gap: { xs: 2, sm: 3 }, 
          alignItems: 'center',
          mb: 2
        }}>
          {/* Mobile Layout: Stacked teams with scores */}
          <Box sx={{ 
            display: { xs: 'flex', sm: 'none' },
            flexDirection: 'column',
            gap: 1,
            width: '100%'
          }}>
            {/* Home Team Row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={40} fontSize="0.9rem" showBorder />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#e8eaed', 
                      fontWeight: 600,
                      fontSize: '1rem',
                      lineHeight: 1.2
                    }}
                  >
                    {match.homeTeam}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#9aa0a6',
                      fontSize: '0.7rem',
                      lineHeight: 1
                    }}
                  >
                    ({getTeamClassDisplayName(match.homeTeamObj || null)})
                  </Typography>
                </Box>
              </Box>
              {/* Home Score */}
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  color: (match.status === 'live' && !isMatchCancelled(match)) ? '#4caf50' : '#e8eaed',
                  minWidth: '30px',
                  textAlign: 'center'
                }}
              >
                {match.status !== 'upcoming' ? (match.homeScore ?? 0) : '-'}
              </Typography>
            </Box>
            
            {/* Away Team Row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={40} fontSize="0.9rem" showBorder />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#e8eaed', 
                      fontWeight: 600,
                      fontSize: '1rem',
                      lineHeight: 1.2
                    }}
                  >
                    {match.awayTeam}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#9aa0a6',
                      fontSize: '0.7rem',
                      lineHeight: 1
                    }}
                  >
                    ({getTeamClassDisplayName(match.awayTeamObj || null)})
                  </Typography>
                </Box>
              </Box>
              {/* Away Score */}
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  color: (match.status === 'live' && !isMatchCancelled(match)) ? '#4caf50' : '#e8eaed',
                  minWidth: '30px',
                  textAlign: 'center'
                }}
              >
                {match.status !== 'upcoming' ? (match.awayScore ?? 0) : '-'}
              </Typography>
            </Box>

            {/* Mobile VS or Live indicator */}
            {match.status === 'upcoming' && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <SportsSoccer sx={{ fontSize: 32, color: '#4285f4', mb: 0.5 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#9aa0a6',
                    fontWeight: 500
                  }}
                >
                  VS
                </Typography>
              </Box>
            )}
          </Box>

          {/* Desktop Layout: Original grid layout */}
          {/* Home Team */}
          <Box sx={{ 
            display: { xs: 'none', sm: 'flex' }, 
            alignItems: 'center', 
            gap: 2 
          }}>
            <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={56} fontSize="1.1rem" showBorder />
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#e8eaed', 
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  lineHeight: 1.2
                }}
              >
                {match.homeTeam}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#9aa0a6',
                  fontSize: '0.7rem',
                  lineHeight: 1,
                  display: 'block'
                }}
              >
                ({getTeamClassDisplayName(match.homeTeamObj || null)})
              </Typography>
            </Box>
          </Box>

          {/* Score - Desktop only */}
          <Box sx={{ 
            textAlign: 'center', 
            minWidth: 100,
            display: { xs: 'none', sm: 'block' }
          }}>
            {match.status !== 'upcoming' ? (
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#e8eaed',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'center'
                }}
              >
                {match.homeScore}
                <Typography variant="h4" sx={{ color: '#9aa0a6' }}>-</Typography>
                {match.awayScore}
              </Typography>
            ) : (
              <Box>
                <SportsSoccer sx={{ fontSize: 40, color: '#4285f4', mb: 1 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#9aa0a6',
                    fontWeight: 500
                  }}
                >
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
            justifyContent: 'flex-end' 
          }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#e8eaed', 
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  lineHeight: 1.2
                }}
              >
                {match.awayTeam}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#9aa0a6',
                  fontSize: '0.7rem',
                  lineHeight: 1,
                  display: 'block'
                }}
              >
                ({getTeamClassDisplayName(match.awayTeamObj || null)})
              </Typography>
            </Box>
            <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={56} fontSize="1.1rem" showBorder />
          </Box>
        </Box>

        {/* Venue */}
        {showVenue && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#9aa0a6',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5
              }}
            >
              <LocationIcon sx={{ fontSize: 18 }} />
              {match.venue}
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        {match.status === 'finished' && clickable && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              startIcon={<PlayIcon />}
              variant="outlined"
              size="medium"
              sx={{
                borderColor: '#4285f4',
                color: '#4285f4',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(66, 133, 244, 0.08)',
                  borderColor: '#4285f4',
                },
              }}
            >
              Mérkőzés részletei
            </Button>
          </Box>
        )}

        {match.status === 'upcoming' && clickable && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="medium"
              sx={{
                borderColor: '#9aa0a6',
                color: '#9aa0a6',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(154, 160, 166, 0.08)',
                  borderColor: '#9aa0a6',
                },
              }}
            >
              Emlékeztető beállítása
            </Button>
          </Box>
        )}
      </Box>

      {/* Match Events for Live Games */}
      {match.status === 'live' && match.events.length > 0 && (
        <Box sx={{ 
          px: 3, 
          pb: 3, 
          pt: 0,
          borderTop: '1px solid #404040'
        }}>
          <Typography variant="body2" sx={{ color: '#9aa0a6', mb: 2, fontWeight: 600 }}>
            Legutóbbi események:
          </Typography>
          {match.events.slice(-3).reverse().map((event) => {
            // Helper function to format event time display
            const formatEventTime = (event: any) => {
              // If formatted_time is available, use it (preferred)
              if (event.formatted_time) {
                return event.formatted_time;
              }
              
              // Fallback: construct from minute and minute_extra_time
              const baseMinute = Math.max(1, event.minute);
              if (event.minute_extra_time && event.minute_extra_time > 0) {
                return `${baseMinute}+${event.minute_extra_time}'`;
              }
              
              // Default: just the minute
              return `${baseMinute}'`;
            };

            return (
              <Box key={event.id} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ 
                  color: '#4285f4', 
                  fontWeight: 'bold',
                  minWidth: 30
                }}>
                  {formatEventTime(event)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e8eaed' }}>
                  {event.type === 'goal' ? '⚽' : event.type === 'yellow_card' ? '🟨' : '🟥'} {event.player}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

// Add pulse animation for live indicator
const pulseKeyframes = `
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = pulseKeyframes;
  document.head.appendChild(styleSheet);
}

export default MatchCard;

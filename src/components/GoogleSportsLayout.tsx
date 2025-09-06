'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  FormControl,
  Select,
  Badge,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Home as HomeIcon,
  Sports as SportsIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  SportsScore as ScoreIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { leagueSeasons, getLiveMatches } from '@/data/mockData';

interface GoogleSportsLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onBack?: () => void;
  onClose?: () => void;
}

const GoogleSportsLayout: React.FC<GoogleSportsLayoutProps> = ({
  children,
  title = "SZLG Liga 2024/25",
  subtitle = "Labdarúgó bajnokság",
  showBackButton = false,
  showCloseButton = false,
  onBack,
  onClose,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSeason, setSelectedSeason] = React.useState('2024-25');
  const [mounted, setMounted] = React.useState(false);

  const liveMatches = getLiveMatches();
  const liveMatchCount = liveMatches.length;

  React.useEffect(() => {
    const saved = localStorage.getItem('szlg-selected-season');
    if (saved) {
      setSelectedSeason(saved);
    }
    setMounted(true);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSeasonChange = (event: { target: { value: string } }) => {
    const newSeason = event.target.value;
    setSelectedSeason(newSeason);
    localStorage.setItem('szlg-selected-season', newSeason);
  };

  const navigationItems = [
    { 
      text: 'FŐOLDAL', 
      icon: <HomeIcon />, 
      href: '/',
      active: pathname === '/'
    },
    { 
      text: 'TABELLA', 
      icon: <TrophyIcon />, 
      href: '/tabella',
      active: pathname.startsWith('/tabella')
    },
    { 
      text: 'MECCSEK', 
      icon: <SportsIcon />, 
      href: '/merkozesek',
      active: pathname.startsWith('/merkozesek'),
      badge: liveMatchCount > 0 ? liveMatchCount : undefined
    },
    { 
      text: 'CSAPATOK', 
      icon: <PeopleIcon />, 
      href: '/csapatok',
      active: pathname.startsWith('/csapatok')
    },
    { 
      text: 'GÓLLÖVŐK', 
      icon: <ScoreIcon />, 
      href: '/gollista',
      active: pathname.startsWith('/gollista')
    },
    { 
      text: 'JÁTÉKOSOK', 
      icon: <PeopleIcon />, 
      href: '/jatekosok',
      active: pathname.startsWith('/jatekosok')
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#e8eaed',
      }}
    >
      {/* Enhanced Top Navigation Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 50%, #1e1e1e 100%)',
          borderBottom: '1px solid #404040',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 3 }, py: 1 }}>
          {/* Left side - Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {showBackButton && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={onBack}
                sx={{ 
                  color: '#e8eaed',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            
            {/* Enhanced Logo/Brand with animations */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc04 75%, #ea4335 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(66, 133, 244, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                    boxShadow: '0 8px 30px rgba(66, 133, 244, 0.6)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '120%',
                    height: '120%',
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover::before': {
                    transform: 'translate(-50%, -50%) rotate(-45deg) translateX(100%)',
                  }
                }}
                onClick={() => router.push('/')}
              >
                <SportsIcon sx={{ color: 'white', fontSize: 28, zIndex: 1 }} />
              </Box>
              
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#e8eaed',
                    fontWeight: 800,
                    fontSize: { xs: '1.1rem', sm: '1.4rem' },
                    background: 'linear-gradient(135deg, #4285f4, #34a853, #fbbc04)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      filter: 'brightness(1.2)'
                    }
                  }}
                  onClick={() => router.push('/')}
                >
                  ⚽ SZLG FOCI
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#9aa0a6',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {subtitle}
                  </Typography>
                  {selectedSeason === '2024-25' && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#34a853',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)', opacity: 1 },
                          '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                          '100%': { transform: 'scale(1)', opacity: 1 }
                        }
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Center - Enhanced League Selector with cool animations */}
          {mounted && (
            <Box sx={{ mx: 'auto', display: { xs: 'none', md: 'block' } }}>
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 280,
                  '& .MuiOutlinedInput-root': {
                    background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.15) 0%, rgba(52, 168, 83, 0.15) 50%, rgba(251, 188, 4, 0.15) 100%)',
                    border: '2px solid transparent',
                    borderRadius: 3,
                    backgroundClip: 'padding-box',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, #4285f4, #34a853, #fbbc04, #ea4335)',
                      margin: '-2px',
                      borderRadius: 'inherit',
                      zIndex: -1,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '& fieldset': { border: 'none' },
                    '&:hover': { 
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 25px rgba(66, 133, 244, 0.25)',
                      '&::before': {
                        opacity: 0.7
                      }
                    },
                    '&.Mui-focused': { 
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(66, 133, 244, 0.4)',
                      '&::before': {
                        opacity: 1
                      }
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  },
                  '& .MuiSelect-select': { 
                    color: '#e8eaed',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.5,
                    pl: 2,
                    pr: 4
                  },
                  '& .MuiSvgIcon-root': { 
                    color: '#4285f4',
                    fontSize: 20,
                    transition: 'transform 0.3s ease'
                  },
                  '&:hover .MuiSvgIcon-root': {
                    transform: 'rotate(180deg)'
                  }
                }}
              >
                <Select
                  value={selectedSeason}
                  onChange={handleSeasonChange}
                  displayEmpty
                  renderValue={(value) => {
                    const season = leagueSeasons.find(s => s.id === value);
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            background: 'linear-gradient(45deg, #4285f4, #34a853)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
                          }}
                        >
                          <TrophyIcon sx={{ color: 'white', fontSize: 12 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {season?.displayName || 'Liga kiválasztása'}
                        </Typography>
                        {selectedSeason === '2024-25' && (
                          <Chip 
                            label="AKTÍV"
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(52, 168, 83, 0.2)',
                              color: '#34a853',
                              fontSize: '0.6rem',
                              height: 20,
                              fontWeight: 700
                            }}
                          />
                        )}
                      </Box>
                    );
                  }}
                >
                  {leagueSeasons.map((season) => (
                    <MenuItem 
                      key={season.id} 
                      value={season.id}
                      sx={{
                        backgroundColor: '#2d2d2d',
                        color: '#e8eaed',
                        py: 2,
                        px: 2.5,
                        '&:hover': { 
                          backgroundColor: '#404040',
                          transform: 'translateX(4px)'
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(66, 133, 244, 0.2)',
                          borderLeft: '4px solid #4285f4',
                          '&:hover': {
                            backgroundColor: 'rgba(66, 133, 244, 0.3)',
                          }
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            background: season.id === selectedSeason 
                              ? 'linear-gradient(45deg, #4285f4, #34a853)'
                              : 'linear-gradient(45deg, #666, #888)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: season.id === selectedSeason 
                              ? '0 2px 8px rgba(66, 133, 244, 0.4)'
                              : '0 1px 3px rgba(0,0,0,0.3)',
                          }}
                        >
                          <TrophyIcon sx={{ color: 'white', fontSize: 14 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {season.displayName}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#9aa0a6' }}>
                            {season.id === '2024-25' ? 'Jelenlegi szezon' : 
                             season.id === '2025-26' ? 'Következő szezon' : 'Archív'}
                          </Typography>
                        </Box>
                        {season.id === selectedSeason && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#34a853',
                              boxShadow: '0 0 8px rgba(52, 168, 83, 0.6)'
                            }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Right side - Navigation and Actions */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Enhanced Desktop Navigation with better animations */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.5 }}>
              {navigationItems.slice(0, 4).map((item, index) => (
                <Button
                  key={item.text}
                  component={Link}
                  href={item.href}
                  startIcon={
                    item.badge ? (
                      <Badge 
                        badgeContent={item.badge} 
                        color="error" 
                        sx={{ 
                          '& .MuiBadge-badge': { 
                            fontSize: '0.6rem',
                            minWidth: 16,
                            height: 16,
                            animation: item.badge > 0 ? 'badgePulse 2s infinite' : 'none',
                            '@keyframes badgePulse': {
                              '0%': { transform: 'scale(1)' },
                              '50%': { transform: 'scale(1.2)' },
                              '100%': { transform: 'scale(1)' }
                            }
                          } 
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : item.icon
                  }
                  sx={{ 
                    color: item.active ? '#4285f4' : '#9aa0a6',
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: item.active ? 700 : 600,
                    px: 2.5,
                    py: 1.2,
                    borderRadius: 3,
                    minWidth: 'auto',
                    position: 'relative',
                    background: item.active 
                      ? 'linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(66, 133, 244, 0.05))'
                      : 'transparent',
                    border: item.active ? '1px solid rgba(66, 133, 244, 0.4)' : '1px solid transparent',
                    backdropFilter: item.active ? 'blur(10px)' : 'none',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: item.active ? '80%' : '0%',
                      height: 2,
                      backgroundColor: '#4285f4',
                      transform: 'translateX(-50%)',
                      borderRadius: '2px 2px 0 0',
                      transition: 'width 0.3s ease'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#e8eaed',
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      '&::before': {
                        width: '80%'
                      }
                    },
                    '&:active': {
                      transform: 'translateY(-1px) scale(0.98)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& .MuiButton-startIcon': {
                      marginLeft: 0,
                      marginRight: 0.8,
                      transition: 'transform 0.2s ease'
                    },
                    '&:hover .MuiButton-startIcon': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      display: { xs: 'none', xl: 'flex' },
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    {item.text}
                    {item.active && (
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          backgroundColor: '#4285f4',
                          animation: 'activeGlow 2s infinite',
                          '@keyframes activeGlow': {
                            '0%': { boxShadow: '0 0 0 0 rgba(66, 133, 244, 0.7)' },
                            '70%': { boxShadow: '0 0 0 4px rgba(66, 133, 244, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(66, 133, 244, 0)' }
                          }
                        }}
                      />
                    )}
                  </Box>
                </Button>
              ))}
            </Box>

            {/* Enhanced Live indicator with pulse animation */}
            {liveMatchCount > 0 && (
              <Chip
                icon={
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: '#ea4335',
                      animation: 'livePulse 1.5s infinite',
                      '@keyframes livePulse': {
                        '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(234, 67, 53, 0.7)' },
                        '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(234, 67, 53, 0)' },
                        '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(234, 67, 53, 0)' }
                      }
                    }} 
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.7rem' }}>
                      {liveMatchCount}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.7rem' }}>
                      ÉLŐ
                    </Typography>
                  </Box>
                }
                size="small"
                sx={{
                  backgroundColor: 'rgba(234, 67, 53, 0.15)',
                  color: '#ea4335',
                  border: '1px solid rgba(234, 67, 53, 0.4)',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    backgroundColor: 'rgba(234, 67, 53, 0.25)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(234, 67, 53, 0.3)'
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => router.push('/merkozesek')}
              />
            )}

            {/* Notifications */}
            <IconButton
              color="inherit"
              sx={{ 
                color: '#9aa0a6',
                '&:hover': { 
                  color: '#4285f4',
                  backgroundColor: 'rgba(66, 133, 244, 0.1)' 
                }
              }}
            >
              <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>

            {/* More menu */}
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ 
                color: '#9aa0a6',
                '&:hover': { 
                  color: '#4285f4',
                  backgroundColor: 'rgba(66, 133, 244, 0.1)' 
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>

            {showCloseButton && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                sx={{ 
                  color: '#e8eaed',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile League Selector */}
        {mounted && (
          <Box sx={{ 
            px: 2, 
            pb: 1, 
            display: { xs: 'block', md: 'none' },
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <FormControl 
              size="small" 
              fullWidth
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(66, 133, 244, 0.1)',
                  border: '1px solid rgba(66, 133, 244, 0.3)',
                  borderRadius: 1,
                  '& fieldset': { border: 'none' },
                },
                '& .MuiSelect-select': { 
                  color: '#e8eaed',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                },
                '& .MuiSvgIcon-root': { color: '#4285f4' },
              }}
            >
              <Select
                value={selectedSeason}
                onChange={handleSeasonChange}
                displayEmpty
              >
                {leagueSeasons.map((season) => (
                  <MenuItem 
                    key={season.id} 
                    value={season.id}
                    sx={{
                      backgroundColor: '#2d2d2d',
                      color: '#e8eaed',
                      '&:hover': { backgroundColor: '#404040' },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(66, 133, 244, 0.2)',
                      }
                    }}
                  >
                    <TrophyIcon sx={{ mr: 1, fontSize: 16, color: '#4285f4' }} />
                    {season.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </AppBar>

      {/* Enhanced Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            minWidth: 200,
            '& .MuiMenuItem-root': {
              color: '#e8eaed',
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: '#404040',
              },
            },
          },
        }}
      >
        {/* Mobile navigation items */}
        {navigationItems.map((item) => (
          <MenuItem 
            key={item.text}
            onClick={() => {
              handleMenuClose();
              router.push(item.href);
            }}
            sx={{ display: { lg: 'flex', xl: 'none' } }}
          >
            {item.badge ? (
              <Badge badgeContent={item.badge} color="error" sx={{ mr: 2 }}>
                {item.icon}
              </Badge>
            ) : (
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
            )}
            {item.text}
          </MenuItem>
        ))}
        
        <Divider sx={{ borderColor: '#404040', my: 1, display: { lg: 'block', xl: 'none' } }} />
        
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 2 }} />
          Megosztás
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <TrendingUpIcon sx={{ mr: 2 }} />
          Statisztikák
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 2 }} />
          Beállítások
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 3 }
        }}
      >
        {children}
      </Container>

      {/* Bottom spacing for mobile */}
      <Box sx={{ height: { xs: 60, sm: 30 } }} />
    </Box>
  );
};

export default GoogleSportsLayout;

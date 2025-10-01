'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActions,
  Button, 
  Alert,
  CircularProgress,
  Stack,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  useTheme
} from '@mui/material';
import { 
  SportsSoccer as SoccerIcon,
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon,
  CheckCircle as DoneIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// API base URL helper
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    return isLocalhost ? 'http://localhost:8000/api' : 'https://fociapi.szlg.info/api';
  }
  return 'http://localhost:8000/api';
};

// Types
interface Team {
  id: number;
  name: string | null;
  start_year: number;
  tagozat: string;
  color: string;
  active: boolean;
  players: Player[];
}

interface Player {
  id: number;
  name: string;
  csk: boolean;
  start_year: number | null;
  tagozat: string | null;
  effective_start_year: number | null;
  effective_tagozat: string | null;
}

interface MatchStatus {
  id: number;
  team1: Team;
  team2: Team;
  datetime: string;
  referee: any;
  events: any[];
  score: [number, number];
  status: string;
}

interface DashboardData {
  today_matches: Array<{
    id: number;
    team1: string;
    team2: string;
    datetime: string;
    status: string;
    score: [number, number];
  }>;
  upcoming_matches: Array<{
    id: number;
    team1: string;
    team2: string;
    datetime: string;
    status: string;
    score: [number, number];
  }>;
  recent_matches: Array<{
    id: number;
    team1: string;
    team2: string;
    datetime: string;
    status: string;
    score: [number, number];
  }>;
  total_assigned_matches: number;
}

// Auth service
const authService = {
  async logout() {
    const apiBaseUrl = getApiBaseUrl();
    await fetch(`${apiBaseUrl}/auth/logout`, { 
      method: 'POST',
      credentials: 'include'
    });
  },

  async checkAuthStatus() {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/auth/status`, {
        credentials: 'include'
      });
      return await response.json();
    } catch {
      return { authenticated: false };
    }
  }
};

// API service
const apiService = {
  async getLiveMatches(): Promise<MatchStatus[]> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/biro/live-matches`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch live matches');
    return response.json();
  },

  async getDashboard(): Promise<DashboardData> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/biro/dashboard`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard');
    return response.json();
  }
};

const RefereeDashboard: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const [liveMatches, setLiveMatches] = useState<MatchStatus[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError('');
      const [liveMatchesData, dashboardData] = await Promise.all([
        apiService.getLiveMatches(),
        apiService.getDashboard()
      ]);
      setLiveMatches(liveMatchesData);
      setDashboard(dashboardData);
    } catch (error) {
      if (error instanceof Error && error.message.includes('403')) {
        router.push('/elo-jegyzokonyv');
        return;
      }
      setError('Nem sikerült betölteni az adatokat');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await authService.checkAuthStatus();
      if (!authStatus.authenticated) {
        router.push('/elo-jegyzokonyv');
        return;
      }
      loadData();
    };

    checkAuth();
  }, [router, loadData]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/elo-jegyzokonyv');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'default';
      case 'first_half': case 'second_half': return 'success';
      case 'half_time': return 'warning';
      case 'finished': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started': return 'Nem kezdődött el';
      case 'first_half': return 'Első félidő';
      case 'second_half': return 'Második félidő';
      case 'half_time': return 'Szünet';
      case 'finished': return 'Befejezett';
      default: return status;
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('hu-HU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTeamName = (team: Team) => {
    return team.name || `${team.start_year}/${team.tagozat}`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Top App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.primary.main}20`,
          color: theme.palette.text.primary
        }}
      >
        <Toolbar>
          <SoccerIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Bírói felület
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ mr: 1 }}
          >
            <RefreshIcon sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Újrapróbálkozás
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Live Matches Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: theme.palette.text.primary }}>
            Élő mérkőzések
          </Typography>
          
          {liveMatches.length === 0 ? (
            <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <TimeIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Nincs élő mérkőzés
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jelenleg nincs olyan mérkőzés, amelyet vezetnie kellene
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {liveMatches.map((match) => (
                <Card 
                  key={match.id}
                  sx={{ 
                    borderRadius: 3,
                    border: `2px solid ${match.status === 'not_started' ? theme.palette.primary.main : theme.palette.divider}`,
                    boxShadow: match.status === 'not_started' ? `0 4px 20px ${theme.palette.primary.main}15` : 1,
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Chip 
                        label={getStatusText(match.status)}
                        color={getStatusColor(match.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(match.datetime)}
                      </Typography>
                    </Stack>

                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Box sx={{ flex: 1, textAlign: 'right' }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: match.team1.color }}>
                            {getTeamName(match.team1)}
                          </Typography>
                        </Box>
                        
                        <Box 
                          sx={{ 
                            px: 2, 
                            py: 1, 
                            backgroundColor: theme.palette.action.hover, 
                            borderRadius: 2,
                            minWidth: 80,
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                            {match.score[0]} - {match.score[1]}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ flex: 1, textAlign: 'left' }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: match.team2.color }}>
                            {getTeamName(match.team2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={() => router.push(`/elo-jegyzokonyv/match/${match.id}`)}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        }
                      }}
                    >
                      Mérkőzés vezetése
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          )}
        </Box>

        {/* Dashboard Overview */}
        {dashboard && (
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: theme.palette.text.primary }}>
              Áttekintés
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <Card sx={{ flex: 1, borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
                    {dashboard.today_matches.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mai mérkőzések
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1, borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.warning.main }}>
                    {dashboard.upcoming_matches.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Következő mérkőzések
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1, borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.secondary.main }}>
                    {dashboard.total_assigned_matches}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Összes kijelölt
                  </Typography>
                </CardContent>
              </Card>
            </Stack>

            {/* Recent Matches */}
            {dashboard.recent_matches.length > 0 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: theme.palette.text.primary }}>
                  Legutóbbi mérkőzések
                </Typography>
                <Stack spacing={1}>
                  {dashboard.recent_matches.slice(0, 3).map((match) => (
                    <Card key={match.id} sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ py: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2">
                            {match.team1} vs {match.team2}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" fontWeight="bold">
                              {match.score[0]}-{match.score[1]}
                            </Typography>
                            <DoneIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default RefereeDashboard;
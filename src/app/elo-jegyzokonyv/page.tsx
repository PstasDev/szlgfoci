'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  Stack,
  useTheme
} from '@mui/material';
import { 
  SportsSoccer as SoccerIcon,
  Login as LoginIcon 
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// API base URL helper
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    const apiUrl = isLocalhost ? 'http://localhost:8000/api' : 'https://fociapi.szlg.info/api';
    console.log('🌐 API Base URL:', apiUrl, '(localhost:', isLocalhost, ')');
    return apiUrl;
  }
  return 'http://localhost:8000/api';
};

// Auth utility functions
const authService = {
  async login(username: string, password: string) {
    const apiBaseUrl = getApiBaseUrl();
    console.log('🔐 Attempting login to:', `${apiBaseUrl}/auth/login`);
    console.log('📦 Login payload:', { username, password: '***' });
    
    try {
      console.log('⏳ Making fetch request...');
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include', // Include cookies
        body: JSON.stringify({ username, password }),
      });
      
    console.log('✅ Fetch completed successfully!');
    console.log('📡 Login response status:', response.status, response.statusText);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.text();
        console.log('❌ Login error response:', errorData);
        // Try to parse as JSON, fallback to text
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.message || errorJson.error || errorData;
        } catch {
          errorMessage = errorData || errorMessage;
        }
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    // Parse successful response
    console.log('📄 Parsing response as JSON...');
    const data = await response.json();
    console.log('✅ Login response data:', data);
    console.log('🔍 Response has success field?', 'success' in data, 'value:', data.success);
    console.log('🔍 Response has token field?', 'token' in data, 'token length:', data.token?.length);
    
    // Check if login was successful according to backend
    if (!data.success) {
      console.log('❌ Backend reports login failed:', data.message);
      throw new Error(data.message || 'Login failed');
    }
    
    // Store the token in localStorage for production environments where cookies might not work
    if (data.token) {
      console.log('💾 Storing token in localStorage');
      localStorage.setItem('jwt_token', data.token);
      
      // Also set a flag that we have a fresh token
      localStorage.setItem('token_timestamp', Date.now().toString());
    }
    
    return data;    } catch (fetchError) {
      console.error('💥 Network/Fetch error:', fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown network error';
      throw new Error(`Network error: ${errorMessage}`);
    }
  },

  async checkAuthStatus() {
    try {
      const apiBaseUrl = getApiBaseUrl();
      console.log('🔍 Checking auth status at:', `${apiBaseUrl}/auth/status`);
      
      // Get token from localStorage
      const token = localStorage.getItem('jwt_token');
      
      let response;
      
      // If we have a token, prefer using it over cookies (more reliable in production)
      if (token) {
        console.log('🔑 Using token from localStorage for auth check...');
        response = await fetch(`${apiBaseUrl}/auth/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        console.log('📡 Auth status response (token):', response.status, response.statusText);
      } else {
        console.log('🍪 Trying with cookies...');
        response = await fetch(`${apiBaseUrl}/auth/status`, {
          credentials: 'include',
          mode: 'cors'
        });
        console.log('📡 Auth status response (cookies):', response.status, response.statusText);
      }
      
      if (!response.ok) {
        console.log('❌ Auth status check failed');
        // Clear invalid token if we have one
        if (token) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('token_timestamp');
        }
        return { authenticated: false, user: null };
      }
      
      const data = await response.json();
      console.log('✅ Auth status:', data);
      return data;
    } catch (error) {
      console.log('❌ Auth status error:', error);
      return { authenticated: false, user: null };
    }
  },

  async logout() {
    const apiBaseUrl = getApiBaseUrl();
    console.log('🚪 Logging out at:', `${apiBaseUrl}/auth/logout`);
    
    // Get token before clearing localStorage
    const token = localStorage.getItem('jwt_token');
    
    // Try to logout on server BEFORE clearing local storage
    let serverLogoutSuccess = false;
    
    try {
      // First, try with cookies (this is most important for clearing HTTP-only cookies)
      console.log('🍪 Attempting logout with cookies (primary method)...');
      const cookieResponse = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('📡 Cookie logout response:', cookieResponse.status, cookieResponse.statusText);
      
      if (cookieResponse.ok) {
        console.log('✅ Cookie-based logout successful');
        serverLogoutSuccess = true;
      }
      
      // Also try with token if we have one (backup method)
      if (token) {
        console.log('🔑 Attempting logout with token (backup method)...');
        const tokenResponse = await fetch(`${apiBaseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        console.log('📡 Token logout response:', tokenResponse.status, tokenResponse.statusText);
        
        if (tokenResponse.ok) {
          console.log('✅ Token-based logout successful');
          serverLogoutSuccess = true;
        }
      }
    } catch (error) {
      console.log('❌ Server logout requests failed:', error);
    }
    
    // Clear local storage after server logout attempts
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token_timestamp');
    console.log('🧹 Local storage cleared');
    
    console.log('📡 Logout completed, success:', serverLogoutSuccess);
    return serverLogoutSuccess;
  }
};

const RefereeLoginPage: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Login page: Checking authentication status...');
        
        const authStatus = await authService.checkAuthStatus();
        console.log('📊 Auth status result:', authStatus);
        
        if (authStatus.authenticated) {
          // Check if user is a referee by trying to access referee endpoint
          const apiBaseUrl = getApiBaseUrl();
          console.log('🛡️ Checking referee permissions at startup:', `${apiBaseUrl}/biro/dashboard`);
          
          // Get token from localStorage
          const token = localStorage.getItem('jwt_token');
          
          let response;
          
          // If we have a token, try with token first
          if (token) {
            console.log('🔑 Trying referee check with Authorization header...');
            response = await fetch(`${apiBaseUrl}/biro/dashboard`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              mode: 'cors'
            });
            console.log('📡 Referee check response (token):', response.status, response.statusText);
          } else {
            console.log('🍪 Trying referee check with cookies...');
            response = await fetch(`${apiBaseUrl}/biro/dashboard`, {
              credentials: 'include',
              mode: 'cors'
            });
            console.log('📡 Referee check response (cookies):', response.status, response.statusText);
          }
          
          if (response && response.ok) {
            console.log('✅ User already authenticated and has referee permissions, redirecting...');
            router.push('/elo-jegyzokonyv/dashboard');
            return;
          } else {
            console.log('❌ Referee permissions check failed, staying on login page');
            // Clear any invalid tokens
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('token_timestamp');
          }
        } else {
          console.log('❌ User not authenticated, staying on login page');
        }
      } catch (error) {
        console.log('❌ Auth check failed:', error);
        // Clear any problematic tokens
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('token_timestamp');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔑 Starting login process...');
    console.log('📧 Username:', username);
    console.log('🔒 Password length:', password.length);
    
    if (!username.trim() || !password.trim()) {
      setError('Kérjük, töltse ki minden mezőt!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📡 Calling authService.login...');
      const loginResult = await authService.login(username, password);
      console.log('🎯 Login result:', loginResult);
      
      // Check if the response indicates success
      if (loginResult && loginResult.success) {
        console.log('✅ Login successful, checking referee permissions...');
        // Verify referee permissions
        const apiBaseUrl = getApiBaseUrl();
        console.log('🛡️ Checking referee permissions at:', `${apiBaseUrl}/biro/dashboard`);
        
        // Try with cookies first
        let response = await fetch(`${apiBaseUrl}/biro/dashboard`, {
          credentials: 'include',
          mode: 'cors'
        });
        
        console.log('📡 Referee check response (cookies):', response.status, response.statusText);
        
        // If cookies failed, try with Authorization header
        if (!response.ok && loginResult.token) {
          console.log('🔑 Trying referee check with Authorization header...');
          response = await fetch(`${apiBaseUrl}/biro/dashboard`, {
            headers: {
              'Authorization': `Bearer ${loginResult.token}`
            },
            mode: 'cors'
          });
          console.log('📡 Referee check response (token):', response.status, response.statusText);
        }
        
        if (response.ok) {
          console.log('✅ Referee permissions confirmed, redirecting...');
          router.push('/elo-jegyzokonyv/dashboard');
        } else {
          console.log('❌ Referee permissions denied:', response.status);
          setError('Nincs bírói jogosultsága!');
          await authService.logout();
        }
      } else {
        console.log('❌ Login response missing success field:', loginResult);
        setError('Váratlan válasz a szervertől!');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      setError('Hibás felhasználónév vagy jelszó!');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
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
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.action.hover} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            border: `1px solid ${theme.palette.primary.main}20`,
            boxShadow: `0 25px 50px -12px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.15)'}, 0 0 0 1px ${theme.palette.primary.main}10`,
          }}
        >
          <Stack spacing={3} alignItems="center">
            {/* Header */}
            <Box textAlign="center">
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  mb: 2,
                  boxShadow: `0 10px 25px ${theme.palette.primary.main}30`,
                }}
              >
                <SoccerIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                sx={{ 
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Élő jegyzőkönyv
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ maxWidth: 280, mx: 'auto' }}
              >
                Bírói felület mérkőzések élő vezetéséhez
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={3}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-message': { fontWeight: 500 }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Felhasználónév"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Jelszó"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 4px 15px ${theme.palette.primary.main}30`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: `linear-gradient(135deg, ${theme.palette.action.disabled}, ${theme.palette.action.disabledBackground})`,
                    },
                  }}
                >
                  {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                </Button>
              </Stack>
            </Box>

            {/* Info */}
            <Typography 
              variant="caption" 
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 2, opacity: 0.8 }}
            >
              Csak bírók számára elérhető
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default RefereeLoginPage;
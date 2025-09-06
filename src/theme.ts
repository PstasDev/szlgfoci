'use client';
import { createTheme } from '@mui/material/styles';
import { huHU } from '@mui/material/locale';

// Google Sports inspired dark theme colors
const googleSportsColors = {
  background: '#1a1a1a', // Dark background like Google Sports
  surface: '#2d2d2d', // Card backgrounds
  surfaceVariant: '#363636', // Lighter surface
  onSurface: '#ffffff', // White text on dark surfaces
  onSurfaceVariant: '#e0e0e0', // Light gray text
  primary: '#4285f4', // Google blue
  primaryContainer: '#1e3a8a',
  secondary: '#34a853', // Google green
  tertiary: '#ea4335', // Google red
  outline: '#474747', // Border colors
};

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark', // Switch to dark mode
    primary: {
      main: googleSportsColors.primary, // Google blue
      light: '#5a9eff',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: googleSportsColors.secondary, // Google green
      light: '#4db86e',
      dark: '#2e7d32',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50', // Success green
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800', // Yellow cards
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    error: {
      main: googleSportsColors.tertiary, // Google red
      light: '#ff6659',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    background: {
      default: googleSportsColors.background, // Dark background
      paper: googleSportsColors.surface, // Dark card background
    },
    text: {
      primary: googleSportsColors.onSurface, // White text
      secondary: googleSportsColors.onSurfaceVariant, // Light gray text
      disabled: '#9e9e9e',
    },
    divider: googleSportsColors.outline,
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(66, 133, 244, 0.12)',
      disabled: '#6c6c6c',
      disabledBackground: '#404040',
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#ffffff', // White text for headers
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#ffffff', // White text for headers
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#ffffff', // White text for headers
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#ffffff', // White text for headers
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#ffffff', // White text for headers
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#ffffff', // White text for headers
    },
    body1: {
      color: '#ffffff', // White body text
      lineHeight: 1.6,
    },
    body2: {
      color: '#e0e0e0', // Light gray body text
      lineHeight: 1.5,
    },
    caption: {
      color: '#b0b0b0', // Light gray captions
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Less rounded like Google Sports
          backgroundColor: googleSportsColors.surface, // Dark card background
          border: `1px solid ${googleSportsColors.outline}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default gradient
          backgroundColor: googleSportsColors.surface,
          color: googleSportsColors.onSurface,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: googleSportsColors.surface,
          color: googleSportsColors.onSurface,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Less rounded
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 36,
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
          },
        },
        text: {
          color: googleSportsColors.onSurface,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          backgroundColor: googleSportsColors.surfaceVariant,
          color: googleSportsColors.onSurface,
          '& .MuiChip-label': {
            paddingLeft: 8,
            paddingRight: 8,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${googleSportsColors.outline}`,
          color: googleSportsColors.onSurface,
        },
        head: {
          backgroundColor: googleSportsColors.surfaceVariant,
          fontWeight: 600,
          color: googleSportsColors.onSurface,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: googleSportsColors.surface,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: googleSportsColors.primary,
          color: googleSportsColors.onSurface,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit', // Use inherited color from parent
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: googleSportsColors.outline,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: googleSportsColors.outline,
          },
          '&:hover fieldset': {
            borderColor: googleSportsColors.onSurfaceVariant,
          },
          '&.Mui-focused fieldset': {
            borderColor: googleSportsColors.primary,
          },
        },
        input: {
          color: googleSportsColors.onSurface,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: googleSportsColors.onSurfaceVariant,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: googleSportsColors.onSurfaceVariant,
        },
      },
    },
  },
}, huHU); // Hungarian locale

export default theme;

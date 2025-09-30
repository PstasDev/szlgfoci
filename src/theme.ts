'use client';
import { createTheme } from '@mui/material/styles';
import { huHU } from '@mui/material/locale';

// Clean sports theme - minimalistic approach
const cleanSportsColors = {
  background: '#1a1a1a', // Clean dark background
  surface: '#2d2d2d', // Card backgrounds
  surfaceVariant: '#363636', // Lighter surface
  onSurface: '#ffffff', // White text on dark surfaces
  onSurfaceVariant: '#e0e0e0', // Light gray text
  primary: '#4285f4', // Clean blue
  primaryContainer: '#1e3a8a',
  secondary: '#34a853', // Clean green
  tertiary: '#ea4335', // Clean red
  outline: '#474747', // Border colors
};

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: cleanSportsColors.primary,
      light: '#5a9eff',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: cleanSportsColors.secondary,
      light: '#4db86e',
      dark: '#2e7d32',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    error: {
      main: cleanSportsColors.tertiary,
      light: '#ff6659',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    background: {
      default: cleanSportsColors.background,
      paper: cleanSportsColors.surface,
    },
    text: {
      primary: cleanSportsColors.onSurface,
      secondary: cleanSportsColors.onSurfaceVariant,
      disabled: '#9ca3af',
    },
    divider: cleanSportsColors.outline,
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(66, 133, 244, 0.12)',
      disabled: '#6b7280',
      disabledBackground: '#374151',
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
          borderRadius: 8,
          backgroundColor: cleanSportsColors.surface,
          border: `1px solid ${cleanSportsColors.outline}`,
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
          backgroundImage: 'none',
          backgroundColor: cleanSportsColors.surface,
          color: cleanSportsColors.onSurface,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: cleanSportsColors.surface,
          color: cleanSportsColors.onSurface,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
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
          color: cleanSportsColors.onSurface,
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
          backgroundColor: cleanSportsColors.surfaceVariant,
          color: cleanSportsColors.onSurface,
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
          borderBottom: `1px solid ${cleanSportsColors.outline}`,
          color: cleanSportsColors.onSurface,
        },
        head: {
          backgroundColor: cleanSportsColors.surfaceVariant,
          fontWeight: 600,
          color: cleanSportsColors.onSurface,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: cleanSportsColors.surface,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: cleanSportsColors.primary,
          color: cleanSportsColors.onSurface,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: cleanSportsColors.outline,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: cleanSportsColors.outline,
          },
          '&:hover fieldset': {
            borderColor: cleanSportsColors.onSurfaceVariant,
          },
          '&.Mui-focused fieldset': {
            borderColor: cleanSportsColors.primary,
          },
        },
        input: {
          color: cleanSportsColors.onSurface,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: cleanSportsColors.onSurfaceVariant,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: cleanSportsColors.onSurfaceVariant,
        },
      },
    },
  },
}, huHU); // Hungarian locale

export default theme;
